import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
    Save,
    X,
    Star,
    Target,
    Zap,
    TrendingUp,
    Shield,
    Users,
    Calendar,
    User,
    CheckCircle2,
    Info,
    ChevronRight,
    MessageSquare,
    Lightbulb,
    LayoutGrid,
    Sparkles,
    Check,
    ChevronDown
} from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/Components/RichTextEditor';

interface Employee {
    id: number;
    user: {
        name: string;
    };
}

interface PerformanceReview {
    id: number;
    employee_id: number;
    period: string;
    review_date: string;
    rating: number;
    category: string;
    strengths: string | null;
    improvements: string | null;
    goals: string | null;
    status: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    review: PerformanceReview | null;
}

export const CATEGORY_CONFIG = [
    { label: 'General', icon: LayoutGrid, color: 'text-slate-500 bg-slate-50', iconColor: 'text-slate-500', barColor: 'bg-slate-200' },
    { label: 'Technical', icon: Zap, color: 'text-blue-500 bg-blue-50', iconColor: 'text-blue-500', barColor: 'bg-blue-200' },
    { label: 'Soft Skills', icon: MessageSquare, color: 'text-purple-500 bg-purple-50', iconColor: 'text-purple-500', barColor: 'bg-purple-200' },
    { label: 'Leadership', icon: Shield, color: 'text-amber-500 bg-amber-50', iconColor: 'text-amber-500', barColor: 'bg-amber-200' },
    { label: 'Teamwork', icon: Users, color: 'text-emerald-500 bg-emerald-50', iconColor: 'text-emerald-500', barColor: 'bg-emerald-200' }
];

const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Annual 2025', 'Annual 2026'];
const STATUSES = ['Draft', 'Submitted', 'Acknowledged'];

const RATING_LABELS: Record<number, { label: string; color: string; desc: string }> = {
    1: { label: 'Unsatisfactory', color: 'text-rose-600 bg-rose-50 border-rose-200', desc: 'Significantly below expectations' },
    2: { label: 'Needs Improvement', color: 'text-orange-600 bg-orange-50 border-orange-200', desc: 'Occasionally meets expectations' },
    3: { label: 'Meets Expectations', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', desc: 'Consistently meets expectations' },
    4: { label: 'Exceeds Expectations', color: 'text-blue-600 bg-blue-50 border-blue-200', desc: 'Frequently exceeds expectations' },
    5: { label: 'Outstanding', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Consistently exceptional performance' },
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="focus:outline-none transition-transform active:scale-90"
                >
                    <Star
                        className={cn(
                            "w-8 h-8 transition-all duration-200",
                            star <= (hovered || value)
                                ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-sm'
                                : 'text-slate-200 grayscale'
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

export default function CreatePerformanceDrawer({ isOpen, onClose, employees, review }: Props) {
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

    useEffect(() => {
        if (review) {
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
        } else {
            reset();
            setData({
                employee_id: '',
                period: 'Q1 2026',
                review_date: new Date().toISOString().split('T')[0],
                rating: 3,
                category: 'General',
                strengths: '',
                improvements: '',
                goals: '',
                status: 'Draft',
            });
        }
    }, [review, isOpen]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const url = review
            ? route('hr.performance.update', review.id)
            : route('hr.performance.store');

        if (review) {
            patch(url, { onSuccess: () => { reset(); onClose(); } });
        } else {
            post(url, { onSuccess: () => { reset(); onClose(); } });
        }
    };

    const currentCategory = CATEGORY_CONFIG.find(c => c.label === data.category) || CATEGORY_CONFIG[0];

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={review ? 'Edit Assessment' : 'New Performance Assessment'}
            description={review ? 'Updating performance records' : 'Evaluate employee performance and set future goals.'}
            maxWidth="max-w-2xl"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-500 text-[13px] font-bold uppercase tracking-widest hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60 active:scale-95"
                    >
                        <Save className="w-4 h-4" /> {review ? 'Update Review' : 'Save Review'}
                    </button>
                </div>
            }
        >
            <form key={review?.id ?? 'new'} onSubmit={handleSubmit} className="p-1 space-y-8 pb-10">
                <div className="space-y-6">
                    {/* Header Alert */}
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-black text-emerald-900 uppercase tracking-tight italic">Constructive Feedback</h4>
                            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Focus on growth and objective outcomes to drive high performance.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Employee Selection */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                Employee <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm appearance-none outline-none"
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={errors.employee_id} />
                        </div>

                        {/* Status */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                Review Status <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative">
                                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm appearance-none outline-none"
                                    required
                                >
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Period */}
                        <div className="space-y-2 col-span-3 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">Period</InputLabel>
                            <select
                                value={data.period}
                                onChange={(e) => setData('period', e.target.value)}
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm appearance-none outline-none"
                            >
                                {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        {/* Date */}
                        <div className="space-y-2 col-span-3 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">Date</InputLabel>
                            <input
                                type="date"
                                value={data.review_date}
                                onChange={(e) => setData('review_date', e.target.value)}
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm outline-none"
                                required
                            />
                        </div>

                        {/* Category - PREMIUM Listbox */}
                        <div className="space-y-2 col-span-3 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">Choose Category</InputLabel>
                            <Listbox value={data.category} onChange={val => setData('category', val)}>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full h-11 pl-4 pr-10 text-left bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm outline-none transition-all">
                                        <span className="flex items-center gap-2 truncate text-slate-700">
                                            <currentCategory.icon className={cn("w-4 h-4", currentCategory.iconColor)} />
                                            {data.category}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1.5 text-sm shadow-2xl ring-1 ring-black/5 focus:outline-none border border-slate-100">
                                            {CATEGORY_CONFIG.map((cat) => (
                                                <Listbox.Option
                                                    key={cat.label}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors ${active ? 'bg-indigo-50 text-indigo-900' : 'text-slate-900'
                                                        }`
                                                    }
                                                    value={cat.label}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={cn("flex items-center gap-3 truncate", selected ? "font-black" : "font-semibold")}>
                                                                <cat.icon className={cn("w-4 h-4", cat.iconColor)} />
                                                                {cat.label}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                                Overall Rating <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className={cn(
                                "px-3 py-1 rounded-lg border text-[11px] font-black uppercase tracking-tight",
                                RATING_LABELS[data.rating]?.color || 'bg-white border-slate-200 text-slate-400'
                            )}>
                                {RATING_LABELS[data.rating]?.label || 'Not Rated'}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <StarRating value={data.rating} onChange={(v) => setData('rating', v)} />
                            <p className="text-[11px] text-slate-400 font-medium italic">
                                {RATING_LABELS[data.rating]?.desc}
                            </p>
                        </div>
                        <InputError message={errors.rating} />
                    </div>



                    {/* Detailed Review */}
                    <div className="space-y-6">
                        {/* Strengths */}
                        <div className="space-y-2">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Key Strengths
                            </InputLabel>
                            <RichTextEditor
                                value={data.strengths}
                                onChange={(val) => setData('strengths', val)}
                                placeholder="Highlight specific successes and positive behaviors..."
                            />
                            <InputError message={errors.strengths} />
                        </div>

                        {/* Areas for Improvement */}
                        <div className="space-y-2">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                <Lightbulb className="w-3.5 h-3.5 text-blue-500" /> Improvement Areas
                            </InputLabel>
                            <RichTextEditor
                                value={data.improvements}
                                onChange={(val) => setData('improvements', val)}
                                placeholder="Note specific skills or behaviors that need attention..."
                            />
                            <InputError message={errors.improvements} />
                        </div>

                        {/* Goals */}
                        <div className="space-y-2">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-3.5 h-3.5 text-rose-500" /> Future Goals
                            </InputLabel>
                            <RichTextEditor
                                value={data.goals}
                                onChange={(val) => setData('goals', val)}
                                placeholder="Set SMART goals for the next review period..."
                            />
                            <InputError message={errors.goals} />
                        </div>
                    </div>

                    {/* Info Footer */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                        <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Once submitted, reviews may be shared with the employee for acknowledgment. Drafts remain visible only to administrators and reviewers.
                        </p>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}
