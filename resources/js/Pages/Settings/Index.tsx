import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Settings, Shield, Building2, Users, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index() {
    const settingCategories = [
        {
            title: 'Clinic Profile',
            description: 'Manage clinical details, address, and operating hours',
            icon: Building2,
            href: route('hr.departments.index'), // Assuming this maps to clinic config for now Let's change this
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Role & Permissions Access',
            description: 'Configure dynamic roles and granular module permissions',
            icon: Shield,
            href: route('settings.roles.index'),
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            title: 'User Management',
            description: 'Add, terminate, or modify system user accounts',
            icon: Users,
            href: route('hr.employees.index'),
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'System Preferences',
            description: 'Localization, timezone, and global system behaviors',
            icon: Globe,
            href: '#',
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            title: 'Data & Integrations',
            description: 'API keys, database backups, and third-party webhooks',
            icon: Database,
            href: '#',
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">System Settings</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Global Configuration Hub</span>
                    </div>
                </div>
            }
        >
            <Head title="System Settings" />

            <div className="max-w-[1600px] mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {settingCategories.map((category) => (
                        <Link
                            key={category.title}
                            href={category.href}
                            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col items-start gap-4"
                        >
                            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", category.bg)}>
                                <category.icon className={cn("w-6 h-6", category.color)} />
                            </div>

                            <div className="space-y-1 z-10">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{category.title}</h3>
                                <p className="text-xs font-semibold text-slate-500 leading-relaxed">{category.description}</p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                Configure <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
