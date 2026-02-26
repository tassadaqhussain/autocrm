import { useForm } from '@inertiajs/react';
import { X, Search, Building2, UserCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import Drawer from '@/Components/Drawer';
import { cn } from '@/lib/utils';

interface EmployeeFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSearch: string;
    currentStatus: string;
    currentDepartment: string;
    currentDesignation: string;
    departments: { id: number; name: string }[];
    designations: { id: number; title: string; department_id: number }[];
    onApply: (data: any) => void;
}

export default function EmployeeFilterDrawer({
    isOpen,
    onClose,
    currentSearch,
    currentStatus,
    currentDepartment,
    currentDesignation,
    departments,
    designations,
    onApply,
}: EmployeeFilterDrawerProps) {
    const { data, setData, reset } = useForm({
        search: currentSearch || '',
        status: currentStatus || 'All',
        department: currentDepartment || 'All',
        designation: currentDesignation || 'All',
    });

    const handleApply = () => {
        onApply(data);
        onClose();
    };

    const handleReset = () => {
        const resetData = {
            search: '',
            status: 'All',
            department: 'All',
            designation: 'All',
        };
        setData(resetData);
        onApply(resetData);
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Employees"
            description="Refine the directory view"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Search Section */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            Search Personnel
                        </label>
                        <input
                            type="text"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            placeholder="Name, Email or ID..."
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Status Section */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            Workforce Status
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['All', 'Active', 'Inactive', 'On Leave'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setData('status', status)}
                                    className={cn(
                                        'h-11 rounded-xl text-xs font-semibold transition-all border shrink-0',
                                        data.status === status
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Department Section */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Building2 className="w-3 h-3" />
                            Departmental Unit
                        </label>
                        <select
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Designation Section */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-3 h-3" />
                            Strategic Role
                        </label>
                        <select
                            value={data.designation}
                            onChange={(e) => setData('designation', e.target.value)}
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Roles</option>
                            {designations
                                .filter((des) => data.department === 'All' || des.department_id === Number(data.department))
                                .map((des) => (
                                    <option key={des.id} value={des.id}>
                                        {des.title}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-slate-50/50 flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 h-12 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors bg-white border border-slate-200"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
