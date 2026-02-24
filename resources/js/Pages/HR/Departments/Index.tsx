import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Plus, Users, Shield, Briefcase, Network } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    departments: any[];
}

export default function Index({ departments }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: ''
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.departments.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Clinic Structure</h2>
                    </div>
                </div>
            }
        >
            <Head title="Clinic Structure" />

            <div className="max-w-[1600px] mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add Department Card */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all text-slate-500 hover:text-indigo-600 group h-full min-h-[250px]"
                    >
                        <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 group-hover:text-indigo-600 transition-colors">Add Department</h3>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-2 text-center group-hover:text-indigo-400">Expand Operations</p>
                    </button>

                    {/* Department Cards */}
                    {departments.map((dept) => (
                        <div key={dept.id} className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-start gap-4 hover:border-slate-300 transition-colors">
                            <div className="w-full flex justify-between items-start">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="flex -space-x-2">
                                    {/* Dummy avatars for employees count */}
                                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-600">0</div>
                                </div>
                            </div>

                            <div className="space-y-1 w-full text-left mt-2">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{dept.name}</h3>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <Briefcase className="w-3 h-3" />
                                    <span>{dept.designations?.length || 0} Designations</span>
                                </div>
                            </div>

                            <div className="w-full mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                                <button className="p-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                                    Edit
                                </button>
                                <button className="p-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); reset(); }} maxWidth="md">
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Create New Department</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Department Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full h-11 px-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Sales, Marketing, Orthopedics"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</div>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { setIsCreateModalOpen(false); reset(); clearErrors(); }}
                            className="h-10 px-5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 px-6 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Department'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
