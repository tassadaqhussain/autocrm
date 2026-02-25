import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useCallback } from 'react';

interface Client {
    id: number;
    name: string;
    email: string | null;
    mobile: string | null;
    status: string;
}

interface Props {
    client: Client;
}

export default function Edit({ client }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: client.name,
        email: client.email ?? '',
        mobile: client.mobile ?? '',
        status: client.status,
    });

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            put(route('clients.update', client.id));
        },
        [put, client.id]
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('clients.index')} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                        Clients
                    </Link>
                    <span className="text-slate-300">/</span>
                    <h2 className="text-xl font-bold text-slate-900">Edit {client.name}</h2>
                </div>
            }
        >
            <Head title={`Edit ${client.name}`} />
            <div className="max-w-2xl">
                <form onSubmit={submit} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile</label>
                        <input
                            type="text"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Status *</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50"
                        >
                            Update
                        </button>
                        <Link
                            href={route('clients.index')}
                            className="px-6 py-3 border border-slate-200 font-bold rounded-xl text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
