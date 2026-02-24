import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Save, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
    clinic: any;
}

export default function Profile({ clinic }: Props) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({
        name: clinic?.name || '',
        email: clinic?.email || '',
        phone: clinic?.phone || '',
        address: clinic?.address || '',
        website: clinic?.website || ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('hr.clinic.update'), {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Clinic Profile</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest hidden sm:inline-block">Global Identity Details</span>
                    </div>
                </div>
            }
        >
            <Head title="Clinic Profile" />

            <div className="max-w-[1000px] mx-auto py-8 lg:py-12">
                <form onSubmit={submit} className="bg-white border flex flex-col items-center sm:items-stretch lg:flex-row border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">

                    {/* Visual / Avatar Side */}
                    <div className="w-full lg:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
                        <div className="w-32 h-32 rounded-full bg-white border-4 border-indigo-100 shadow-inner flex items-center justify-center mb-6 relative group overflow-hidden">
                            {clinic.logo ? (
                                <img src={`/storage/${clinic.logo}`} alt="Clinic Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 className="w-12 h-12 text-indigo-300" />
                            )}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-[10px] uppercase font-black tracking-widest text-white">Upload</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-slate-900text-center">{data.name || 'Your Clinic Name'}</h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1 text-center">Primary Branch</p>
                    </div>

                    {/* Data Form Side */}
                    <div className="w-full lg:w-2/3 p-8 lg:p-12">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Essential Information</h4>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Registered Clinic Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full h-12 pl-11 pr-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                {errors.name && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contact Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            disabled
                                            className="w-full h-12 pl-11 pr-4 bg-slate-100 border-slate-200 rounded-xl text-sm font-semibold opacity-75 cursor-not-allowed"
                                            placeholder="hello@clinic.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Support Phone</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            disabled
                                            className="w-full h-12 pl-11 pr-4 bg-slate-100 border-slate-200 rounded-xl text-sm font-semibold opacity-75 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Physical Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <textarea
                                            value={data.address}
                                            disabled
                                            className="w-full p-4 pl-11 bg-slate-100 border-slate-200 rounded-xl text-sm font-semibold min-h-[100px] resize-none opacity-75 cursor-not-allowed"
                                            placeholder="123 Medical Drive, Suite 400..."
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Website</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Globe className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={data.website}
                                            disabled
                                            className="w-full h-12 pl-11 pr-4 bg-slate-100 border-slate-200 rounded-xl text-sm font-semibold opacity-75 cursor-not-allowed"
                                            placeholder="https://yourclinic.com"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || !isDirty}
                                className="h-12 px-8 bg-indigo-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group shadow-lg shadow-indigo-200"
                            >
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {processing ? 'Saving...' : 'Save Profile Details'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
