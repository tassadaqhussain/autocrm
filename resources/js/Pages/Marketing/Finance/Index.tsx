import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Plus,
    Search,
    DollarSign,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    MoreHorizontal,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';

interface Expense {
    id: number;
    title: string;
    amount: number;
    expense_date: string;
    category: string | null;
    campaign: {
        name: string;
    } | null;
}

interface Props {
    expenses: Expense[];
}

export default function FinanceIndex({ expenses }: Props) {
    const [search, setSearch] = useState('');

    const filteredExpenses = expenses.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.category && e.category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalSpend = expenses.reduce((acc, sum) => acc + Number(sum.amount), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Budget & <span className="text-emerald-500">Expenses</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Track marketing spend & ROI</p>
                    </div>

                    <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-emerald-200">
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                </div>
            }
        >
            <Head title="Marketing Budgets" />

            <div className="mt-8 space-y-8 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Total Spend</h3>
                            <p className="text-4xl font-black tracking-tighter">SAR {totalSpend.toLocaleString()}</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between text-xs font-black uppercase tracking-widest">
                            <span className="text-slate-400">This Month</span>
                            <span className="flex items-center gap-1 text-emerald-400"><TrendingUp className="w-4 h-4" /> +12%</span>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px]" />
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between min-h-[200px]">
                        <div>
                            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Avg Cost Per Lead</h3>
                            <p className="text-3xl font-black text-slate-900">SAR 120.50</p>
                        </div>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-4 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> 5% better than last month
                        </p>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between min-h-[200px]">
                        <div>
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Revenue (Attr.)</h3>
                            <p className="text-3xl font-black text-slate-900">SAR 1.2M</p>
                        </div>
                        <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-4">Calculated via CRM Leads</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Title</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Campaign</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{expense.title}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block truncate max-w-[120px]">
                                                {expense.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-500 uppercase truncate max-w-[150px] inline-block">
                                                {expense.campaign?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-900 tracking-tight">{format(new Date(expense.expense_date), 'MMM dd, yyyy')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-emerald-600 tracking-tight">SAR {Number(expense.amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-300 hover:text-slate-900 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredExpenses.length === 0 && (
                            <div className="p-16 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                No expenses found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
