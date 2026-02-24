import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Save,
    Settings,
    Facebook,
    Globe,
    MessageSquare,
    Link2,
    ToggleLeft,
    ToggleRight,
    Users,
    KeyRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function SettingsIndex() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Marketing <span className="text-slate-500">Settings</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Integrations & Preferences</p>
                    </div>

                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-slate-200">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            }
        >
            <Head title="Marketing Settings" />

            <div className="mt-8 space-y-8 max-w-[1000px] mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Nav (mocked) */}
                    <div className="md:col-span-1 space-y-2">
                        {[
                            { name: 'Integrations', icon: Link2, active: true },
                            { name: 'Tracking (UTM)', icon: Globe, active: false },
                            { name: 'Notifications', icon: MessageSquare, active: false },
                            { name: 'Permissions', icon: Users, active: false },
                            { name: 'API Keys', icon: KeyRound, active: false }
                        ].map(item => (
                            <button
                                key={item.name}
                                className={cn(
                                    "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-left",
                                    item.active ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <item.icon className="w-4 h-4" /> {item.name}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Integrations Panel */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10">
                            <div className="mb-10">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Connected Accounts</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage 3rd party connections</p>
                            </div>

                            <div className="space-y-6">
                                {/* Facebook/Meta */}
                                <div className="flex items-start sm:items-center justify-between gap-6 p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:border-slate-300 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Facebook className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase">Meta Business Suite</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Connected as "Elite Medical"</p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-colors shrink-0">
                                        Disconnect
                                    </button>
                                </div>

                                {/* Google Ads */}
                                <div className="flex items-start sm:items-center justify-between gap-6 p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:border-slate-300 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-xl">
                                            G
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase">Google Ads</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Not connected</p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-colors shrink-0">
                                        Connect
                                    </button>
                                </div>

                                {/* WhatsApp API */}
                                <div className="flex items-start sm:items-center justify-between gap-6 p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:border-slate-300 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase">WhatsApp Official API</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Connected (+966 50 XXX XXXX)</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pixel Settings */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10">
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Conversion Tracking</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Server-side events & pixels</p>
                                </div>
                                <ToggleRight className="w-10 h-10 text-emerald-500" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Meta Pixel ID</label>
                                    <input
                                        type="text"
                                        defaultValue="123456789012345"
                                        className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all text-slate-600"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conversions API Token</label>
                                        <input
                                            type="password"
                                            defaultValue="************************"
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all text-slate-600"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-2 pt-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Events are currently tracking successfully
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
