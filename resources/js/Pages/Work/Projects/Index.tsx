import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Folder, Calendar, User, BarChart3, Filter, Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateProjectDrawer from '@/Components/Work/Projects/CreateProjectDrawer';
import type { ProjectDrawerProject } from '@/Components/Work/Projects/ProjectDrawerTypes';

interface Props {
    projects: ProjectDrawerProject[];
    clients: { id: number; name: string }[];
    filters: { search?: string; status?: string };
}

const STATUS_CONFIG: Record<string, string> = {
    'Not Started': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-blue-100 text-blue-600 shadow-blue-100/50',
    'On Hold': 'bg-amber-100 text-amber-600 shadow-amber-100/50',
    'Canceled': 'bg-rose-100 text-rose-600 shadow-rose-100/50',
    'Finished': 'bg-emerald-100 text-emerald-600 shadow-emerald-100/50',
};

export default function Index({ projects, clients, filters }: Props) {
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [viewProject, setViewProject] = useState<ProjectDrawerProject | null>(null);
    const [editProject, setEditProject] = useState<ProjectDrawerProject | null>(null);

    const deleteProject = (id: number) => {
        if (confirm('Are you sure you want to terminate this project? This action cannot be undone.')) {
            router.delete(route('projects.destroy', id));
        }
    };

    const columns: DataTableColumn<ProjectDrawerProject>[] = useMemo(() => [
        {
            id: 'project',
            header: 'Project Framework',
            cell: (p) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <Folder className="w-5 h-5 transition-transform" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-[13px] uppercase tracking-tight italic leading-none">{p.project_name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                            {p.client?.name ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    {p.client.name}
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    Internal Operations
                                </>
                            )}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'timeline',
            header: 'Lifecycle',
            cell: (p) => (
                <div className="space-y-1.5 p-1 bg-slate-50/50 rounded-xl border border-slate-100 w-fit">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                        <Calendar className="w-3 h-3 opacity-40" />
                        <span>Launch: {p.start_date || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 text-[10px] font-black uppercase tracking-widest bg-white rounded-lg shadow-sm px-2.5 py-1 border border-slate-100">
                        <Calendar className="w-3 h-3 text-rose-500" />
                        <span>Deadline: {p.deadline || 'N/A'}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'valuation',
            header: 'Valuation',
            cell: (p) => (
                <div className="flex flex-col">
                    <span className="text-[14px] font-black text-slate-900 tabular-nums leading-none tracking-tighter">SAR {Number(p.budget).toLocaleString()}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">Budgetary Cap</span>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Execution Status',
            cell: (p) => (
                <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm border border-transparent", STATUS_CONFIG[p.status] || 'bg-slate-100')}>
                    {p.status}
                </span>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4 animate-in slide-in-from-left duration-700">
                            Work Portfolio
                            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse ring-4 ring-indigo-50" />
                        </h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-1">Managing {projects.length} Active Operational Objectives</p>
                    </div>
                    <button
                        onClick={() => setIsCreateDrawerOpen(true)}
                        className="h-12 px-8 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Initialize Project
                    </button>
                </div>
            }
        >
            <Head title="Work | Portfolio Management" />

            <div className="max-w-[1600px] mx-auto py-10 space-y-6">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="h-10 px-6 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
                    >
                        <Filter className="w-3.5 h-3.5" /> Intelligence Filters
                    </button>
                </div>

                <DataTable<ProjectDrawerProject>
                    columns={columns}
                    data={projects}
                    getRowId={(p) => p.id}
                    emptyMessage="Project repository is currently empty."
                    renderActions={(project) => (
                        <div className="flex items-center justify-end gap-1 px-4">
                            <button
                                onClick={() => setViewProject(project)}
                                className="p-2.5 rounded-xl text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all active:scale-90"
                                title="Visualize"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setEditProject(project)}
                                className="p-2.5 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-lg transition-all active:scale-90"
                                title="Optimize"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteProject(project.id)}
                                className="p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                                title="Terminate"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                />
            </div>

            <CreateProjectDrawer
                isOpen={isCreateDrawerOpen}
                onClose={() => setIsCreateDrawerOpen(false)}
                clients={clients}
            />
        </AuthenticatedLayout>
    );
}
