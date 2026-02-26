import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import {
    Calendar,
    Save,
    Plus,
    HelpCircle,
} from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState } from 'react';
import CreateLeaveTypeModal from './CreateLeaveTypeModal';
import RichTextEditor from '@/Components/RichTextEditor';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employees: any[];
    leaveTypes: any[];
    leave?: any;
}

export default function CreateLeaveDrawer({ isOpen, onClose, employees, leaveTypes, leave }: Props) {
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, recentlySuccessful, clearErrors } = useForm({
        employee_id: leave?.employee_id || '',
        leave_type_id: leave?.leave_type_id || '',
        duration_type: leave?.duration_type || 'Full Day',
        start_date: leave?.start_date || new Date().toISOString().split('T')[0],
        end_date: leave?.end_date || new Date().toISOString().split('T')[0],
        reason: leave?.reason || '',
        status: leave?.status || 'Pending',
        attachment: null as File | null,
        _method: leave ? 'patch' : 'post',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
            onClose();
        }
    }, [recentlySuccessful]);

    useEffect(() => {
        if (leave) {
            setData({
                employee_id: leave.employee_id || '',
                leave_type_id: leave.leave_type_id || '',
                duration_type: leave.duration_type || 'Full Day',
                start_date: leave.start_date || new Date().toISOString().split('T')[0],
                end_date: leave.end_date || new Date().toISOString().split('T')[0],
                reason: leave.reason || '',
                status: leave.status || 'Pending',
                attachment: null,
                _method: 'patch',
            });
        } else {
            setData({
                employee_id: '',
                leave_type_id: '',
                duration_type: 'Full Day',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                reason: '',
                status: 'Pending',
                attachment: null,
                _method: 'post',
            });
            clearErrors();
        }
    }, [leave, isOpen]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (leave) {
            post(route('hr.leave.update', leave.id), {
                preserveScroll: true,
            });
        } else {
            post(route('hr.leave.store'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={leave ? 'Edit Leave' : 'New Leave'}
            maxWidth="max-w-[80vw]"
            footer={
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-transparent text-slate-400 text-[13px] font-semibold hover:text-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Section: Assign Leave */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Assign Leave</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Choose Member */}
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">
                                Choose Member <span className="text-rose-500">*</span>
                            </InputLabel>
                            <select
                                value={data.employee_id}
                                onChange={(e) => setData('employee_id', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                            >
                                <option value="">--</option>
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.user?.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.employee_id} />
                        </div>

                        {/* Leave Type */}
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">
                                Leave Type <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="flex gap-2">
                                <select
                                    value={data.leave_type_id}
                                    onChange={(e) => setData('leave_type_id', e.target.value)}
                                    className="flex-1 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                >
                                    <option value="">--</option>
                                    {leaveTypes.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsTypeModalOpen(true)}
                                    className="px-4 border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50 border-dashed"
                                >
                                    Add
                                </button>
                            </div>
                            <InputError message={errors.leave_type_id} />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Status</InputLabel>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        {/* Select Duration */}
                        <div className="space-y-4">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Select Duration</InputLabel>
                            <div className="flex flex-wrap items-center gap-6">
                                {['Full Day', 'Multiple', 'First Half', 'Second Half'].map((type) => (
                                    <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="radio"
                                            checked={data.duration_type === type}
                                            onChange={() => setData('duration_type', type)}
                                            className="w-4 h-4 text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-[13px] text-slate-700 group-hover:text-indigo-600 transition-colors font-medium">
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <InputLabel className="text-[13px] text-slate-600 font-medium">Date</InputLabel>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => {
                                        setData((prev) => ({
                                            ...prev,
                                            start_date: e.target.value,
                                            end_date: prev.duration_type !== 'Multiple' ? e.target.value : prev.end_date,
                                        }));
                                    }}
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 shadow-sm px-4"
                                />
                                {data.duration_type === 'Multiple' && (
                                    <div className="mt-4">
                                        <InputLabel className="text-[13px] text-slate-600 font-medium mb-2">End Date</InputLabel>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 shadow-sm px-4"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Reason for absence */}
                    <div className="space-y-2">
                        <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                            Reason for absence <span className="text-rose-500">*</span>
                        </InputLabel>
                        <RichTextEditor
                            value={data.reason}
                            onChange={(val) => setData('reason', val)}
                            placeholder="e.g. Feeling not well..."
                        />
                        <InputError message={errors.reason} />
                    </div>

                    {/* Add File */}
                    <div className="space-y-2">
                        <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                            Add File <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        </InputLabel>
                        <div className="w-full border-2 border-dashed border-slate-100 bg-slate-50/30 rounded-[2rem] p-12 hover:bg-slate-50 hover:border-indigo-100 transition-all relative flex flex-col items-center justify-center group">
                            <input
                                type="file"
                                onChange={(e) => setData('attachment', e.target.files ? e.target.files[0] : null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Plus className="w-6 h-6 text-slate-300" />
                                </div>
                                <span className="text-[13px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                                    {data.attachment ? (data.attachment as File).name : (leave?.attachment ? leave.attachment.split('/').pop() : 'Choose a file')}
                                </span>
                            </div>
                        </div>
                        <InputError message={errors.attachment} />
                    </div>
                </div>
            </form>

            <CreateLeaveTypeModal
                isOpen={isTypeModalOpen}
                onClose={() => setIsTypeModalOpen(false)}
            />
        </Drawer>
    );
}
