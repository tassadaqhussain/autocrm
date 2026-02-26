import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import {
    Save,
    X,
    CalendarCheck,
    Settings2,
    ShieldCheck,
    Users,
    Activity,
    ChevronRight,
    HelpCircle,
    Info,
    CreditCard,
    Check
} from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import MultiSelect from '@/Components/MultiSelect';
import { cn } from '@/lib/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateLeaveTypeModal({ isOpen, onClose }: Props) {
    const [activeTab, setActiveTab] = useState('General');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        allotment_type: 'Monthly Leave Type',
        monthly_limit: 0,
        paid_status: 'Paid',
        color_code: '#16813D',
        // Entitlement Tab
        effective_after_value: '',
        effective_after_unit: 'Day(s)',
        allowed_in_probation: true,
        unused_leaves_policy: 'Carry Forward',
        over_utilization_policy: 'Do not allow',
        allowed_in_notice_period: true,
        // Applicability Tab
        applicable_gender: ['Male', 'Female', 'Others'],
        applicable_marital_status: ['Single', 'Married', 'Widower', 'Widow', 'Separate', 'Divorced', 'Engaged'],
        applicable_departments: [] as string[],
        applicable_designations: [] as string[],
        applicable_roles: [] as string[],
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('hr.leave-types.quick-store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const tabs = [
        { id: 'General', icon: Settings2 },
        { id: 'Entitlement', icon: ShieldCheck },
        { id: 'Applicability', icon: Users }
    ];

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
            <div className="bg-white rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-slate-100">
                {/* Header */}
                <div className="px-12 py-10 flex items-center justify-between border-b border-slate-50 bg-white">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-[2rem] text-emerald-600 border border-emerald-100 shadow-xl shadow-emerald-900/5 ring-8 ring-emerald-50/30">
                            <CalendarCheck className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic leading-tight">Leave Architecture</h2>
                            <p className="text-[14px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-indigo-400" />
                                Configure global time-off policies
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-all hover:rotate-90 bg-slate-50 p-3 rounded-full active:scale-90 shadow-sm border border-slate-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="px-12 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
                    <div className="flex gap-12">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-4 py-6 text-[12px] font-black uppercase tracking-[0.15em] transition-all relative group",
                                    activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-lg transition-colors border",
                                    activeTab === tab.id ? "bg-indigo-50 border-indigo-100 text-indigo-500" : "bg-white border-slate-200 group-hover:border-slate-300"
                                )}>
                                    <tab.icon className="w-4 h-4" />
                                </div>
                                <span>{tab.id}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-indigo-600 rounded-full shadow-[0_-2px_12px_rgba(79,70,229,0.4)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-12">
                    {activeTab === 'General' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6 py-1">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Policy Fundamentals</h3>
                                <Info className="w-5 h-5 text-slate-300" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Leave Type */}
                                <div className="space-y-3">
                                    <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest pl-1">
                                        Policy Nomenclature <span className="text-rose-500 font-bold ml-1">*</span>
                                    </InputLabel>
                                    <TextInput
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="E.g. Sick, Casual, Privilege"
                                        className="w-full h-14 px-5 bg-white border-slate-200 rounded-2xl text-[15px] font-semibold focus:ring-1 focus:ring-blue-500 shadow-sm"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Allotment Type */}
                                <div className="space-y-3">
                                    <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest pl-1">Cycle Strategy</InputLabel>
                                    <div className="relative group">
                                        <select
                                            value={data.allotment_type}
                                            onChange={(e) => setData('allotment_type', e.target.value)}
                                            className="w-full h-14 pl-5 pr-12 bg-white border border-slate-200 rounded-2xl text-[15px] font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                                        >
                                            <option>Monthly Leave Type</option>
                                            <option>Yearly Leave Type</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-400">
                                            <ChevronRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly Leaves */}
                                <div className="space-y-3">
                                    <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest pl-1 flex items-center gap-2">
                                        Quantity Limit <HelpCircle className="w-4 h-4 text-slate-300" />
                                    </InputLabel>
                                    <TextInput
                                        type="number"
                                        value={data.monthly_limit}
                                        onChange={(e) => setData('monthly_limit', parseInt(e.target.value))}
                                        className="w-full h-14 px-5 bg-white border-slate-200 rounded-2xl text-[15px] font-bold focus:ring-1 focus:ring-blue-500 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                {/* Paid Status */}
                                <div className="space-y-3">
                                    <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest pl-1">Financial Classification</InputLabel>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Paid', 'Unpaid'].map(status => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setData('paid_status', status)}
                                                className={cn(
                                                    "h-14 rounded-2xl border-2 flex items-center justify-center gap-3 font-black text-[13px] uppercase tracking-widest transition-all",
                                                    data.paid_status === status ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-lg shadow-indigo-100" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                                )}
                                            >
                                                <CreditCard className={cn("w-4 h-4", data.paid_status === status ? "text-indigo-500" : "text-slate-300")} />
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Code */}
                                <div className="space-y-3">
                                    <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest pl-1">Visual Signature</InputLabel>
                                    <div className="flex gap-4">
                                        <TextInput
                                            value={data.color_code}
                                            onChange={(e) => setData('color_code', e.target.value)}
                                            className="flex-grow h-14 px-5 bg-white border-slate-200 rounded-2xl text-[15px] font-bold uppercase focus:ring-1 focus:ring-blue-500 shadow-sm"
                                        />
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                value={data.color_code}
                                                onChange={(e) => setData('color_code', e.target.value)}
                                                className="w-14 h-14 p-1.5 bg-white border border-slate-100 rounded-2xl cursor-pointer shadow-xl shadow-slate-200/50 appearance-none overflow-hidden"
                                            />
                                            <div className="absolute inset-0 rounded-2xl ring-4 ring-black/5 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Entitlement' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 border-l-4 border-amber-500 pl-6 py-1">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Eligibility & Persistence</h3>
                                <ShieldCheck className="w-5 h-5 text-slate-300" />
                            </div>

                            <div className="space-y-10 group/entitlement">
                                {/* First Row: Effective After & Allowed in probation */}
                                <div className="flex flex-wrap items-center gap-10 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100">
                                    <div className="flex items-center gap-6 min-w-[350px]">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                            <Activity className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                                Activation Threshold
                                            </InputLabel>
                                            <div className="flex items-center gap-3">
                                                <TextInput
                                                    type="number"
                                                    value={data.effective_after_value}
                                                    onChange={(e) => setData('effective_after_value', e.target.value)}
                                                    className="w-24 h-12 px-4 shadow-sm font-bold text-center bg-white border-slate-200 rounded-xl"
                                                />
                                                <div className="relative group/select">
                                                    <select
                                                        value={data.effective_after_unit}
                                                        onChange={(e) => setData('effective_after_unit', e.target.value)}
                                                        className="h-12 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-[13px] font-bold focus:ring-0 appearance-none cursor-pointer"
                                                    >
                                                        <option>Day(s)</option>
                                                        <option>Month(s)</option>
                                                    </select>
                                                    <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 rotate-90 text-slate-400 group-hover/select:text-indigo-500 transition-colors pointer-events-none" />
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest ml-2">Post joining</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-12 w-px bg-slate-200" />

                                    <label className="flex items-center gap-4 cursor-pointer group/toggle">
                                        <div className="relative w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors group-hover:bg-slate-300 has-[:checked]:bg-indigo-600 shadow-inner">
                                            <input
                                                type="checkbox"
                                                checked={data.allowed_in_probation}
                                                onChange={(e) => setData('allowed_in_probation', e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={cn(
                                                "w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 border border-slate-100 flex items-center justify-center",
                                                data.allowed_in_probation ? "translate-x-6" : "translate-x-0"
                                            )}>
                                                {data.allowed_in_probation ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[12px] text-slate-900 font-black uppercase tracking-widest block">Probationary Access</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase opacity-0 group-hover/toggle:opacity-100 transition-opacity">Allow during introductory phase</span>
                                        </div>
                                    </label>
                                </div>

                                {/* Second Row: Policies */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] space-y-5 shadow-sm hover:shadow-md transition-shadow">
                                        <InputLabel className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Carryover Logic
                                        </InputLabel>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Carry Forward', 'Encashment', 'Lapse'].map(policy => (
                                                <button
                                                    key={policy}
                                                    type="button"
                                                    onClick={() => setData('unused_leaves_policy', policy)}
                                                    className={cn(
                                                        "py-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                                                        data.unused_leaves_policy === policy ? "bg-blue-50 border-blue-200 text-blue-700 shadow-inner" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                                    )}
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{policy}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] space-y-5 shadow-sm hover:shadow-md transition-shadow">
                                        <InputLabel className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                            Over-Usage Protocol
                                        </InputLabel>
                                        <div className="space-y-3">
                                            {['Do not allow', 'Allow with approval', 'Allow freely'].map(policy => (
                                                <button
                                                    key={policy}
                                                    type="button"
                                                    onClick={() => setData('over_utilization_policy', policy)}
                                                    className={cn(
                                                        "w-full h-12 px-5 rounded-xl border flex items-center justify-between transition-all",
                                                        data.over_utilization_policy === policy ? "bg-rose-50 border-rose-200 text-rose-700 font-bold" : "bg-white border-slate-50 text-slate-400 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{policy}</span>
                                                    {data.over_utilization_policy === policy && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Applicability' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6 py-1">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Target Demographics</h3>
                                <Users className="w-5 h-5 text-slate-300" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                    <MultiSelect
                                        label="Gender Applicability"
                                        required
                                        options={[
                                            { label: 'Male', value: 'Male' },
                                            { label: 'Female', value: 'Female' },
                                            { label: 'Others', value: 'Others' },
                                        ]}
                                        value={data.applicable_gender}
                                        onChange={(val) => setData('applicable_gender', val)}
                                    />

                                    <MultiSelect
                                        label="Marital Status Filter"
                                        required
                                        options={[
                                            { label: 'Single', value: 'Single' },
                                            { label: 'Married', value: 'Married' },
                                            { label: 'Widow(er)', value: 'Widow' },
                                            { label: 'Separated', value: 'Separate' },
                                            { label: 'Divorced', value: 'Divorced' },
                                            { label: 'Engaged', value: 'Engaged' },
                                        ]}
                                        value={data.applicable_marital_status}
                                        onChange={(val) => setData('applicable_marital_status', val)}
                                    />
                                </div>

                                <div className="space-y-8 bg-indigo-50/20 p-8 rounded-[2.5rem] border border-indigo-50 shadow-inner">
                                    <MultiSelect
                                        label="Structural Departments"
                                        required
                                        options={[
                                            { label: 'Sales', value: 'Sales' },
                                            { label: 'Marketing', value: 'Marketing' },
                                            { label: 'Development', value: 'Development' },
                                            { label: 'Human Resource', value: 'Human Resource' },
                                        ]}
                                        value={data.applicable_departments}
                                        onChange={(val) => setData('applicable_departments', val)}
                                    />

                                    <MultiSelect
                                        label="Global Roles"
                                        required
                                        options={[
                                            { label: 'Manager', value: 'Manager' },
                                            { label: 'Team Lead', value: 'Team Lead' },
                                            { label: 'Executive', value: 'Executive' },
                                        ]}
                                        value={data.applicable_designations}
                                        onChange={(val) => setData('applicable_designations', val)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center gap-6">
                        <div className="flex items-center gap-3 text-slate-400">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Policy Architecture</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-10 h-16 bg-slate-50 text-slate-500 text-[13px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-10 h-16 bg-indigo-600 text-white text-[13px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50 ring-4 ring-indigo-50"
                            >
                                <Save className="w-5 h-5" /> Deploy Strategy
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
