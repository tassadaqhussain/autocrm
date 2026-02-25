import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import {
    Save,
    RotateCcw,
    Phone,
    User,
    Mail,
    ToggleLeft,
    ToggleRight,
    Globe2,
    MapPin,
} from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateClientDrawer({ isOpen, onClose }: Props) {
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        salutation: '',
        name: '',
        email: '',
        mobile: '',
        country: '',
        gender: '',
        language: '',
        client_category: '',
        client_sub_category: '',
        login_allowed: true,
        email_notifications: true,
        company_name: '',
        official_website: '',
        tax_name: '',
        gst_vat_number: '',
        office_phone: '',
        city: '',
        state: '',
        postal_code: '',
        company_address: '',
        shipping_address: '',
        note: '',
        status: 'Active',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
            onClose();
        }
    }, [recentlySuccessful]);

    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            preserveScroll: true,
        });
    };

    const handleSaveAndAddMore: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const toggleStatus = () => {
        setData('status', data.status === 'Active' ? 'Inactive' : 'Active');
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Add Client"
            description="Quickly register a new client into your CRM workspace."
            maxWidth="max-w-[80vw]"
            footer={
                <div className="flex items-center justify-between w-full">
                    <button
                        type="button"
                        onClick={() => {
                            setData({
                                salutation: 'Mr',
                                name: 'John Doe',
                                email: 'john@example.com',
                                mobile: '+92 300 1234567',
                                country: 'Pakistan',
                                gender: 'Male',
                                language: 'English',
                                client_category: 'Standard',
                                client_sub_category: '',
                                login_allowed: true,
                                email_notifications: true,
                                company_name: 'Acme Corporation',
                                official_website: 'https://example.com',
                                tax_name: 'Acme Tax Name',
                                gst_vat_number: '18AABCU9603R1ZM',
                                office_phone: '+92 21 1234567',
                                city: 'Karachi',
                                state: 'Sindh',
                                postal_code: '75500',
                                company_address: '132, My Street, Kingston, New York 12401',
                                shipping_address: '132, My Street, Kingston, New York 12401',
                                note: 'VIP client. Handle with priority.',
                                status: 'Active',
                            });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-[12px] font-bold uppercase tracking-wider rounded-lg hover:bg-amber-100 transition-all border border-amber-100/50"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Magic Fill
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                            onClick={handleSaveAndAddMore}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4" /> Save &amp; Add More
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
            <form onSubmit={handleSave} className="space-y-12">
                {/* Account Details */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
                            <p className="text-[12px] text-slate-400 mt-1">
                                Basic profile information used across CRM modules.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Salutation</InputLabel>
                            <select
                                value={data.salutation}
                                onChange={(e) => setData('salutation', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">--</option>
                                <option value="Mr">Mr.</option>
                                <option value="Ms">Ms.</option>
                                <option value="Mrs">Mrs.</option>
                                <option value="Dr">Dr.</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                Client Name <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                                    <User className="w-4 h-4" />
                                </span>
                                <TextInput
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-10 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2 md:col-span-1">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                Email
                            </InputLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="e.g. johndoe@example.com"
                                    className="w-full pl-10 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2 md:col-span-1">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                Mobile
                            </InputLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Phone className="w-4 h-4" />
                                </span>
                                <TextInput
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    placeholder="e.g. +92 300 1234567"
                                    className="w-full pl-10 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <InputError message={errors.mobile} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Country</InputLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Globe2 className="w-4 h-4" />
                                </span>
                                <TextInput
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    placeholder="e.g. United States"
                                    className="w-full pl-10 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Gender</InputLabel>
                            <select
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">--</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Language</InputLabel>
                            <select
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">--</option>
                                <option value="English">English</option>
                                <option value="Urdu">Urdu</option>
                                <option value="Arabic">Arabic</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Client Category</InputLabel>
                            <div className="flex gap-2">
                                <TextInput
                                    value={data.client_category}
                                    onChange={(e) => setData('client_category', e.target.value)}
                                    placeholder="e.g. VIP, Enterprise"
                                    className="flex-1 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    className="px-3 border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Client Sub Category</InputLabel>
                            <div className="flex gap-2">
                                <TextInput
                                    value={data.client_sub_category}
                                    onChange={(e) => setData('client_sub_category', e.target.value)}
                                    placeholder="e.g. Apparel, Clinic"
                                    className="flex-1 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    className="px-3 border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Login Allowed?</InputLabel>
                            <div className="flex items-center gap-4">
                                <label className="inline-flex items-center gap-2 text-[13px] text-slate-700">
                                    <input
                                        type="radio"
                                        className="text-indigo-600"
                                        checked={data.login_allowed === true}
                                        onChange={() => setData('login_allowed', true)}
                                    />
                                    Yes
                                </label>
                                <label className="inline-flex items-center gap-2 text-[13px] text-slate-700">
                                    <input
                                        type="radio"
                                        className="text-indigo-600"
                                        checked={data.login_allowed === false}
                                        onChange={() => setData('login_allowed', false)}
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Receive email notifications?</InputLabel>
                            <div className="flex items-center gap-4">
                                <label className="inline-flex items-center gap-2 text-[13px] text-slate-700">
                                    <input
                                        type="radio"
                                        className="text-indigo-600"
                                        checked={data.email_notifications === true}
                                        onChange={() => setData('email_notifications', true)}
                                    />
                                    Yes
                                </label>
                                <label className="inline-flex items-center gap-2 text-[13px] text-slate-700">
                                    <input
                                        type="radio"
                                        className="text-indigo-600"
                                        checked={data.email_notifications === false}
                                        onChange={() => setData('email_notifications', false)}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="button"
                            onClick={toggleStatus}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-all"
                        >
                            {data.status === 'Active' ? (
                                <ToggleRight className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <ToggleLeft className="w-5 h-5 text-slate-400" />
                            )}
                            <span className="text-[12px] font-semibold text-slate-700">
                                Status:&nbsp;
                                <span className={data.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}>
                                    {data.status}
                                </span>
                            </span>
                        </button>
                        <p className="text-[11px] text-slate-400">
                            Active clients will appear in automations and billing workflows.
                        </p>
                    </div>
                </div>

                {/* Company Details */}
                <div className="pt-4 pb-16 border-t border-dashed border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">Company Details</h3>
                        <p className="text-[11px] text-slate-400">Company information for billing and documents.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Company Name</InputLabel>
                                <TextInput
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    placeholder="e.g. Acme Corporation"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Official Website</InputLabel>
                                <TextInput
                                    value={data.official_website}
                                    onChange={(e) => setData('official_website', e.target.value)}
                                    placeholder="e.g. https://www.example.com"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Tax Name</InputLabel>
                                <TextInput
                                    value={data.tax_name}
                                    onChange={(e) => setData('tax_name', e.target.value)}
                                    placeholder="e.g. GST/VAT registered name"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">GST/VAT Number</InputLabel>
                                <TextInput
                                    value={data.gst_vat_number}
                                    onChange={(e) => setData('gst_vat_number', e.target.value)}
                                    placeholder="e.g. 18AABCU9603R1ZM"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Office Phone Number</InputLabel>
                                <TextInput
                                    value={data.office_phone}
                                    onChange={(e) => setData('office_phone', e.target.value)}
                                    placeholder="e.g. +92 21 1234567"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">City</InputLabel>
                                <TextInput
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="e.g. New York, Dubai"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">State</InputLabel>
                                <TextInput
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value)}
                                    placeholder="e.g. California"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Postal code</InputLabel>
                                <TextInput
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    placeholder="e.g. 90250"
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500"
                                />
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
                                    <span className="px-1.5 py-0.5 bg-slate-200 text-[9px] font-bold rounded uppercase tracking-tighter">
                                        It&apos;s you
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Company Address</InputLabel>
                                <textarea
                                    value={data.company_address}
                                    onChange={(e) => setData('company_address', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-xl text-[13px] min-h-[80px] p-4 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    placeholder="e.g. 132, My Street, Kingston, New York 12401"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Shipping Address</InputLabel>
                                <textarea
                                    value={data.shipping_address}
                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-xl text-[13px] min-h-[80px] p-4 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    placeholder="If different from company address"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Note</InputLabel>
                            <textarea
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-xl text-[13px] min-h-[100px] p-4 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                placeholder="Internal notes about this client..."
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}

