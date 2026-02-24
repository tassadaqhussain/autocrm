import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Star, Edit2, Trash2, TrendingUp, ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Drawer from '@/Components/Drawer';

interface Props {
    reviews: any[];
    employees: any[];
    stats: any;
    filters: any;
}

const CATEGORIES = ['General', 'Technical', 'Soft Skills', 'Leadership', 'Teamwork'];
const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Annual 2025', 'Annual 2026'];
const STATUSES = ['Draft', 'Submitted', 'Acknowledged'];

const RATING_LABELS: Record<number, { label: string; color: string }> = {
    1: { label: 'Unsatisfactory', color: 'text-red-600 bg-red-50 border-red-200' },
    2: { label: 'Needs Improvement', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    3: { label: 'Meets Expectations', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    4: { label: 'Exceeds Expectations', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    5: { label: 'Outstanding', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
};

const STATUS_CONFIG: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-200',
    Submitted: 'bg-blue-50 text-blue-600 border-blue-200',
    Acknowledged: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => onChange && setHovered(star)}
                    onMouseLeave={() => onChange && setHovered(0)}
                    className="focus:outline-none"
                >
                    <Star
                        className={`w-5 h-5 transition-colors ${star <= (hovered || value)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}

export default function Index({ reviews, employees, stats, filters }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        employee_id: '',
        period: 'Q1 2026',
        review_date: new Date().toISOString().split('T')[0],
        rating: 3 as number,
        category: 'General',
        strengths: '',
        improvements: '',
        goals: '',
        status: 'Draft',
    });

    const openCreate = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsOpen(true);
    };

    const openEdit = (review: any) => {
        setEditingId(review.id);
        setData({
            employee_id: String(review.employee_id),
            period: review.period,
            review_date: review.review_date,
            rating: review.rating,
            category: review.category,
            strengths: review.strengths || '',
            improvements: review.improvements || '',
            goals: review.goals || '',
            status: review.status,
        });
        clearErrors();
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            patch(route('performance.update', editingId), { onSuccess: close });
        } else {
            post(route('performance.store'), { onSuccess: close });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this review?')) {
            router.delete(route('performance.destroy', id), { preserveScroll: true });
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Performance Reviews</h2>
                    <button onClick={openCreate}
                        className="h-10 px-5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200">
                        <Plus className="w-4 h-4" /> Add Review
                    </button>
                </div>
            }
        >
            <Head title="Performance" />

            <div className="max-w-[1600px] mx-auto py-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Reviews', value: stats.total, icon: ClipboardList, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
                        { label: 'Submitted', value: stats.submitted, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                        { label: 'Drafts', value: stats.draft, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                        { label: 'Avg Rating', value: `${stats.avg_rating}/5`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className={`w-4 h-4 ${color}`} />
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                            </div>
                            <p className={`text-3xl font-black ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'All Periods', key: 'period', options: PERIODS },
                        { label: 'All Statuses', key: 'status', options: STATUSES },
                    ].map(({ label, key, options }) => (
                        <div key={key} className="relative">
                            <select
                                defaultValue={filters[key] || ''}
                                onChange={e => router.get(route('performance.index'), { ...filters, [key]: e.target.value || undefined }, { preserveState: true })}
                                className="h-9 pl-3 pr-8 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">{label}</option>
                                {options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </span>
                        </div>
                    ))}
                    <div className="relative">
                        <select
                            defaultValue={filters.employee_id || ''}
                            onChange={e => router.get(route('performance.index'), { ...filters, employee_id: e.target.value || undefined }, { preserveState: true })}
                            className="h-9 pl-3 pr-8 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm"
                        >
                            <option value="">All Employees</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.user?.name}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </span>
                    </div>
                </div>

                {/* Table */}
                {reviews.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-14 text-center">
                        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Reviews Yet</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-2 mb-5">Start tracking employee performance by adding your first review.</p>
                        <button onClick={openCreate}
                            className="h-9 px-5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add First Review
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    {['Employee', 'Period', 'Category', 'Rating', 'Review Date', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reviews.map(r => {
                                    const ratingConfig = RATING_LABELS[r.rating] ?? RATING_LABELS[3];
                                    return (
                                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0 ring-2 ring-white shadow-sm">
                                                        {r.employee?.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-800 block text-[13px]">{r.employee?.user?.name}</span>
                                                        {r.reviewer && (
                                                            <span className="text-[10px] text-slate-400">by {r.reviewer.name}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-700">{r.period}</td>
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">{r.category}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                        ))}
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${ratingConfig.color}`}>
                                                        {ratingConfig.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 font-medium">{formatDate(r.review_date)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${STATUS_CONFIG[r.status] ?? ''}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-1.5">
                                                    <button onClick={() => openEdit(r)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(r.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Drawer */}
            <Drawer
                isOpen={isOpen}
                onClose={close}
                title={editingId ? 'Edit Performance Review' : 'New Performance Review'}
                description="Evaluate employee performance across key areas"
                maxWidth="max-w-xl"
                footer={
                    <div className="flex items-center gap-4">
                        <button type="submit" form="perf-form" disabled={processing}
                            className="h-9 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {editingId ? 'Update Review' : 'Save Review'}
                        </button>
                        <button type="button" onClick={close}
                            className="h-9 px-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            Cancel
                        </button>
                    </div>
                }
            >
                <form id="perf-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Employee */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Employee <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}
                                className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                                <option value="" disabled>-- Select Employee --</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.user?.name}</option>)}
                            </select>
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </span>
                        </div>
                        {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Period */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Period <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={data.period} onChange={e => setData('period', e.target.value)}
                                    className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                                    {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </span>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Category <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={data.category} onChange={e => setData('category', e.target.value)}
                                    className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Review Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Review Date <span className="text-red-500">*</span></label>
                            <input type="date" value={data.review_date} onChange={e => setData('review_date', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Status <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={data.status} onChange={e => setData('status', e.target.value)}
                                    className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">
                            Rating <span className="text-red-500">*</span>
                            {data.rating > 0 && (
                                <span className={`ml-3 px-2 py-0.5 rounded border text-[10px] font-bold ${RATING_LABELS[data.rating]?.color}`}>
                                    {RATING_LABELS[data.rating]?.label}
                                </span>
                            )}
                        </label>
                        <StarRating value={data.rating} onChange={v => setData('rating', v)} />
                        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                    </div>

                    {/* Strengths */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Strengths</label>
                        <textarea value={data.strengths} onChange={e => setData('strengths', e.target.value)}
                            placeholder="Key strengths observed..."
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                            rows={3} />
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Areas for Improvement</label>
                        <textarea value={data.improvements} onChange={e => setData('improvements', e.target.value)}
                            placeholder="Areas that need attention..."
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                            rows={3} />
                    </div>

                    {/* Goals */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Goals for Next Period</label>
                        <textarea value={data.goals} onChange={e => setData('goals', e.target.value)}
                            placeholder="Set clear goals for the next review period..."
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                            rows={3} />
                    </div>
                </form>
            </Drawer>
        </AuthenticatedLayout>
    );
}
