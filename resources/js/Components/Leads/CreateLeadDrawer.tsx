import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import {
    User,
    Phone,
    Target,
    Scale,
    AlertCircle,
    UserCheck,
    CheckCircle2,
    Info,
    X,
    ChevronDown,
    Save,
    RotateCcw
} from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { cn } from '@/lib/utils';

interface Campaign {
    id: number;
    name: string;
}

interface Counselor {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    campaigns: Campaign[];
    counselors: Counselor[];
}

export default function CreateLeadDrawer({ isOpen, onClose, campaigns, counselors }: Props) {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        phone: '',
        source: '',
        campaign_id: '',
        counselor_id: '',
        bmi: '',
        health_info: '',
        urgency: 'Medium',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
            onClose();
        }
    }, [recentlySuccessful]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('leads.store'), {
            preserveScroll: true,
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Add Lead Contact Info"
            maxWidth="max-w-[70vw]"
            footer={
                <div className="flex items-center justify-between w-full">
                    <button
                        type="button"
                        onClick={() => {
                            const names = ['Sarah Jenkins', 'Michael Chen', 'Emma Rodriguez', 'David Thompson', 'Aria Vance', 'Zara Malik'];
                            const sources = ['WhatsApp (Meta Ads)', 'Direct Call', 'Referral'];
                            const healthConcerns = [
                                'Patient interested in weight management programs.',
                                'Post-operative follow up required for clinical assessment.',
                                'Inquiry regarding non-invasive procedure options.',
                                'Seeking consultation for chronic inflammation management.'
                            ];

                            setData({
                                ...data,
                                name: names[Math.floor(Math.random() * names.length)],
                                phone: '+92 3' + Math.floor(10000000 + Math.random() * 90000000),
                                source: sources[Math.floor(Math.random() * sources.length)],
                                health_info: healthConcerns[Math.floor(Math.random() * healthConcerns.length)],
                                bmi: (18 + Math.random() * 15).toFixed(1),
                                urgency: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
                                counselor_id: counselors.length > 0 ? counselors[Math.floor(Math.random() * counselors.length)].id.toString() : '',
                                campaign_id: campaigns.length > 0 ? campaigns[Math.floor(Math.random() * campaigns.length)].id.toString() : '',
                            });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-[12px] font-bold uppercase tracking-wider rounded-lg hover:bg-amber-100 transition-all border border-amber-100/50"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Magic Fill
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={submit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                            onClick={submit}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4" /> Save & Add More
                        </button>
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-transparent text-slate-400 text-[13px] font-semibold hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            }
        >
            <div className="space-y-12">
                {/* Section: Lead Contact Detail */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Lead Contact Detail</h3>
                    </div>

                    {/* Row 1: Salutation, Name, Email */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Salutation</InputLabel>
                            <select className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                                <option value="">--</option>
                                <option value="Mr">Mr.</option>
                                <option value="Ms">Ms.</option>
                                <option value="Dr">Dr.</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                Name <span className="text-rose-500">*</span>
                            </InputLabel>
                            <TextInput
                                placeholder="e.g. John Doe"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">Email</InputLabel>
                            <TextInput
                                type="email"
                                placeholder="e.g. johndoe@example.com"
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <p className="text-[11px] text-slate-400">Email will be used to send proposals.</p>
                        </div>
                    </div>

                    {/* Row 2: Lead Source, Added By, Lead Owner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">Phone <span className="text-rose-500">*</span></InputLabel>
                            <TextInput
                                placeholder="e.g. +92 300 1234567"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Lead Source</InputLabel>
                            <div className="flex gap-2">
                                <select
                                    value={data.source}
                                    onChange={e => setData('source', e.target.value)}
                                    className="flex-1 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">--</option>
                                    <option value="WhatsApp (Meta Ads)">WhatsApp (Meta Ads)</option>
                                    <option value="Direct Call">Direct Call</option>
                                    <option value="Referral">Referral</option>
                                </select>
                                <button type="button" className="px-3 border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50">Add</button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Added By</InputLabel>
                            <div className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 h-11 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                    <span className="font-medium text-slate-700">{user?.name || 'Admin'}</span>
                                    <span className="px-1.5 py-0.5 bg-slate-200 text-[9px] font-bold rounded uppercase tracking-tighter">It's you</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Lead Owner</InputLabel>
                            <div className="relative">
                                <select
                                    value={data.counselor_id}
                                    onChange={e => setData('counselor_id', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 pl-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                >
                                    <option value="">--</option>
                                    {counselors.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    ?
                                </div>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full bg-indigo-600 transition-colors focus:outline-none ring-2 ring-indigo-50">
                            <span className="translate-x-5 inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
                        </div>
                        <span className="text-[13px] font-medium text-slate-700">Create Deal</span>
                    </div>

                    {/* Deal Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">Deal Name <span className="text-rose-500">*</span></InputLabel>
                            <TextInput placeholder="e.g. John Doe" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11" />
                        </div>
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">Pipeline <span className="text-rose-500">*</span></InputLabel>
                            <select className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11"><option>Sales Pipeline</option></select>
                        </div>
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">Deal Stages <span className="text-rose-500">*</span></InputLabel>
                            <div className="w-full bg-white border border-slate-200 rounded-lg px-4 h-11 flex items-center gap-3 text-[13px]">
                                <div className="w-2 h-2 rounded-full bg-amber-400" />
                                <span className="font-medium">Generated</span>
                                <ChevronDown className="ml-auto w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Company Details */}
                <div className="pt-6 pb-20">
                    <button className="w-full flex items-center gap-2 text-lg font-bold text-slate-900 group">
                        <ChevronDown className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Company Details
                    </button>

                    <div className="mt-8 space-y-8">
                        {/* Row 1: Company Name, Website, Mobile, Office Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Company Name</InputLabel>
                                <TextInput placeholder="e.g. Acme Corporation" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Website</InputLabel>
                                <TextInput placeholder="e.g. https://www.example.com" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Mobile</InputLabel>
                                <TextInput placeholder="e.g. 1234567890" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Office Phone Number</InputLabel>
                                <TextInput placeholder="" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                        </div>

                        {/* Row 2: Country, State, City, Postal Code */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Country</InputLabel>
                                <select className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                                    <option value="">--</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">State</InputLabel>
                                <TextInput placeholder="e.g. California, Rajasthan, Dubai" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">City</InputLabel>
                                <TextInput placeholder="e.g. New York, Jaipur, Dubai" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Postal code</InputLabel>
                                <TextInput placeholder="e.g. 90250" className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                        </div>

                        {/* Row 3: Address */}
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Address</InputLabel>
                            <textarea
                                className="w-full bg-white border-slate-200 rounded-xl text-[13px] min-h-[100px] p-4 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                placeholder="e.g. 132, My Street, Kingston, New York 12401"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
