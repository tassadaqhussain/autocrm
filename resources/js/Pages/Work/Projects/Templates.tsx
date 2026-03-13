import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Layers, Plus, ArrowLeft, Search } from 'lucide-react';
import DataTable from '@/Components/DataTable';
import TextInput from '@/Components/TextInput';

export default function Templates() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('work.projects.index')}
                            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:shadow-xl hover:border-slate-300 transition-all active:scale-90"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex flex-col gap-1.5">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                                Project Template
                                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                            </h2>
                            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <span className="hover:text-indigo-600 cursor-pointer transition-colors">Home</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                <span className="hover:text-indigo-600 cursor-pointer transition-colors">Projects</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                <span className="text-slate-900 italic underline decoration-indigo-500/30 underline-offset-4">Project Template</span>
                            </nav>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2 px-4 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Setup Progress</span>
                            <span className="text-sm font-black text-slate-900 italic tracking-tighter">5/6</span>
                        </div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 w-[83%] shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Work | Project Frameworks" />

            <div className="max-w-[1600px] mx-auto py-10 space-y-10">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="relative w-[320px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <TextInput
                            className="w-full pl-11 h-12 border-slate-200 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all focus:ring-4 focus:ring-indigo-50"
                            placeholder="Start typing to search..."
                        />
                    </div>

                    <button
                        className="h-12 px-8 bg-[#1d82f5] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1669c1] hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-3 active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Project Template
                    </button>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_100px] gap-4 px-8 py-6 bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center justify-center">
                            <div className="w-4 h-4 rounded border-2 border-slate-200 cursor-pointer hover:border-indigo-400 transition-colors" />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group cursor-pointer">
                            Project Name <span className="text-slate-300 group-hover:text-indigo-600">⇵</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group cursor-pointer">
                            Members <span className="text-slate-300 group-hover:text-indigo-600">⇵</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group cursor-pointer">
                            Project Category <span className="text-slate-300 group-hover:text-indigo-600">⇵</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[radial-gradient(circle_at_center,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_100%)]">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl border border-slate-50 flex items-center justify-center text-slate-200 mb-6 group hover:scale-110 transition-transform duration-500">
                            <Layers className="w-8 h-8 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] bg-slate-50 px-6 py-2 rounded-full">No data available in table</p>
                    </div>

                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</span>
                            <select className="h-10 px-3 border-slate-200 bg-white rounded-xl text-xs font-bold focus:ring-0">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">entries</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 0 to 0 of 0 entries</span>
                            <div className="flex gap-2">
                                <button className="h-10 px-6 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 cursor-not-allowed">Previous</button>
                                <button className="h-10 px-6 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 cursor-not-allowed">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
