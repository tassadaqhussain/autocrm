import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Plus,
    ArrowRight,
    Sparkles,
    Facebook,
    Instagram,
    Globe,
    Smartphone,
    Check,
    ChevronRight,
    Search,
    Image as ImageIcon,
    Target,
    Users,
    Calendar,
    Wallet,
    Info,
    Layout,
    MoreHorizontal,
    Upload,
    Zap,
    MessageCircle,
    Monitor,
    MousePointer2,
    Eye,
    X,
    ChevronDown,
    LayoutGrid,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const contentLibrary = [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800', name: 'Elite Medical Lobby', author: 'Bagus Fikri' },
    { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800', name: 'Consultation Room', author: 'lhdi zein' },
    { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800', name: 'Treatment Equipment', author: 'Rijal Jatnika' },
];

const adVariations = [
    {
        id: 1,
        text: "Built not just for work, but for dreams in the making. With lightning-fast performance, stunning visuals, and long-lasting results — Elite Medical is always a step ahead.",
        charCount: 178,
        wordCount: 22,
        tone: 'Casual, Fin'
    },
    {
        id: 2,
        text: "Unwind, sip, and repeat at Clinic Hills! Where good healthcare meets great experts — it's time for some medical magic together!",
        charCount: 127,
        wordCount: 21,
        tone: 'Professional'
    },
    {
        id: 3,
        text: "Transform your life with our advanced weight loss programs. Join thousands of satisfied patients who achieved their goals with us.",
        charCount: 130,
        wordCount: 20,
        tone: 'Professional'
    }
];

const campaignTemplates = [
    {
        id: 1,
        name: 'New Service Launch',
        description: 'Perfect for announcing new treatments or services.',
        text: "Exciting news! We're now offering specialized [Service Name] at Elite Medical. Our expert team uses the latest technology to ensure the best results. Book your consultation today and take the first step towards a better you!"
    },
    {
        id: 2,
        name: 'Seasonal Promo',
        description: 'Ideal for holiday deals or monthly specials.',
        text: "Seasonal Glow-up Alert! 🌸 Get exclusive offers on all dental and skin treatments this month at Elite Medical. Limited slots available—don't miss out on your chance to shine. Book now!"
    },
    {
        id: 3,
        name: 'Patient Success Story',
        description: 'Build trust with social proof and results.',
        text: "Real results, real people. See why thousands of patients trust Elite Medical for their healthcare journey. Quality care you can count on. Swipe to see the transformations!"
    },
    {
        id: 4,
        name: 'Urgent/Quick Refresh',
        description: 'Focus on speed and immediate availability.',
        text: "Need a quick refresh? Our expert clinical team is ready to help you look and feel your best today. Same-day appointments available for select cosmetic treatments. Your local Elite Medical is just a call away."
    }
];

interface Props {
    clinic_accounts: { id: number, name: string }[];
}

export default function Builder({ clinic_accounts = [{ id: 1, name: 'Elite Medical Meta' }] }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [platform, setPlatform] = useState('meta');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showLibrary, setShowLibrary] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [newLocation, setNewLocation] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [addingLocation, setAddingLocation] = useState(false);
    const [addingInterest, setAddingInterest] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: 'Weight Loss Promo Q1',
        objective: 'Ads marketing',
        type: platform,
        account_id: clinic_accounts[0]?.id.toString() || '',
        ad_copy: adVariations[0].text,
        ad_creative_url: contentLibrary[0].url,
        status: 'Draft',
        budget: 50,
        budget_type: 'Daily',
        target_audience: {
            locations: ['Riyadh', 'Jeddah'],
            age_range: [25, 55],
            interests: ['Luxury', 'Medical', 'Weight Loss']
        }
    });

    const steps = [
        { id: 1, name: 'CREATE ADS' },
        { id: 2, name: 'CREATE AUDIENCE' },
        { id: 3, name: 'SCHEDULE & BUDGET' },
    ];

    const platforms = [
        { id: 'meta', name: 'Meta (FB/IG)', icon: Facebook, color: 'text-indigo-600' },
        { id: 'google', name: 'Google Ads', icon: Search, color: 'text-blue-500' },
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-500' },
        { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-slate-900' },
    ];

    const removeLocation = (loc: string) => {
        setData('target_audience', {
            ...data.target_audience,
            locations: data.target_audience.locations.filter(l => l !== loc)
        });
    };

    const addLocation = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLocation.trim()) {
            setData('target_audience', {
                ...data.target_audience,
                locations: [...data.target_audience.locations, newLocation.trim()]
            });
            setNewLocation('');
            setAddingLocation(false);
        }
    };

    const removeInterest = (int: string) => {
        setData('target_audience', {
            ...data.target_audience,
            interests: data.target_audience.interests.filter(i => i !== int)
        });
    };

    const addInterest = (e: React.FormEvent) => {
        e.preventDefault();
        if (newInterest.trim()) {
            setData('target_audience', {
                ...data.target_audience,
                interests: [...data.target_audience.interests, newInterest.trim()]
            });
            setNewInterest('');
            setAddingInterest(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('campaigns.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Unified Campaign Builder
                        </h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Cross-platform performance marketing assisted by AI.</p>
                    </div>

                    <div className="flex items-center gap-6 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {currentStep} of 3</span>
                            <div className="flex gap-1.5 ml-2">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={cn("w-2 h-2 rounded-full transition-all duration-300", s === currentStep ? "bg-indigo-600 w-4" : "bg-slate-200")} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Create Campaign" />

            <div className="max-w-[1600px] mx-auto pb-20">
                <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[850px] relative">

                    {/* Left: Editor Section */}
                    <div className="flex-1 p-10 overflow-y-auto border-r border-slate-50">

                        {/* Platform Pill Selector */}
                        <div className="mb-10">
                            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl w-fit mb-12 border border-slate-100/50 shadow-inner">
                                {platforms.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            setPlatform(p.id);
                                            setData('type', p.id);
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            platform === p.id
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        <p.icon className={cn("w-3.5 h-3.5", platform === p.id && p.color)} />
                                        {p.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                    <Plus className="w-7 h-7 stroke-[3]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">Create Campaign</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Targeting {platforms.find(p => p.id === platform)?.name}</p>
                                </div>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-8 mb-12 relative">
                                <div className="absolute top-[18px] left-0 right-0 h-[1px] bg-slate-100 -z-0"></div>
                                {steps.map((step, idx) => (
                                    <div key={step.id} className="relative z-10 flex items-center gap-4 bg-white pr-4">
                                        <div className={cn(
                                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-500",
                                            currentStep === step.id ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-slate-100 text-slate-300"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Step 0{idx + 1}</span>
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                currentStep === step.id ? "text-slate-900" : "text-slate-300"
                                            )}>{step.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {currentStep === 1 && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Objective</label>
                                            <div className="relative">
                                                <select
                                                    value={data.objective}
                                                    onChange={e => setData('objective', e.target.value)}
                                                    className="w-full bg-slate-50/50 bg-none border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 rounded-2xl py-4 pl-6 pr-12 text-xs font-black uppercase appearance-none transition-all cursor-pointer"
                                                >
                                                    <option>Ads marketing</option>
                                                    <option>Brand Awareness</option>
                                                    <option>Lead Generation</option>
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{platform === 'meta' ? 'Meta Business' : (platform === 'google' ? 'Google Account' : 'Channel Account')}</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-slate-50/50 bg-none border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 rounded-2xl py-4 pl-6 pr-12 text-xs font-black uppercase appearance-none transition-all cursor-pointer"
                                                >
                                                    {clinic_accounts.map(acc => (
                                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Describe Your Ads</label>
                                            <div className="flex gap-3">
                                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[9px] font-black uppercase text-indigo-600 hover:bg-slate-50 transition-all shadow-sm">
                                                    <Sparkles className="w-3.5 h-3.5" /> Select Tone
                                                </button>
                                                <button
                                                    onClick={() => setShowTemplates(true)}
                                                    type="button"
                                                    className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                                                >
                                                    <LayoutGrid className="w-3.5 h-3.5" /> Template
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative bg-slate-50/50 border border-slate-100/50 rounded-[2rem] p-8 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                                            <textarea
                                                value={data.ad_copy}
                                                onChange={e => setData('ad_copy', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium leading-relaxed min-h-[120px] placeholder:italic placeholder:text-slate-300"
                                                placeholder="Write a brief about your clinic services that I can plug into marketing channels..."
                                            />
                                            <div className="mt-6 flex justify-between items-center border-t border-slate-100/50 pt-6">
                                                <div className="flex gap-4">
                                                    <button type="button" onClick={() => setShowLibrary(true)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                                                    <button type="button" className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><MessageCircle className="w-5 h-5" /></button>
                                                </div>
                                                <button type="button" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                                                    <Zap className="w-4 h-4 fill-white" /> Generate
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-1">
                                            <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">AI Generated Results</h4>
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="space-y-4">
                                            {adVariations.map((v) => (
                                                <div
                                                    key={v.id}
                                                    onClick={() => setData('ad_copy', v.text)}
                                                    className={cn(
                                                        "p-8 border rounded-[2rem] transition-all cursor-pointer relative group",
                                                        data.ad_copy === v.text ? "bg-white border-indigo-200 shadow-xl shadow-indigo-50 ring-2 ring-indigo-50" : "bg-slate-50/30 border-slate-50 hover:border-slate-100"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                            <span>{v.charCount} Character</span>
                                                            <span>{v.wordCount} Words</span>
                                                            <span className="text-emerald-500">{v.tone}</span>
                                                        </div>
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                                            data.ad_copy === v.text ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-300 group-hover:bg-slate-200"
                                                        )}>
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-900 leading-relaxed italic">"{v.text}"</p>
                                                    <div className="mt-4">
                                                        <button type="button" className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                                                            More like this <ArrowRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audience Locations</label>
                                            <div className="flex flex-wrap gap-3 p-6 bg-slate-50/50 rounded-[2rem] min-h-[120px] border border-slate-100/50">
                                                {data.target_audience.locations.map(loc => (
                                                    <div key={loc} className="bg-white border border-slate-100 px-6 py-3.5 rounded-2xl text-sm font-black text-slate-900 flex items-center gap-4 shadow-sm group/loc">
                                                        {loc}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeLocation(loc); }}
                                                            className="text-slate-300 hover:text-rose-500 transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {addingLocation ? (
                                                    <form onSubmit={addLocation} className="flex items-center">
                                                        <input
                                                            autoFocus
                                                            value={newLocation}
                                                            onChange={e => setNewLocation(e.target.value)}
                                                            onBlur={() => !newLocation && setAddingLocation(false)}
                                                            placeholder="Add Location..."
                                                            className="bg-white border-indigo-200 border-2 px-6 py-3.5 rounded-2xl text-sm font-black text-slate-900 w-48 outline-none focus:ring-4 focus:ring-indigo-50 shadow-lg"
                                                        />
                                                    </form>
                                                ) : (
                                                    <button
                                                        onClick={() => setAddingLocation(true)}
                                                        type="button"
                                                        className="w-14 h-14 border-2 border-indigo-600 rounded-2xl text-indigo-600 flex items-center justify-center hover:bg-indigo-50 transition-all shadow-sm group"
                                                    >
                                                        <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interests & Behaviors</label>
                                            <div className="flex flex-wrap gap-3 p-6 bg-slate-50/50 rounded-[2rem] min-h-[120px] border border-slate-100/50">
                                                {data.target_audience.interests.map(int => (
                                                    <div key={int} className="bg-indigo-50/50 border border-indigo-100 px-6 py-3.5 rounded-2xl text-sm font-black text-indigo-900 flex items-center gap-4 group/int">
                                                        {int}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeInterest(int); }}
                                                            className="text-indigo-300 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Target className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {addingInterest ? (
                                                    <form onSubmit={addInterest} className="flex items-center">
                                                        <input
                                                            autoFocus
                                                            value={newInterest}
                                                            onChange={e => setNewInterest(e.target.value)}
                                                            onBlur={() => !newInterest && setAddingInterest(false)}
                                                            placeholder="Add Interest..."
                                                            className="bg-white border-indigo-200 border-2 px-6 py-3.5 rounded-2xl text-sm font-black text-slate-900 w-48 outline-none focus:ring-4 focus:ring-indigo-50 shadow-lg"
                                                        />
                                                    </form>
                                                ) : (
                                                    <button
                                                        onClick={() => setAddingInterest(true)}
                                                        type="button"
                                                        className="w-14 h-14 border-2 border-dashed border-slate-200 rounded-2xl text-slate-300 flex items-center justify-center hover:bg-white hover:border-slate-400 transition-all"
                                                    >
                                                        <Plus className="w-6 h-6" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
                                        <div className="relative z-10 flex justify-between items-center">
                                            <div>
                                                <h4 className="text-xl font-black italic mb-1 uppercase tracking-tighter">AI Audience Optimizer</h4>
                                                <p className="text-indigo-200 text-xs font-medium">We found 1.2M matching profiles in Riyadh based on your clinic services.</p>
                                            </div>
                                            <button type="button" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all backdrop-blur-md">
                                                <Zap className="w-6 h-6 text-white animate-pulse" />
                                            </button>
                                        </div>
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Strategy</label>
                                            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-[2rem] border border-slate-100/50">
                                                {['Daily', 'Lifetime'].map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setData('budget_type', type)}
                                                        className={cn(
                                                            "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                            data.budget_type === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                                                        )}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Amount (SAR)</label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-[10px]">SAR</div>
                                                <input
                                                    type="number"
                                                    value={data.budget}
                                                    onChange={e => setData('budget', parseFloat(e.target.value))}
                                                    className="w-full bg-slate-50/50 border-transparent rounded-[1.5rem] py-5 pl-18 pr-6 text-xl font-black tracking-tighter transition-all focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-600 p-12 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
                                        <div className="relative z-10">
                                            <h4 className="text-2xl font-black italic mb-4 uppercase tracking-tighter">Ready to launch?</h4>
                                            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-lg mb-8">Your campaign will be synced with {platforms.find(p => p.id === platform)?.name} instantly. All creatives are AI-optimized for performance.</p>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={processing}
                                                className="bg-white text-indigo-600 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                                            >
                                                Deploy Now
                                            </button>
                                        </div>
                                        <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Navigation */}
                        <div className="mt-14 pt-10 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" /> Campaign Draft • Saves automatically
                            </span>
                            <div className="flex gap-4">
                                <button type="button" className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                                <button
                                    type="button"
                                    onClick={() => currentStep < 3 ? setCurrentStep(currentStep + 1) : handleSubmit(new Event('submit') as any)}
                                    className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] group flex items-center gap-3 hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200 transition-all"
                                >
                                    {currentStep === 3 ? 'Launch Campaign' : 'Next Step'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Ad Preview Section */}
                    <div className="w-full md:w-[500px] bg-slate-50/30 p-12 flex flex-col items-center border-l border-slate-50/50">
                        <div className="flex justify-between items-center w-full mb-12">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                <Activity className="w-3.5 h-3.5" /> Live Dynamic Preview
                            </div>
                            <div className="bg-white p-1 rounded-xl flex gap-1 border border-slate-100 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode('mobile')}
                                    className={cn("p-2 rounded-lg transition-all", previewMode === 'mobile' ? "bg-slate-900 text-white shadow-lg" : "text-slate-300 hover:text-slate-600")}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode('desktop')}
                                    className={cn("p-2 rounded-lg transition-all", previewMode === 'desktop' ? "bg-slate-900 text-white shadow-lg" : "text-slate-300 hover:text-slate-600")}
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Ad Mockup */}
                        <div className={cn(
                            "w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 transition-all duration-700",
                            previewMode === 'mobile' ? "max-w-[340px]" : "max-w-full"
                        )}>
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs ring-4 ring-slate-50">EM</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black uppercase tracking-tight">Elite Medical Clinic</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">Sponsored <Globe className="w-2.5 h-2.5" /></span>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-300" />
                            </div>
                            <div className="px-5 pb-4">
                                <p className="text-xs font-medium leading-relaxed text-slate-700 line-clamp-3">
                                    {data.ad_copy || "Your ad copy will appear here as you type..."}
                                </p>
                            </div>
                            <div className="aspect-square relative group">
                                <img
                                    src={data.ad_creative_url}
                                    className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                    alt="Ad Content"
                                />
                                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">High Potential</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Elite Medical Riyadh</span>
                                            <span className="text-sm font-black text-white uppercase tracking-tight">Transform your life today</span>
                                        </div>
                                        <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-colors">Book Now</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between border-t border-slate-50 bg-slate-50/50">
                                <div className="flex items-center -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-black"><Facebook className="w-2.5 h-2.5" /></div>
                                    <div className="w-6 h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-black"><Instagram className="w-2.5 h-2.5" /></div>
                                    <span className="pl-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">12.4k Likes</span>
                                </div>
                                <div className="flex gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>52 Comments</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Intelligence Widget */}
                        <div className="w-full mt-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-8 relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-500" /> {platform.toUpperCase()} Intelligence
                                </h4>
                                <Activity className="w-4 h-4 text-slate-200" />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Quality Score</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Excellent</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                        <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50/80 border border-slate-100/50 p-4 rounded-2xl flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CPC Target</span>
                                        <span className="text-sm font-black text-slate-900 tracking-tight">0.85 - 1.20 <span className="text-[8px] text-slate-400">SAR</span></span>
                                    </div>
                                    <div className="bg-slate-50/80 border border-slate-100/50 p-4 rounded-2xl flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Reach</span>
                                        <span className="text-sm font-black text-indigo-600 tracking-tight">45k-120k</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Library Backdrop Modal */}
            {showLibrary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowLibrary(false)} />
                    <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Clinic Asset Library</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select visual assets for your performance advertisements.</p>
                            </div>
                            <button onClick={() => setShowLibrary(false)} className="p-4 bg-white rounded-2xl hover:bg-slate-100 transition-all shadow-sm">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <div className="p-10 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-indigo-100 hover:bg-indigo-50/30 py-12 transition-all">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-lg transition-all">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload New</span>
                                </div>
                                {contentLibrary.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setData('ad_creative_url', item.url);
                                            setShowLibrary(false);
                                        }}
                                        className="rounded-[3rem] overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-2xl transition-all h-[260px] border-4 border-transparent hover:border-indigo-600"
                                    >
                                        <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.name}</span>
                                            <span className="text-[8px] text-white/60 font-medium tracking-tight">by {item.author}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Selection Modal */}
            {showTemplates && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowTemplates(false)} />
                    <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Campaign Templates</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select a pre-written starting point for your campaign copy.</p>
                            </div>
                            <button onClick={() => setShowTemplates(false)} className="p-4 bg-white rounded-2xl hover:bg-slate-100 transition-all shadow-sm">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                {campaignTemplates.map(template => (
                                    <div
                                        key={template.id}
                                        onClick={() => {
                                            setData('ad_copy', template.text);
                                            setShowTemplates(false);
                                        }}
                                        className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{template.name}</h4>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{template.description}</p>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3 italic">"{template.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                            <div className="flex gap-10">
                                <span className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4 text-amber-500" /> AI Recommendations
                                </span>
                                <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <LayoutGrid className="w-4 h-4" /> Custom Library
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
