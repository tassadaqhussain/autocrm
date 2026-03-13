import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Plus, Folder, Calendar, User, BarChart3, Filter, Eye, Pencil, Trash2, Layers, FileUp, FileDown } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateProjectDrawer from '@/Components/Work/Projects/CreateProjectDrawer';
import ProjectFilterDrawer from '@/Components/Work/Projects/ProjectFilterDrawer';
import type { ProjectDrawerProject } from '@/Components/Work/Projects/ProjectDrawerTypes';

interface Props {
    projects: ProjectDrawerProject[];
    clients: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    users: { id: number; name: string }[];
    filters: { search?: string; status?: string; category_id?: string; client_id?: string };
}

const STATUS_CONFIG: Record<string, string> = {
    'Not Started': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-blue-100 text-blue-600 shadow-blue-100/50',
    'On Hold': 'bg-amber-100 text-amber-600 shadow-amber-100/50',
    'Canceled': 'bg-rose-100 text-rose-600 shadow-rose-100/50',
    'Finished': 'bg-emerald-100 text-emerald-600 shadow-emerald-100/50',
};

export default function Index({ projects, clients, categories, departments, users, filters }: Props) {
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [viewProject, setViewProject] = useState<ProjectDrawerProject | null>(null);
    const [editProject, setEditProject] = useState<ProjectDrawerProject | null>(null);

    const deleteProject = (id: number) => {
        if (confirm('Are you sure you want to terminate this project? This action cannot be undone.')) {
            router.delete(route('work.projects.destroy', id));
        }
    };

    const columns: DataTableColumn<ProjectDrawerProject>[] = useMemo(() => [
        {
            id: 'code',
            header: 'Code',
            cell: (p) => <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{p.short_code || `--`}</span>
        },
        {
            id: 'project',
            header: 'Project Name',
            cell: (p) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <Folder className="w-5 h-5 transition-transform" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-[13px] uppercase tracking-tight italic leading-none">{p.project_name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                            {p.category?.name || 'Uncategorized'}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'members',
            header: 'Members',
            cell: (p) => (
                <div className="flex -space-x-2 overflow-hidden">
                    {p.members?.length ? p.members.map((m, i) => (
                        <div key={m.id} className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center" title={m.name}>
                            <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                    )) : <span className="text-[10px] text-slate-400 italic">None</span>}
                </div>
            )
        },
        {
            id: 'timeline',
            header: 'Start Date',
            cell: (p) => <span className="text-[11px] font-bold text-slate-600">{p.start_date || '--'}</span>
        },
        {
            id: 'deadline',
            header: 'Deadline',
            cell: (p) => <span className="text-[11px] font-bold text-rose-600">{p.no_deadline ? 'No Deadline' : (p.deadline || '--')}</span>
        },
        {
            id: 'client',
            header: 'Client',
            cell: (p) => (
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                    {p.client?.name || 'Internal'}
                </span>
            )
        },
        {
            id: 'status',
            header: 'Status',
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
                        className="h-12 px-8 bg-[#1d82f5] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1669c1] transition-all flex items-center gap-3 shadow-2xl shadow-blue-100 active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Project
                    </button>
                </div>
            }
        >
            <Head title="Work | Portfolio Management" />

            <div className="max-w-[1600px] mx-auto py-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('work.projects.templates')}
                            className="h-10 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                        >
                            <Layers className="w-4 h-4 text-indigo-500" /> Project Template
                        </Link>
                        <button
                            className="h-10 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                        >
                            <FileUp className="w-4 h-4 text-emerald-500" /> Import
                        </button>
                        <button
                            className="h-10 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                        >
                            <FileDown className="w-4 h-4 text-rose-500" /> Export
                        </button>
                    </div>
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="h-10 px-6 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm group"
                    >
                        <Filter className="w-3.5 h-3.5 group-hover:text-indigo-600 transition-colors" /> Intelligence Filters
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
                categories={categories}
                departments={departments}
                users={users}
            />

            <ProjectFilterDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                filters={filters}
                clients={clients}
                categories={categories}
            />
        </AuthenticatedLayout>
    );
}
