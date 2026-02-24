import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Shield, Plus, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
    roles: any[];
    groupedPermissions: Record<string, any[]>;
}

export default function Roles({ roles, groupedPermissions }: Props) {
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const { data, setData, patch, processing, isDirty } = useForm({
        permissions: selectedRole?.permissions?.map((p: any) => p.id) || []
    });

    const handleRoleChange = (role: any) => {
        setSelectedRole(role);
        setData('permissions', role.permissions?.map((p: any) => p.id) || []);
    };

    const togglePermission = (permissionId: number, isAdmin: boolean) => {
        if (isAdmin) return; // Admins get everything, cannot modify from here.

        setData('permissions', data.permissions.includes(permissionId)
            ? data.permissions.filter((id: number) => id !== permissionId)
            : [...data.permissions, permissionId]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.roles.update', selectedRole.id), {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <Link href={route('settings.index')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                            Settings <ChevronRight className="w-3 h-3" />
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Access Control Matrix</h2>
                    </div>
                    <button className="h-10 px-5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Role
                    </button>
                </div>
            }
        >
            <Head title="Role Settings" />

            <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
                {/* Left Panel: Role List */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
                        <Shield className="w-8 h-8 mx-auto text-indigo-100 fill-indigo-600 mb-3" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Security Groups</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage standard access</p>
                    </div>

                    <div className="space-y-2">
                        {roles.map(role => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleChange(role)}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all group",
                                    selectedRole?.id === role.id
                                        ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                                )}
                            >
                                <div>
                                    <h4 className={cn("text-[11px] font-black uppercase tracking-widest", selectedRole?.id === role.id ? "text-indigo-900" : "text-slate-900")}>
                                        {role.name}
                                    </h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {role.permissions?.length || 0} Permissions
                                    </p>
                                </div>
                                <ChevronRight className={cn("w-4 h-4 transition-transform", selectedRole?.id === role.id ? "text-indigo-600" : "text-slate-300 group-hover:translate-x-1")} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Permission Matrix */}
                <div className="col-span-12 lg:col-span-9 space-y-8">
                    {selectedRole ? (
                        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                                        <span className="text-indigo-600">{selectedRole.name}</span> Protocol
                                    </h3>
                                    <p className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">Toggle privileges to update constraints.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || !isDirty || selectedRole.name === 'Administrator'}
                                    className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <div key={module} className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center justify-between">
                                            {module} Module
                                        </h4>
                                        <div className="space-y-3">
                                            {perms.map(p => {
                                                const isAdmin = selectedRole.name === 'Administrator';
                                                const hasPerm = isAdmin || data.permissions.includes(p.id);

                                                return (
                                                    <label key={p.id} className={cn(
                                                        "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                                                        isAdmin ? "opacity-75 cursor-not-allowed bg-slate-50 border-slate-200" : "cursor-pointer hover:border-slate-300",
                                                        hasPerm && !isAdmin ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-slate-100"
                                                    )}>
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                togglePermission(p.id, isAdmin);
                                                            }}
                                                            className={cn(
                                                                "w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors",
                                                                hasPerm ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"
                                                            )}
                                                        >
                                                            {hasPerm && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1" onClick={() => togglePermission(p.id, isAdmin)}>
                                                            <p className={cn("text-[11px] font-black uppercase tracking-wider", hasPerm ? "text-emerald-900" : "text-slate-700")}>{p.name}</p>
                                                            <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{p.slug}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </form>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed h-full min-h-[400px] flex items-center justify-center">
                            <div className="text-center text-slate-400">
                                <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Select a Role to Configure</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
