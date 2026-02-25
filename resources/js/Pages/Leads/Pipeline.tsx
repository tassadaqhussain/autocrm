import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    LayoutList,
    Columns,
    MoreHorizontal,
    User,
    Target,
    Zap,
    Phone,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Clock,
    FileText,
    ExternalLink,
    AlertCircle,
    DollarSign,
    Scale,
    UserCircle,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useMemo } from 'react';
import Drawer from '@/Components/Drawer';
import CreateLeadDrawer from '@/Components/Leads/CreateLeadDrawer';
import CreateDealDrawer from '@/Components/Deals/CreateDealDrawer';
import { useEffect } from 'react';

interface Campaign {
    id: number;
    name: string;
}

interface Counselor {
    id: number;
    name: string;
}

interface Lead {
    id: number;
    name: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    bmi?: number;
    urgency?: string;
    health_info?: string;
    campaign?: { name: string };
    counselor?: { name: string };
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
}

interface Deal {
    id: number;
    name: string;
    stage: string;
    value: string;
    category?: string;
    lead?: { name: string };
    agent?: { name: string };
}

interface Props {
    leads: Lead[];
    deals: Deal[];
    campaigns: Campaign[];
    counselors: Counselor[];
    products: Product[];
    categories: Category[];
}

const statusColumns = [
    { id: 'New', title: 'New Leads', color: 'bg-blue-500', icon: Target },
    { id: 'Contacted', title: 'Contacted', color: 'bg-amber-500', icon: Phone },
    { id: 'Appointment Scheduled', title: 'Appointment', color: 'bg-purple-500', icon: Calendar },
    { id: 'Consultation Done', title: 'Consulted', color: 'bg-emerald-500', icon: CheckCircle2 },
];

export default function Pipeline({ leads: initialLeads, deals, campaigns, counselors, products, categories }: Props) {
    const [leads, setLeads] = useState(initialLeads);
    const [viewMode, setViewMode] = useState<'leads' | 'deals'>('leads');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === 'true') {
            setIsCreateModalOpen(true);
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/[?&]create=true/, ''));
        }
    }, []);

    const columns = useMemo(() => {
        return statusColumns.map(col => {
            // Map Lead statuses for Lead View
            const columnLeads = initialLeads.filter(l => l.status === col.id);

            // Map Deal stages for Deal View
            const stageMapping: Record<string, string> = {
                'New': 'Generated',
                'Contacted': 'In Progress',
                'Appointment Scheduled': 'Negotiation',
                'Consultation Done': 'Closed Won'
            };

            const columnDeals = (deals || []).filter(d => d.stage === stageMapping[col.id]);

            return {
                ...col,
                // Only include the items for the active view mode
                items: viewMode === 'leads'
                    ? columnLeads.map(l => ({ ...l, type: 'lead' }))
                    : columnDeals.map(d => ({ ...d, type: 'deal' }))
            };
        });
    }, [initialLeads, deals, viewMode]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (viewMode === 'leads' && draggableId.startsWith('lead_')) {
            const leadId = parseInt(draggableId.replace('lead_', ''));
            const newStatus = destination.droppableId;
            router.patch(route('leads.status', leadId), { status: newStatus }, { preserveScroll: true });
        }

        // Handle Deal moving
        if (viewMode === 'deals' && draggableId.startsWith('deal_')) {
            const dealId = parseInt(draggableId.replace('deal_', ''));
            const stageMapping: Record<string, string> = {
                'New': 'Generated',
                'Contacted': 'In Progress',
                'Appointment Scheduled': 'Negotiation',
                'Consultation Done': 'Closed Won'
            };
            const newStage = stageMapping[destination.droppableId];
            router.patch(route('deals.stage', dealId), { stage: newStage }, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">
                            {viewMode === 'leads' ? 'Patient Journeys' : 'Clinical Sales Pipeline'}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {viewMode === 'leads'
                                ? 'Visualizing the flow from inquiry to consultation.'
                                : 'Tracking revenue, surgical categories, and closing opportunities.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 p-1.5 rounded-[2rem] border border-slate-200/60 shadow-sm">
                        <div className="flex bg-slate-100 p-1 rounded-[1.5rem]">
                            <button
                                onClick={() => setViewMode('leads')}
                                className={cn(
                                    "px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                    viewMode === 'leads'
                                        ? "bg-white text-slate-900 shadow-md"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Inquiries
                            </button>
                            <button
                                onClick={() => setViewMode('deals')}
                                className={cn(
                                    "px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                    viewMode === 'deals'
                                        ? "bg-white text-slate-900 shadow-md"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Deals
                            </button>
                        </div>

                        <div className="h-4 w-[1px] bg-slate-200 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
                                <Link
                                    href={route('leads.index', { view: 'list' })}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    <LayoutList className="w-5 h-5" />
                                </Link>
                                <div className="p-2 rounded-xl bg-slate-900 text-white shadow-lg">
                                    <Columns className="w-5 h-5" />
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCreateDealOpen(true)}
                                className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#4358E4] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 group"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> NEW {viewMode === 'leads' ? 'LEAD' : 'DEAL'}
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Pipeline" />

            <div className="h-[calc(100vh-240px)] overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full min-w-max pb-4">
                        {columns.map((column, colIndex) => (
                            <div key={column.id} className="w-[22rem] flex flex-col gap-6 relative px-4">
                                {/* Flow Connectors (Simulated) */}
                                {colIndex < columns.length - 1 && (
                                    <div className="absolute top-1/2 -right-4 w-8 h-[2px] bg-slate-100 border-t border-dashed border-slate-300 z-0 opacity-50"></div>
                                )}

                                {/* Column Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-xl text-white shadow-sm", column.color)}>
                                            <column.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">{column.title}</h3>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                {column.items.length} Records
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsCreateDealOpen(true)}
                                        className="text-slate-300 hover:text-indigo-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "flex-1 bg-slate-50/30 border border-slate-200/50 rounded-[2.5rem] p-4 flex flex-col gap-4 overflow-y-auto scrollbar-hide transition-all duration-300",
                                                snapshot.isDraggingOver && "bg-indigo-50/50 border-indigo-100 scale-[0.99]"
                                            )}
                                        >
                                            {column.items.map((item: any, index: number) => (
                                                <Draggable key={`${item.type}_${item.id}`} draggableId={`${item.type}_${item.id}`} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-200 group relative overflow-hidden cursor-pointer flex-shrink-0",
                                                                snapshot.isDragging && "shadow-2xl border-indigo-200 rotate-1 scale-105 z-50 bg-white"
                                                            )}
                                                            onClick={(e) => {
                                                                if (!snapshot.isDragging) {
                                                                    if (item.type === 'lead') {
                                                                        setSelectedLead(item);
                                                                    } else if (item.type === 'deal') {
                                                                        router.visit(route('deals.show', item.id));
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className={cn(
                                                                        "w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all duration-500 text-xs",
                                                                        item.type === 'deal'
                                                                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                                                                            : "bg-slate-50 text-slate-400 border border-slate-100"
                                                                    )}>
                                                                        {item.name.charAt(0)}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[140px]">
                                                                                {item.name}
                                                                            </span>
                                                                            {item.type === 'deal' && (
                                                                                <span className="px-1 py-0.5 bg-amber-100 text-amber-700 text-[7px] font-black rounded uppercase tracking-tighter shadow-sm">DEAL</span>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                                            {item.type === 'deal' ? (item.category || 'Deal') : item.phone}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <MoreHorizontal className="w-4 h-4 text-slate-300" />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50 group-hover:bg-white transition-colors">
                                                                    <div className="flex items-center gap-2">
                                                                        {item.type === 'deal' ? <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> : <Target className="w-3.5 h-3.5 text-slate-300" />}
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                                                                            {item.type === 'deal' ? `$${item.value}` : (item.campaign?.name || 'Inbound')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white rounded-lg border border-slate-100 shadow-xs">
                                                                        <Zap className={cn(
                                                                            "w-2.5 h-2.5",
                                                                            (item.score || 0) >= 70 ? "text-amber-500 fill-amber-500" : "text-slate-300"
                                                                        )} />
                                                                        <span className="text-[9px] font-bold text-slate-900">{item.score || 0}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between pt-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
                                                                            {(item.type === 'deal' ? item.agent?.name : item.counselor?.name)?.charAt(0) || '?'}
                                                                        </div>
                                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                                                                            {item.type === 'deal' ? 'Agent' : 'Assigned'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[9px] font-black text-slate-300 uppercase italic">
                                                                        {item.type === 'deal' ? 'View Deal' : 'Quick View'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Side Accent */}
                                                            {item.type === 'deal' && (
                                                                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-50 rounded-bl-[2rem] -mr-6 -mt-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {column.items.length === 0 && (
                                                <div className="py-20 text-center flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
                                                    <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-400 flex items-center justify-center mb-3">
                                                        <Clock className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Records</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Quick View Drawer */}
            <Drawer
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Lead Perspective"
                description={`Reference ID: #L-00${selectedLead?.id}`}
                maxWidth="max-w-2xl"
                footer={
                    <div className="flex items-center justify-between w-full">
                        <button
                            onClick={() => selectedLead && router.get(route('leads.show', selectedLead.id))}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
                        >
                            Full Workspace <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex gap-2">
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all">
                                <Phone className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                }
            >
                {selectedLead && (
                    <div className="space-y-10">
                        {/* Profile Header */}
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-3xl text-slate-400 shadow-inner">
                                {selectedLead.name.charAt(0)}
                            </div>
                            <div className="flex-1 pt-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{selectedLead.name}</h3>
                                    <span className={cn(
                                        "px-2.5 py-1 text-[9px] rounded-lg font-black uppercase tracking-widest border",
                                        getStatusStyles(selectedLead.status)
                                    )}>
                                        {selectedLead.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 group cursor-pointer">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{selectedLead.phone}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500">Registered {new Date(selectedLead.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Quality Index</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-900">{selectedLead.score}</span>
                                    <Zap className={cn("w-4 h-4 mb-2", selectedLead.score >= 70 ? "text-amber-500 fill-amber-500" : "text-slate-300")} />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Clinical BMI</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-900">{selectedLead.bmi || '--'}</span>
                                    <Scale className="w-4 h-4 mb-2 text-slate-300" />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Response Prio</span>
                                <div className="flex items-end gap-2">
                                    <span className={cn(
                                        "text-sm font-black uppercase tracking-wider mb-0.5",
                                        selectedLead.urgency === 'High' ? "text-rose-500" : "text-amber-500"
                                    )}>{selectedLead.urgency}</span>
                                    <AlertCircle className={cn("w-4 h-4 mb-2", selectedLead.urgency === 'High' ? "text-rose-500" : "text-amber-500")} />
                                </div>
                            </div>
                        </div>

                        {/* Attribution Sect */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-slate-900" />
                                <h4 className="text-[11px] font-black black text-slate-900 uppercase tracking-widest">Attribution & Source</h4>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                                <div className="px-6 py-4 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Primary Source</span>
                                        <span className="text-xs font-bold text-slate-900">{selectedLead.source}</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="px-6 py-4 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Campaign</span>
                                        <span className="text-xs font-bold text-indigo-600">{selectedLead.campaign?.name || 'Manual Admisson'}</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Assigned Counselor</span>
                                        <span className="text-xs font-bold text-slate-900">{selectedLead.counselor?.name || 'Unassigned / Round Robin'}</span>
                                    </div>
                                    <UserCircle className="w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        {/* Case Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-slate-900" />
                                <h4 className="text-[11px] font-black black text-slate-900 uppercase tracking-widest">Clinical Background</h4>
                            </div>
                            <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100/50">
                                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                    {selectedLead.health_info ? `"${selectedLead.health_info}"` : "No specific health background or consultation notes were provided for this record yet."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            <CreateLeadDrawer
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                campaigns={campaigns}
                counselors={counselors}
            />

            <CreateDealDrawer
                isOpen={isCreateDealOpen}
                onClose={() => setIsCreateDealOpen(false)}
                leads={leads}
                agents={counselors as any}
            />
        </AuthenticatedLayout>
    );
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'New': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Appointment Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        case 'Consultation Done': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
}
