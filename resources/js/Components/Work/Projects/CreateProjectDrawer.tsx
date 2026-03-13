import { useForm } from '@inertiajs/react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Save, X, FolderPlus, Plus, FileUp, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import RichTextEditor from '@/Components/RichTextEditor';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import ProjectCategoryModal from './ProjectCategoryModal';
import QuickClientModal from './QuickClientModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    clients: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    users: { id: number; name: string }[];
}

export default function CreateProjectDrawer({ isOpen, onClose, clients, categories, departments, users }: Props) {
    const [showOtherDetails, setShowOtherDetails] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        project_name: '',
        short_code: '',
        client_id: '',
        category_id: '',
        department_id: '',
        description: '',
        summary: '',
        notes: '',
        start_date: '',
        deadline: '',
        no_deadline: false,
        status: 'Not Started',
        budget: '0',
        currency: 'USD ($)',
        hours_estimate: '',
        public_gantt_chart: false,
        public_task_board: false,
        task_approval: false,
        is_public: false,
        allow_manual_time_logs: false,
        enable_miroboard: false,
        send_task_notification: false,
        member_ids: [] as number[],
    });

    const fillRandomData = () => {
        const randomTitles = ['Nova CRM Integration', 'Project Blue Horizon', 'Internal Audit v2', 'SaaS Scalability Initiative', 'Client Onboarding Redesign'];
        const randomCodes = ['PRJ-101', 'CX-99', 'AUD-X', 'OSS-01', 'MKT-B'];
        const randomStatus: ('Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Finished')[] = ['Not Started', 'In Progress', 'On Hold'];

        const idx = Math.floor(Math.random() * randomTitles.length);

        setData({
            ...data,
            project_name: randomTitles[idx],
            short_code: randomCodes[idx],
            start_date: new Date().toISOString().split('T')[0],
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            summary: `<p>This is a randomly generated summary for <strong>${randomTitles[idx]}</strong>.</p>`,
            notes: `<p>Auto-generated notes for testing purposes.</p>`,
            status: randomStatus[Math.floor(Math.random() * randomStatus.length)],
            budget: (Math.floor(Math.random() * 5000) + 1000).toString(),
            is_public: Math.random() > 0.5,
            public_gantt_chart: Math.random() > 0.5,
            public_task_board: Math.random() > 0.5,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('work.projects.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-4">
                    <span>Add Project</span>
                    <button
                        type="button"
                        onClick={fillRandomData}
                        className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
                    >
                        Fill Random Data
                    </button>
                </div>
            }
            maxWidth="max-w-[1200px]" // Wide drawer for the complex form
            footer={
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        form="create-project-form"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-[#1d82f5] text-white text-sm font-medium rounded hover:bg-[#1669c1] transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            }
        >
            <form id="create-project-form" onSubmit={handleSubmit} className="space-y-10 pb-10">
                {/* Project Details Section */}
                <div className="space-y-8">
                    <h3 className="text-xl text-slate-800 border-b border-slate-100 pb-4">Project Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Short Code & Project Name */}
                        <div className="space-y-2">
                            <InputLabel value="Short Code" className="text-slate-500 font-normal" />
                            <TextInput
                                className="w-full border-slate-200 shadow-none text-sm py-2"
                                placeholder="Project unique short code"
                                value={data.short_code}
                                onChange={(e) => setData('short_code', e.target.value)}
                            />
                            <InputError message={errors.short_code} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Project Name" isRequired className="text-slate-500 font-normal" />
                            <TextInput
                                className="w-full border-slate-200 shadow-none text-sm py-2"
                                placeholder="Write a project name"
                                value={data.project_name}
                                onChange={(e) => setData('project_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.project_name} />
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                            <InputLabel value="Start Date" isRequired className="text-slate-500 font-normal" />
                            <TextInput
                                type="date"
                                className="w-full border-slate-200 shadow-none text-sm py-2 text-slate-400"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.start_date} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <InputLabel value="Deadline" isRequired className="text-slate-500 font-normal" />
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
                                        checked={data.no_deadline}
                                        onChange={(e) => setData('no_deadline', e.target.checked)}
                                    />
                                    <span className="text-[11px] text-slate-500">There is no project deadline</span>
                                </label>
                            </div>
                            <TextInput
                                type="date"
                                className="w-full border-slate-200 shadow-none text-sm py-2 text-slate-400"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                                disabled={data.no_deadline}
                                required={!data.no_deadline}
                            />
                            <InputError message={errors.deadline} />
                        </div>

                        {/* Category, Department, Client */}
                        <div className="space-y-2">
                            <InputLabel value="Project Category" className="text-slate-500 font-normal" />
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <InputError message={errors.category_id} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Department" className="text-slate-500 font-normal" />
                            <select
                                className="w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                            >
                                <option value="">Nothing selected</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.department_id} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <InputLabel value="Client" className="text-slate-500 font-normal" />
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsClientModalOpen(true)}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <InputError message={errors.client_id} />
                        </div>
                    </div>

                    {/* Rich Text Editors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <InputLabel value="Project Summary" className="text-slate-500 font-normal" />
                            <RichTextEditor
                                value={data.summary}
                                onChange={(val) => setData('summary', val)}
                                className="min-h-[160px]"
                            />
                            <InputError message={errors.summary} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Notes" className="text-slate-500 font-normal" />
                            <RichTextEditor
                                value={data.notes}
                                onChange={(val) => setData('notes', val)}
                                className="min-h-[160px]"
                            />
                            <InputError message={errors.notes} />
                        </div>
                    </div>

                    {/* Radios & Public Checkbox */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <InputLabel value="Public Gantt Chart" className="text-slate-500 font-normal" />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="public_gantt" checked={data.public_gantt_chart} onChange={() => setData('public_gantt_chart', true)} className="text-indigo-600" />
                                    <span className="text-sm text-slate-600">Enable</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="public_gantt" checked={!data.public_gantt_chart} onChange={() => setData('public_gantt_chart', false)} className="text-indigo-600" />
                                    <span className="text-sm text-slate-600">Disable</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <InputLabel value="Public Task Board" className="text-slate-500 font-normal" />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="public_tasks" checked={data.public_task_board} onChange={() => setData('public_task_board', true)} className="text-indigo-600" />
                                    <span className="text-sm text-slate-600">Enable</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="public_tasks" checked={!data.public_task_board} onChange={() => setData('public_task_board', false)} className="text-indigo-600" />
                                    <span className="text-sm text-slate-600">Disable</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <InputLabel value="Task needs approval by Admin/Project Admin" className="text-slate-500 font-normal" />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="task_approval" checked={data.task_approval} onChange={() => setData('task_approval', true)} className="text-indigo-600" />
                                    <span className="text-sm text-slate-600">Enable</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="task_approval" checked={!data.task_approval} onChange={() => setData('task_approval', false)} className="text-indigo-600" />
                                    <span className="text-sm text-slate-600">Disable</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="create_public_project"
                            className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
                            checked={data.is_public}
                            onChange={(e) => setData('is_public', e.target.checked)}
                        />
                        <label htmlFor="create_public_project" className="text-sm text-slate-500 font-medium">Create Public Project</label>
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Add Project Members" isRequired className="text-slate-500 font-normal" />
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <select
                                    multiple
                                    className="w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                    value={data.member_ids.map(id => id.toString())}
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                        setData('member_ids', values);
                                    }}
                                >
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                        <InputError message={errors.member_ids} />
                    </div>
                </div>

                {/* Other Details Section */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setShowOtherDetails(!showOtherDetails)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {showOtherDetails ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                            <span className="text-lg font-bold text-slate-800">Other Details</span>
                        </div>
                    </button>

                    {showOtherDetails && (
                        <div className="p-8 space-y-8 animate-in slide-in-from-top duration-300">
                            <div className="space-y-2">
                                <InputLabel value="Add File" className="text-slate-500 font-normal" />
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer group">
                                    <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:text-indigo-600 group-hover:bg-white transition-all shadow-sm">
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <span className="text-slate-500 font-medium">Choose a file</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <InputLabel value="Currency" className="text-slate-500 font-normal" />
                                    <select
                                        className="w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-700"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                    >
                                        <option value="USD ($)">$ (USD)</option>
                                        <option value="SAR (SAR)">SAR (SAR)</option>
                                        <option value="EUR (€)">€ (EUR)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Project Budget" className="text-slate-500 font-normal" />
                                    <TextInput
                                        className="w-full border-slate-200 shadow-none text-sm py-2"
                                        placeholder="e.g. 10000"
                                        value={data.budget}
                                        onChange={(e) => setData('budget', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Hours Estimate (In Hours)" className="text-slate-500 font-normal" />
                                    <TextInput
                                        className="w-full border-slate-200 shadow-none text-sm py-2"
                                        placeholder="e.g. 500"
                                        value={data.hours_estimate}
                                        onChange={(e) => setData('hours_estimate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
                                        checked={data.allow_manual_time_logs}
                                        onChange={(e) => setData('allow_manual_time_logs', e.target.checked)}
                                    />
                                    <span className="text-sm text-slate-500 font-medium">Allow manual time logs</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
                                        checked={data.enable_miroboard}
                                        onChange={(e) => setData('enable_miroboard', e.target.checked)}
                                    />
                                    <span className="text-sm text-slate-500 font-medium">Enable Miroboard</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
                                        checked={data.send_task_notification}
                                        onChange={(e) => setData('send_task_notification', e.target.checked)}
                                    />
                                    <span className="text-sm text-slate-500 font-medium">Send task notification to client</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {/* Quick Add Modals */}
            <ProjectCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
            />
            <QuickClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
            />
        </Drawer>
    );
}

