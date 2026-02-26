import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
    Save,
    X,
    Award,
    Plus,
    Calendar,
    User,
    CloudUpload,
    HelpCircle,
    CheckCircle2,
    Info,
    ChevronDown,
    Check,
    Trophy, ThumbsUp, Book, Gift, Watch, Coffee, Puzzle, Plane, DollarSign, Heart, Star, Zap, Target
} from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import CreateAwardModal from './CreateAwardModal';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/Components/RichTextEditor';

interface Employee {
    id: number;
    user: {
        name: string;
    };
}

interface AwardType {
    id: number;
    title: string;
    icon: string;
    color: string;
}

interface Appreciation {
    id: number;
    employee_id: number;
    award_id: number;
    title: string;
    description: string;
    given_date: string;
    photo: string | null;
}

const ICON_MAP: Record<string, any> = {
    Trophy, ThumbsUp, Award, Book, Gift, Watch, Coffee, Puzzle, Plane, DollarSign, Heart, Star, Zap, Target
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    initialAwards: AwardType[];
    appreciation: Appreciation | null;
}

export default function CreateAppreciationDrawer({
    isOpen,
    onClose,
    employees,
    initialAwards,
    appreciation
}: Props) {
    const [awards, setAwards] = useState<AwardType[]>(initialAwards);
    const [isAddingAward, setIsAddingAward] = useState(false);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        employee_id: '',
        award_id: '',
        title: '',
        description: '',
        given_date: new Date().toISOString().split('T')[0],
        photo: null as File | null,
        _method: appreciation ? 'PATCH' : 'POST'
    });

    useEffect(() => {
        setAwards(initialAwards);
    }, [initialAwards]);

    useEffect(() => {
        if (appreciation) {
            setData({
                employee_id: String(appreciation.employee_id),
                award_id: String(appreciation.award_id),
                title: appreciation.title,
                description: appreciation.description,
                given_date: appreciation.given_date,
                photo: null,
                _method: 'PATCH',
            });
        } else {
            reset();
            setData({
                employee_id: '',
                award_id: '',
                title: '',
                description: '',
                given_date: new Date().toISOString().split('T')[0],
                photo: null,
                _method: 'POST',
            });
        }
    }, [appreciation, isOpen]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = appreciation
            ? route('hr.appreciations.update', appreciation.id)
            : route('hr.appreciations.store');

        // Note: For file uploads with PUT/PATCH, we use POST with _method spoofing. 
        // useForm's post/patch handlers take care of this usually, but let's be explicit if needed.
        if (appreciation) {
            post(url, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const handleAwardAdded = (newAward: AwardType) => {
        setAwards([...awards, newAward]);
        setData(d => ({
            ...d,
            award_id: String(newAward.id),
            title: newAward.title // Auto fill title if award is picked
        }));
    };

    const handleAwardChange = (awardId: string) => {
        const picked = awards.find(a => String(a.id) === awardId);
        setData(d => ({
            ...d,
            award_id: awardId,
            title: picked ? picked.title : d.title
        }));
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={appreciation ? 'Edit Appreciation' : 'Give Appreciation'}
            description={appreciation ? `Recognizing great performance` : 'Recognize and reward your employees for their hard work.'}
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
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60 active:scale-95"
                    >
                        <Save className="w-4 h-4" /> {appreciation ? 'Update' : 'Give Now'}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="p-1 space-y-8">
                <div className="space-y-6">
                    {/* Top Alert */}
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-black text-indigo-900 uppercase tracking-tight">Boost Morale</h4>
                            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Recognizing effort creates a positive and productive clinic environment.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Award Selection */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                Choose Award <span className="text-rose-500">*</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                            </InputLabel>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Listbox value={data.award_id} onChange={handleAwardChange}>
                                        <div className="relative">
                                            <Listbox.Button className="relative w-full h-11 cursor-default rounded-xl bg-white border border-slate-200 pl-10 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm shadow-sm hover:border-slate-300 transition-all">
                                                <span className="flex items-center gap-3 truncate">
                                                    {(() => {
                                                        const picked = awards.find(a => String(a.id) === data.award_id);
                                                        const IconComp = ICON_MAP[picked?.icon || ''] || Award;
                                                        return <IconComp className="h-4 w-4" style={{ color: picked?.color || '#94a3b8' }} />;
                                                    })()}
                                                    <span className="font-semibold text-slate-700">
                                                        {awards.find(a => String(a.id) === data.award_id)?.title || '-- Choose --'}
                                                    </span>
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-100">
                                                    {awards.map((award) => {
                                                        const AwardIcon = ICON_MAP[award.icon] || Award;
                                                        return (
                                                            <Listbox.Option
                                                                key={award.id}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors ${active ? 'bg-indigo-50 text-indigo-900' : 'text-slate-900'
                                                                    }`
                                                                }
                                                                value={String(award.id)}
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={cn(
                                                                            "flex items-center gap-3 truncate",
                                                                            selected ? "font-bold" : "font-semibold"
                                                                        )}>
                                                                            <AwardIcon className="h-4 w-4" style={{ color: award.color }} />
                                                                            {award.title}
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                                                <Check className="h-4 w-4" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        );
                                                    })}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingAward(true)}
                                    className="px-4 h-11 bg-slate-50 border border-slate-200 border-dashed text-slate-500 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-all active:scale-95"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <InputError message={errors.award_id} />
                        </div>

                        {/* Title - Manual or Auto-fill */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                Award Title <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative">
                                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Employee of the Month"
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    required
                                />
                            </div>
                            <InputError message={errors.title} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Given To */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                Given To <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm appearance-none"
                                    required
                                >
                                    <option value="">-- Select Employee --</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={errors.employee_id} />
                        </div>

                        {/* Date */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                                Date <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={data.given_date}
                                    onChange={(e) => setData('given_date', e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    required
                                />
                            </div>
                            <InputError message={errors.given_date} />
                        </div>
                    </div>



                    {/* Description/Summary */}
                    <div className="space-y-2">
                        <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                            Summary / Achievement <span className="text-rose-500">*</span>
                        </InputLabel>
                        <RichTextEditor
                            value={data.description}
                            onChange={(val) => setData('description', val)}
                            placeholder="Detail why this employee is receiving this award..."
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            Relevant Photo <span className="text-slate-400 font-normal tracking-normal">(Optional)</span>
                        </InputLabel>
                        <div
                            className="relative h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all group overflow-hidden"
                            onDragOver={(e) => { e.preventDefault(); }}
                        >
                            {data.photo ? (
                                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4">
                                    <Award className="w-8 h-8 text-green-500 mb-2" />
                                    <p className="text-[12px] font-bold text-slate-700 truncate max-w-full">
                                        {data.photo.name}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setData('photo', null)}
                                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700"
                                    >
                                        Remove Photo
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300">
                                        <CloudUpload className="w-6 h-6" />
                                    </div>
                                    <p className="mt-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest">Choose a file</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-1 italic">Click or drag & drop</p>
                                </>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                                accept="image/*"
                            />
                        </div>
                        <InputError message={errors.photo} />
                    </div>

                    {/* Footer Note */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                        <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Appreciations are visible to the entire team on their dashboards. Recognized employees will receive an automated email notification.
                        </p>
                    </div>
                </div>
            </form>

            <CreateAwardModal
                isOpen={isAddingAward}
                onClose={() => setIsAddingAward(false)}
                onSuccess={handleAwardAdded}
            />
        </Drawer>
    );
}
