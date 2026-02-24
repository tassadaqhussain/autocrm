import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Zap,
    Plus,
    Activity,
    MessageSquare,
    Facebook,
    Wand2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function AutomationIndex() {
    const rules = [
        {
            id: 1,
            name: 'Auto-Assign WhatsApp Leads',
            trigger: 'Lead Source is WhatsApp',
            action: 'Assign to Available Counselor',
            status: 'Active',
            platform: 'WhatsApp'
        },
        {
            id: 2,
            name: 'High Value Lead Alert',
            trigger: 'Budget > 10,000 SAR',
            action: 'Notify Admin & Senior Counselor',
            status: 'Active',
            platform: 'CRM'
        },
        {
            id: 3,
            name: 'Meta Ads Retargeting Tag',
            trigger: 'Lead Stage is Consultation Done',
            action: 'Add to Retargeting Audience',
            status: 'Paused',
            platform: 'Meta'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Marketing <span className="text-emerald-500">Automation</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Smart rules & workflow automation</p>
                    </div>

                    <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-emerald-200">
                        <Plus className="w-4 h-4" /> Create Rule
                    </button>
                </div>
            }
        >
            <Head title="Marketing Automation" />

            <div className="mt-8 space-y-8 max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all h-[200px]">
                        <div>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-4">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Rules</h3>
                        </div>
                        <p className="text-4xl font-black text-slate-900">12</p>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all h-[200px]">
                        <div>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mb-4">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Executions Today</h3>
                        </div>
                        <p className="text-4xl font-black text-slate-900">1,492</p>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all h-[200px]">
                        <div>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors mb-4">
                                <Wand2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Time Saved</h3>
                        </div>
                        <p className="text-4xl font-black text-slate-900">28h</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Automation Rules</h3>
                    </div>

                    <div className="space-y-4">
                        {rules.map((rule) => (
                            <div key={rule.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/50">

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn(
                                            "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                                            rule.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                                        )}>
                                            {rule.status}
                                        </div>
                                        <h4 className="text-base font-black text-slate-900 uppercase">{rule.name}</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span className="text-indigo-500">IF:</span> {rule.trigger}
                                        <ArrowRight className="w-4 h-4 mx-2 text-slate-300" />
                                        <span className="text-orange-500">THEN:</span> {rule.action}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[10px] font-black uppercase text-slate-600">
                                        {rule.platform === 'WhatsApp' ? <MessageSquare className="w-3.5 h-3.5" /> :
                                            rule.platform === 'Meta' ? <Facebook className="w-3.5 h-3.5" /> :
                                                <Activity className="w-3.5 h-3.5" />}
                                        {rule.platform}
                                    </div>
                                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors ml-auto">
                                        Edit
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">More integrations available in Settings</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
