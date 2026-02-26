import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import {
    Save,
    User,
    Mail,
    CloudUpload,
    Eye,
    EyeOff,
    RefreshCw,
    HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/Components/RichTextEditor';
import axios from 'axios';
import CreateDesignationModal from './CreateDesignationModal';
import CreateDepartmentModal from './CreateDepartmentModal';

interface Dept {
    id: number;
    name: string;
}
interface Desig {
    id: number;
    title: string;
    department_id: number;
}
interface Shift {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    departments: Dept[];
    designations: Desig[];
    shifts: Shift[];
}

const SALUTATIONS = ['', 'Mr', 'Ms', 'Mrs', 'Dr'];
const GENDERS = ['', 'Male', 'Female', 'Other'];
const LANGUAGES = ['', 'English', 'Spanish', 'French', 'German', 'Urdu'];
const ROLES = ['', 'Employee', 'Admin', 'Doctor', 'Counselor', 'Staff', 'Media Manager'];
const EMPLOYMENT_TYPES = ['', 'Full-time', 'Part-time', 'Contract'];
const MARITAL_STATUSES = ['', 'Single', 'Married', 'Divorced', 'Widowed'];
const COUNTRY_CODES = ['+1', '+44', '+91', '+92', '+93', '+61', '+81', '+86'];

function generatePassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let s = '';
    for (let i = 0; i < 12; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
}

export default function CreateEmployeeDrawer({
    isOpen,
    onClose,
    departments: initialDepts,
    designations: initialDesigs,
    shifts,
}: Props) {
    const [depts, setDepts] = useState<Dept[]>(initialDepts);
    const [desigs, setDesigs] = useState<Desig[]>(initialDesigs);
    const [isAddingDept, setIsAddingDept] = useState(false);
    const [isAddingDesig, setIsAddingDesig] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setDepts(initialDepts);
        setDesigs(initialDesigs);
    }, [initialDepts, initialDesigs]);

    const { data, setData, post, processing, errors, reset } = useForm({
        salutation: '',
        name: '',
        email: '',
        profile_picture: null as File | null,
        password: '',
        designation_id: '',
        department_id: '',
        country: '',
        mobile_code: '+1',
        mobile: '',
        gender: 'Male',
        joining_date: new Date().toISOString().split('T')[0],
        date_of_birth: '',
        reporting_to: '',
        language: 'English',
        role: 'Employee',
        address: '',
        about: '',
        login_allowed: true,
        email_notifications: true,
        hourly_rate: '',
        slack_member_id: '',
        skills: '',
        probation_end_date: '',
        notice_period_start_date: '',
        notice_period_end_date: '',
        employment_type: 'Full-time',
        marital_status: 'Single',
        business_address: '',
        shift_id: '',
    });

    useEffect(() => {
        if (isOpen && !data.password) {
            setData('password', generatePassword());
        }
    }, [isOpen]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.employees.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleSaveAndAddMore = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.employees.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setData('password', generatePassword());
            },
        });
    };

    const handleQuickAddDeptSuccess = (newDept: Dept) => {
        setDepts((prev) => [...prev, newDept]);
        setData('department_id', String(newDept.id));
    };

    const handleQuickAddDesigSuccess = (newDesig: Desig) => {
        setDesigs((prev) => [...prev, newDesig]);
        setData('designation_id', String(newDesig.id));
    };

    const setPasswordGenerated = () => setData('password', generatePassword());

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Add Employee"
            description="Create a new employee profile."
            maxWidth="max-w-[90vw]"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 text-[13px] font-semibold hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAndAddMore}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-all"
                    >
                        <Save className="w-4 h-4" /> Save & Add More
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSave} className="space-y-10">
                {/* Account Details */}
                <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900">Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 flex items-center gap-1">
                                Employee ID
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </InputLabel>
                            <input
                                type="text"
                                readOnly
                                value="Auto-generated"
                                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Salutation</InputLabel>
                            <select
                                value={data.salutation}
                                onChange={(e) => setData('salutation', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {SALUTATIONS.map((s) => (
                                    <option key={s || 'x'} value={s}>{s || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                            <InputLabel className="text-[13px] text-slate-600">Employee Name <span className="text-rose-500">*</span></InputLabel>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Employee Email <span className="text-rose-500">*</span></InputLabel>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="e.g. johndoe@example.com"
                                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 flex items-center gap-1">
                                Profile Picture
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </InputLabel>
                            <label className="flex items-center justify-center gap-2 h-11 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                <CloudUpload className="w-4 h-4 text-slate-400" />
                                <span className="text-[13px] text-slate-500">Choose a file</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('profile_picture', e.target.files?.[0] ?? null)}
                                />
                            </label>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <InputLabel className="text-[13px] text-slate-600">Password <span className="text-rose-500">*</span></InputLabel>
                            <p className="text-[11px] text-slate-500">Must have at least 8 characters.</p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full h-11 pl-3 pr-20 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-1.5 rounded text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={setPasswordGenerated}
                                            className="p-1.5 rounded text-slate-400 hover:text-slate-600"
                                            title="Generate password"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                Designation <span className="text-rose-500">*</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </InputLabel>
                            <div className="flex gap-2">
                                <select
                                    value={data.designation_id}
                                    onChange={(e) => setData('designation_id', e.target.value)}
                                    className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:ring-1 focus:ring-indigo-500 hover:border-slate-300 transition-all shadow-sm"
                                >
                                    <option value="">--</option>
                                    {desigs.filter((d) => String(d.department_id) === data.department_id).map((d) => (
                                        <option key={d.id} value={d.id}>{d.title}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingDesig(true)}
                                    className="px-4 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-colors border-dashed active:scale-95"
                                >
                                    Add
                                </button>
                            </div>
                            <InputError message={errors.designation_id} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                Department <span className="text-rose-500">*</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </InputLabel>
                            <div className="flex gap-2">
                                <select
                                    value={data.department_id}
                                    onChange={(e) => setData('department_id', e.target.value)}
                                    className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:ring-1 focus:ring-indigo-500 hover:border-slate-300 transition-all shadow-sm"
                                >
                                    <option value="">--</option>
                                    {depts.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingDept(true)}
                                    className="px-4 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-colors border-dashed active:scale-95"
                                >
                                    Add
                                </button>
                            </div>
                            <InputError message={errors.department_id} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Country</InputLabel>
                            <select
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">--</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="India">India</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Mobile</InputLabel>
                            <div className="flex gap-1">
                                <select
                                    value={data.mobile_code}
                                    onChange={(e) => setData('mobile_code', e.target.value)}
                                    className="w-20 h-11 px-2 bg-white border border-slate-200 rounded-lg text-[13px]"
                                >
                                    {COUNTRY_CODES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    placeholder="e.g. 1234567890"
                                    className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Gender</InputLabel>
                            <select
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {GENDERS.map((g) => (
                                    <option key={g || 'x'} value={g}>{g || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Joining Date <span className="text-rose-500">*</span></InputLabel>
                            <input
                                type="date"
                                value={data.joining_date}
                                onChange={(e) => setData('joining_date', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError message={errors.joining_date} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Date of Birth</InputLabel>
                            <input
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Reporting To</InputLabel>
                            <select
                                value={data.reporting_to}
                                onChange={(e) => setData('reporting_to', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">--</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Language</InputLabel>
                            <select
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l || 'x'} value={l}>{l || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">User Role</InputLabel>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {ROLES.map((r) => (
                                    <option key={r || 'x'} value={r}>{r || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                            <InputLabel className="text-[13px] text-slate-600">Address</InputLabel>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="e.g. 132, My Street, Kingston, New York 12401"
                                rows={2}
                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>


                        <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                            <InputLabel className="text-[13px] text-slate-600">About</InputLabel>
                            <RichTextEditor
                                value={data.about}
                                onChange={(val) => setData('about', val)}
                                placeholder="Describe the employee's background, role, or unique skills..."
                            />
                        </div>
                    </div>
                </div>

                {/* Other Details */}
                <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900">Other Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Login Allowed?</InputLabel>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="login_allowed"
                                        checked={data.login_allowed === true}
                                        onChange={() => setData('login_allowed', true)}
                                        className="text-indigo-600"
                                    />
                                    <span className="text-[13px]">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="login_allowed"
                                        checked={data.login_allowed === false}
                                        onChange={() => setData('login_allowed', false)}
                                        className="text-indigo-600"
                                    />
                                    <span className="text-[13px]">No</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Receive email notifications?</InputLabel>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email_notifications"
                                        checked={data.email_notifications === true}
                                        onChange={() => setData('email_notifications', true)}
                                        className="text-indigo-600"
                                    />
                                    <span className="text-[13px]">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email_notifications"
                                        checked={data.email_notifications === false}
                                        onChange={() => setData('email_notifications', false)}
                                        className="text-indigo-600"
                                    />
                                    <span className="text-[13px]">No</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Hourly Rate</InputLabel>
                            <div className="flex">
                                <span className="inline-flex items-center h-11 px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-[13px] text-slate-600">$</span>
                                <input
                                    type="text"
                                    value={data.hourly_rate}
                                    onChange={(e) => setData('hourly_rate', e.target.value)}
                                    className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-r-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Slack Member ID</InputLabel>
                            <div className="flex">
                                <span className="inline-flex items-center h-11 px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-[13px] text-slate-600">@</span>
                                <input
                                    type="text"
                                    value={data.slack_member_id}
                                    onChange={(e) => setData('slack_member_id', e.target.value)}
                                    className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-r-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Skills</InputLabel>
                            <input
                                type="text"
                                value={data.skills}
                                onChange={(e) => setData('skills', e.target.value)}
                                placeholder="e.g. communication, ReactJS"
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 flex items-center gap-1">
                                Probation End Date
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            </InputLabel>
                            <input
                                type="date"
                                value={data.probation_end_date}
                                onChange={(e) => setData('probation_end_date', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 flex items-center gap-1">Notice Period Start Date</InputLabel>
                            <input
                                type="date"
                                value={data.notice_period_start_date}
                                onChange={(e) => setData('notice_period_start_date', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 flex items-center gap-1">Notice Period End Date</InputLabel>
                            <input
                                type="date"
                                value={data.notice_period_end_date}
                                onChange={(e) => setData('notice_period_end_date', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Employment Type</InputLabel>
                            <select
                                value={data.employment_type}
                                onChange={(e) => setData('employment_type', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {EMPLOYMENT_TYPES.map((t) => (
                                    <option key={t || 'x'} value={t}>{t || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Marital Status</InputLabel>
                            <select
                                value={data.marital_status}
                                onChange={(e) => setData('marital_status', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {MARITAL_STATUSES.map((m) => (
                                    <option key={m || 'x'} value={m}>{m || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Business Address <span className="text-rose-500">*</span></InputLabel>
                            <select
                                value={data.business_address}
                                onChange={(e) => setData('business_address', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">--</option>
                                <option value="Round Rock">Round Rock</option>
                                <option value="Head Office">Head Office</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Shift</InputLabel>
                            <select
                                value={data.shift_id}
                                onChange={(e) => setData('shift_id', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">--</option>
                                {shifts.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            <CreateDesignationModal
                isOpen={isAddingDesig}
                onClose={() => setIsAddingDesig(false)}
                departments={depts}
                onSuccess={handleQuickAddDesigSuccess}
                defaultDepartmentId={data.department_id}
            />
            <CreateDepartmentModal
                isOpen={isAddingDept}
                onClose={() => setIsAddingDept(false)}
                onSuccess={handleQuickAddDeptSuccess}
            />
        </Drawer>
    );
}
