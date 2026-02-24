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
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useMemo } from 'react';

interface Lead {
    id: number;
    name: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    campaign?: { name: string };
    counselor?: { name: string };
}

interface Props {
    leads: Lead[];
}

const statusColumns = [
    { id: 'New', title: 'New Leads', color: 'bg-blue-500', icon: Target },
    { id: 'Contacted', title: 'Contacted', color: 'bg-amber-500', icon: Phone },
    { id: 'Appointment Scheduled', title: 'Appointment', color: 'bg-purple-500', icon: Calendar },
    { id: 'Consultation Done', title: 'Consulted', color: 'bg-emerald-500', icon: CheckCircle2 },
];

export default function Pipeline({ leads: initialLeads }: Props) {
    const [leads, setLeads] = useState(initialLeads);

    const columns = useMemo(() => {
        return statusColumns.map(col => ({
            ...col,
            leads: leads.filter(l => l.status === col.id)
        }));
    }, [leads]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const leadId = parseInt(draggableId);
        const newStatus = destination.droppableId;

        // Optimistic update
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

        // API call
        router.patch(route('leads.status', leadId), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => { },
            onError: () => {
                // Revert on error
                setLeads(initialLeads);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Patient Journeys</h2>
                        <p className="text-slate-500 text-sm font-medium">Visualizing the flow from inquiry to consultation.</p>
                    </div>
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
                        <Link
                            href={route('leads.create')}
                            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                        </Link>
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
                                                {column.leads.length} Records
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-slate-300 hover:text-slate-600">
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
                                            {column.leads.map((lead, index) => (
                                                <Draggable key={lead.id} draggableId={lead.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-200 hover:-translate-y-1 group relative overflow-hidden",
                                                                snapshot.isDragging && "shadow-2xl border-indigo-200 rotate-1 scale-105 z-50 bg-white"
                                                            )}
                                                            onClick={() => router.get(route('leads.show', lead.id))}
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-[1rem] bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                                                        {lead.name.charAt(0)}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                                            {lead.name}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                                            {lead.phone}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    <button className="p-1.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100">
                                                                        <MoreHorizontal className="w-4 h-4 text-slate-300" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white transition-colors">
                                                                    <div className="flex items-center gap-2">
                                                                        <Target className="w-3.5 h-3.5 text-slate-300" />
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[120px]">
                                                                            {lead.campaign?.name || 'Inbound'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="p-1 bg-white rounded-lg border border-slate-100 shadow-xs">
                                                                        <MoreHorizontal className="w-3 h-3 text-slate-300" />
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between pt-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex -space-x-2">
                                                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                                                {lead.counselor?.name?.charAt(0) || '?'}
                                                                            </div>
                                                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                                                                +
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                                            Assigned
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                                                                        <Zap className={cn(
                                                                            "w-3 h-3",
                                                                            lead.score >= 70 ? "text-amber-500 fill-amber-500" : "text-slate-300"
                                                                        )} />
                                                                        <span className="text-[10px] font-black text-slate-900">
                                                                            {lead.score}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Background Accent */}
                                                            <div className="absolute top-0 right-0 p-2 overflow-hidden pointer-events-none">
                                                                <div className={cn("w-1 h-1 rounded-full", column.color)}></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {column.leads.length === 0 && (
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
        </AuthenticatedLayout>
    );
}
