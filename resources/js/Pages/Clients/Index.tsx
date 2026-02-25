import { useEffect, useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, User, Filter, Pencil, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import DataTable from '@/Components/DataTable';
import type { DataTableColumn } from '@/Components/DataTable';
import CreateClientDrawer from '@/Components/Clients/CreateClientDrawer';
import ShowClientDrawer from '@/Components/Clients/ShowClientDrawer';
import EditClientDrawer from '@/Components/Clients/EditClientDrawer';
import ClientFilterDrawer from '@/Components/Clients/ClientFilterDrawer';
import type { ClientDrawerClient } from '@/Components/Clients/ClientDrawerTypes';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ClientsPaginated {
    data: ClientDrawerClient[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    clients: ClientsPaginated;
    filters: { search?: string; status?: string; per_page?: number };
}

export default function Index({ clients, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'All');
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [viewDrawerClient, setViewDrawerClient] = useState<ClientDrawerClient | null>(null);
    const [editDrawerClient, setEditDrawerClient] = useState<ClientDrawerClient | null>(null);

    const applyFiltersFromDrawer = (drawerSearch: string, drawerStatus: string) => {
        setSearch(drawerSearch);
        setStatus(drawerStatus);
        router.get(
            route('clients.index'),
            { search: drawerSearch || undefined, status: drawerStatus !== 'All' ? drawerStatus : undefined, per_page: clients.per_page },
            { preserveState: true }
        );
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === 'true') {
            setIsCreateDrawerOpen(true);
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.search.replace(/[?&]create=true/, '')
            );
        }
    }, []);

    const deleteClient = (id: number) => {
        if (confirm('Are you sure you want to delete this client?')) {
            router.delete(route('clients.destroy', id));
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    };

    const columns: DataTableColumn<ClientDrawerClient>[] = useMemo(
        () => [
            {
                id: 'id',
                header: 'Id',
                cell: (row) => <span className="font-medium text-slate-500 tabular-nums">{row.id}</span>,
                cellClassName: 'tabular-nums',
            },
            {
                id: 'name',
                header: 'Name',
                cell: (row) => (
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-900 truncate max-w-[180px]">{row.name}</span>
                    </div>
                ),
            },
            {
                id: 'email',
                header: 'Email',
                cell: (row) => (
                    <span className="text-slate-600 truncate max-w-[200px] block" title={row.email ?? undefined}>
                        {row.email ?? '—'}
                    </span>
                ),
            },
            {
                id: 'mobile',
                header: 'Mobile',
                cell: (row) => <span className="text-slate-600">{row.mobile ?? '—'}</span>,
            },
            {
                id: 'status',
                header: 'Status',
                cell: (row) => (
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium',
                            row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        )}
                    >
                        <span className={cn('w-1 h-1 rounded-full', row.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400')} />
                        {row.status}
                    </span>
                ),
            },
            {
                id: 'created_at',
                header: 'Created',
                cell: (row) => <span className="text-slate-500 tabular-nums">{formatDate(row.created_at)}</span>,
                cellClassName: 'tabular-nums',
            },
        ],
        []
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Clients</h2>
                        <p className="text-slate-500 text-xs mt-0.5">Manage your CRM clients</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCreateDrawerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Client
                    </button>
                </div>
            }
        >
            <Head title="Clients" />

            <div className="space-y-4 pb-8">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-colors text-xs font-medium"
                        title="Search & filter"
                    >
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                </div>

                <DataTable<ClientDrawerClient>
                    columns={columns}
                    data={clients.data}
                    getRowId={(row) => row.id}
                    emptyMessage="No clients found. Add your first client to get started."
                    pagination={{
                        from: clients.from,
                        to: clients.to,
                        total: clients.total,
                        links: clients.links,
                    }}
                    renderActions={(client) => (
                        <div className="flex items-center justify-end gap-0.5">
                            <button
                                type="button"
                                onClick={() => setViewDrawerClient(client)}
                                className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                title="View"
                            >
                                <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditDrawerClient(client)}
                                className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                title="Edit"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteClient(client.id)}
                                className="p-1.5 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                />
            </div>

            <CreateClientDrawer
                isOpen={isCreateDrawerOpen}
                onClose={() => setIsCreateDrawerOpen(false)}
            />
            <ClientFilterDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                currentSearch={search}
                currentStatus={status}
                perPage={clients.per_page}
                onApply={applyFiltersFromDrawer}
            />
            <ShowClientDrawer
                isOpen={!!viewDrawerClient}
                onClose={() => setViewDrawerClient(null)}
                client={viewDrawerClient}
                onEdit={(c) => {
                    setViewDrawerClient(null);
                    setEditDrawerClient(c);
                }}
            />
            <EditClientDrawer
                isOpen={!!editDrawerClient}
                onClose={() => setEditDrawerClient(null)}
                client={editDrawerClient}
            />
        </AuthenticatedLayout>
    );
}
