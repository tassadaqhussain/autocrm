import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Building2, Plus, Users, Shield, Award, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    designations: any[];
    departments: any[];
}

export default function Index({ designations, departments }: Props) {
    const { props } = usePage();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Group designations by department for clean UI
    const groupedDesignations = departments.map(dept => ({
        ...dept,
        designations: designations.filter(d => d.department_id === dept.id)
    }));

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        title: '',
        department_id: departments[0]?.id || ''
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.designations.store'), {
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
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Designations & Hierarchy</h2>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Role
                    </button>
                </div>
            }
        >
            <Head title="Designations" />

            <div className="max-w-[1600px] mx-auto py-8">
                {departments.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Departments Found</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-2">You need to create departments in the Clinic Structure before adding designations.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {groupedDesignations.map((dept) => (
                            <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                                                {dept.name}
                                            </h3>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{dept.designations.length} Active Designations</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setData('department_id', dept.id);
                                            setIsCreateModalOpen(true);
                                        }}
                                        className="h-8 px-4 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Here
                                    </button>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/30">
                                    {dept.designations.length === 0 ? (
                                        <div className="col-span-full py-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest border border-dashed border-slate-200 rounded-xl">
                                            No designations assigned to this department yet.
                                        </div>
                                    ) : (
                                        dept.designations.map((designation: any) => (
                                            <div key={designation.id} className="relative group bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                    <Award className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[12px] font-black tracking-tight text-slate-900">{designation.title}</h4>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <Users className="w-3 h-3" />
                                                        <span>Personnel</span>
                                                    </div>
                                                </div>
                                                {/* Actions */}
                                                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => { }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); reset(); }} maxWidth="md">
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Create New Designation</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Job Title / Designation</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full h-11 px-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Senior Dental Surgeon"
                            />
                            {errors.title && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.title}</div>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Assign to Department</label>
                            <select
                                value={data.department_id}
                                onChange={e => setData('department_id', e.target.value)}
                                className="w-full h-11 px-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                            >
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            {errors.department_id && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.department_id}</div>}
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
                            {processing ? 'Creating...' : 'Create Designation'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
