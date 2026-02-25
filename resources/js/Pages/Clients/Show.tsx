import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { User } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string | null;
    mobile: string | null;
    status: string;
    created_at: string;
}

interface Props {
    client: Client;
}

export default function Show({ client }: Props) {
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('clients.index')} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                        Clients
                    </Link>
                    <span className="text-slate-300">/</span>
                    <h2 className="text-xl font-bold text-slate-900">{client.name}</h2>
                </div>
            }
        >
            <Head title={client.name} />
            <div className="max-w-2xl">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-bold ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {client.status}
                            </span>
                        </div>
                    </div>
                    <dl className="grid grid-cols-1 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Email</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-900">{client.email ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Mobile</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-900">{client.mobile ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Created</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(client.created_at)}</dd>
                        </div>
                    </dl>
                    <div className="pt-4">
                        <Link
                            href={route('clients.edit', client.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800"
                        >
                            Edit Client
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
