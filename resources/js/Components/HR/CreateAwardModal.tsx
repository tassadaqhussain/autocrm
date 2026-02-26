import { useForm } from '@inertiajs/react';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
    Save,
    X,
    Trophy,
    ThumbsUp,
    Award,
    Book,
    Gift,
    Watch,
    Coffee,
    Puzzle,
    Plane,
    DollarSign,
    Heart,
    Star,
    Zap,
    Target,
    Check,
    ChevronDown
} from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { cn } from '@/lib/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newAward: any) => void;
}

const AWARD_ICONS = [
    { label: 'Trophy', value: 'Trophy', Icon: Trophy },
    { label: 'Thumbs Up', value: 'ThumbsUp', Icon: ThumbsUp },
    { label: 'Award', value: 'Award', Icon: Award },
    { label: 'Book', value: 'Book', Icon: Book },
    { label: 'Gift', value: 'Gift', Icon: Gift },
    { label: 'Watch', value: 'Watch', Icon: Watch },
    { label: 'Cup', value: 'Coffee', Icon: Coffee },
    { label: 'Puzzle', value: 'Puzzle', Icon: Puzzle },
    { label: 'Plane', value: 'Plane', Icon: Plane },
    { label: 'Money', value: 'DollarSign', Icon: DollarSign },
    { label: 'Heart', value: 'Heart', Icon: Heart },
    { label: 'Star', value: 'Star', Icon: Star },
    { label: 'Zap', value: 'Zap', Icon: Zap },
    { label: 'Target', value: 'Target', Icon: Target },
];

export default function CreateAwardModal({ isOpen, onClose, onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        icon: 'Award',
        color: '#4358E4',
        summary: '',
    });

    const handleAxiosSubmit = async () => {
        clearErrors();
        try {
            const res = await (window as any).axios.post(route('hr.awards.quick-store'), data);
            onSuccess(res.data);
            reset();
            onClose();
        } catch (err: any) {
            console.error(err);
        }
    };

    const SelectedIcon = AWARD_ICONS.find(i => i.value === data.icon)?.Icon || Award;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-[2.5rem] shadow-2xl relative overflow-visible">
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 rounded-t-[2.5rem] bg-white">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Define Award Type</h2>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Custom recognition badges</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all hover:rotate-90 bg-slate-50 p-2 rounded-full active:scale-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAxiosSubmit(); }} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        {/* Title */}
                        <div className="space-y-2.5 col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                                Award Title <span className="text-rose-500">*</span>
                            </InputLabel>
                            <TextInput
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Employee of the Month"
                                className="w-full h-12 px-4 bg-white border-slate-200 rounded-2xl text-[14px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold shadow-sm"
                                required
                                isFocused
                            />
                            <InputError message={errors.title} />
                        </div>

                        {/* Custom Icon Component Selection */}
                        <div className="space-y-2.5 col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                                Choose Icon <span className="text-rose-500">*</span>
                            </InputLabel>

                            <Listbox value={data.icon} onChange={val => setData('icon', val)}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full h-12 cursor-default rounded-2xl bg-white border border-slate-200 pl-4 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm shadow-sm hover:border-slate-300 transition-all">
                                        <span className="flex items-center gap-3 truncate">
                                            <SelectedIcon className="h-5 w-5 text-indigo-600" />
                                            <span className="font-semibold text-slate-700">{AWARD_ICONS.find(i => i.value === data.icon)?.label}</span>
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-100">
                                            {AWARD_ICONS.map((icon, iconIdx) => (
                                                <Listbox.Option
                                                    key={iconIdx}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-indigo-50 text-indigo-900' : 'text-slate-900'
                                                        }`
                                                    }
                                                    value={icon.value}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className={cn(
                                                                "flex items-center gap-3 truncate",
                                                                selected ? "font-bold" : "font-medium"
                                                            )}>
                                                                <icon.Icon className={cn(
                                                                    "h-4 w-4",
                                                                    selected ? "text-indigo-600" : "text-slate-400"
                                                                )} />
                                                                {icon.label}
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
                            <InputError message={errors.icon} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Color Code */}
                        <div className="space-y-2.5 col-span-1">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                                Badge Color <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="flex gap-3">
                                <TextInput
                                    value={data.color}
                                    onChange={e => setData('color', e.target.value)}
                                    className="flex-1 h-12 px-4 bg-white border-slate-200 rounded-2xl text-[14px] focus:ring-1 focus:ring-blue-500 transition-all font-bold uppercase shadow-sm"
                                    required
                                />
                                <div className="relative group">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={e => setData('color', e.target.value)}
                                        className="w-12 h-12 p-1.5 bg-white border border-slate-200 rounded-2xl cursor-pointer shadow-sm group-hover:border-indigo-300 transition-all"
                                    />
                                    <div className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-inset ring-black/5" />
                                </div>
                            </div>
                            <InputError message={errors.color} />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2.5">
                        <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                            Achievement Summary
                        </InputLabel>
                        <textarea
                            value={data.summary}
                            onChange={e => setData('summary', e.target.value)}
                            rows={3}
                            placeholder="Briefly describe the criteria for this award..."
                            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-[14px] font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none hover:border-slate-300 transition-all resize-none shadow-sm"
                        />
                        <InputError message={errors.summary} />
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-14 bg-indigo-600 text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> Save Award Type
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 h-14 bg-slate-50 text-slate-500 text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
