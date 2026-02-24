import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    BarChart3,
    Settings,
    LogOut,
    User,
    Bell,
    Search,
    ChevronLeft,
    Menu,
    X,
    MessageSquare,
    Target,
    Plus,
    Command,
    Clock,
    HelpCircle,
    ChevronRight,
    LayoutGrid,
    DollarSign,
    Briefcase,
    Building2,
    Award,
    Zap,
    FileText,
    Calculator,
    Receipt,
    CreditCard,
    FileMinus,
    TrendingDown,
    Landmark,
    Folder,
    Handshake,
    Contact,
    Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    name: string;
    href: string;
    icon: any;
    active: boolean;
    permission?: string;
    children?: NavItem[];
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const can = (permission: string) => {
        if (!user.all_permissions) return false;
        return user.all_permissions.includes('*') || user.all_permissions.includes(permission);
    };

    const navigation: NavItem[] = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutGrid,
            active: route().current('dashboard')
        },
        {
            name: 'Clinic Operations',
            href: '#',
            icon: Building2,
            active: false,
            permission: 'view_patients', // Dummy permission for now
            children: [
                { name: 'Patient Records', href: '#', icon: Users, permission: 'view_patients', active: false },
                { name: 'Doctor Schedules', href: '#', icon: Calendar, permission: 'view_appointments', active: false },
                { name: 'Prescriptions', href: '#', icon: FileText, permission: 'view_patients', active: false },
                { name: 'Procedure Notes', href: '#', icon: Command, permission: 'view_patients', active: false },
            ]
        },
        {
            name: 'Settings',
            href: route('settings.index'),
            icon: Settings,
            active: route().current('settings.*') || route().current('hr.clinic.*') || route().current('hr.shifts.*'),
            permission: 'manage_clinic',
            children: [
                { name: 'System Settings', href: route('settings.index'), icon: LayoutGrid, permission: '*', active: route().current('settings.index') },
                { name: 'Role Management', href: route('settings.roles.index'), icon: Shield, permission: '*', active: route().current('settings.roles.*') },
                { name: 'Clinic Profile', href: route('hr.clinic.profile'), icon: Building2, permission: 'manage_clinic', active: route().current('hr.clinic.*') },
                { name: 'Operational Shifts', href: route('hr.shifts.index'), icon: Clock, permission: 'manage_hr', active: route().current('hr.shifts.*') },
            ]
        },
        {
            name: 'CRM',
            href: route('appointments.index'),
            icon: Users,
            active: route().current('appointments.*') || route().current('leads.*'),
            permission: 'view_crm',
            children: [
                { name: 'Patients', href: '#', icon: Users, permission: 'view_patients', active: false },
                { name: 'Leads', href: route('leads.index'), icon: Folder, permission: 'view_leads', active: route().current('leads.*') },
                { name: 'Lead Contact', href: '#', icon: Contact, permission: 'view_leads', active: false },
                { name: 'Deals', href: '#', icon: Handshake, permission: 'manage_leads', active: false },
                { name: 'Appointments', href: route('appointments.index'), icon: Calendar, permission: 'view_appointments', active: route().current('appointments.*') },
            ]
        },
        {
            name: 'Marketing',
            href: route('marketing.dashboard'),
            icon: Zap,
            active: route().current('marketing.*') || route().current('campaigns.*'),
            roles: ['Admin', 'Media Manager'],
            children: [
                { name: 'Dashboard', href: route('marketing.dashboard'), icon: LayoutGrid, active: route().current('marketing.dashboard') },
                {
                    name: 'Campaigns',
                    href: route('marketing.campaigns.index'),
                    icon: BarChart3,
                    active: route().current('marketing.campaigns.*') || route().current('campaigns.*')
                },
                { name: 'Lead Sources', href: route('marketing.sources.index'), icon: Target, active: route().current('marketing.sources.*') },
                { name: 'Influencers', href: route('marketing.influencers.index'), icon: Users, active: route().current('marketing.influencers.*') },
                { name: 'Lead Attribution', href: route('marketing.attribution.dashboard'), icon: Search, active: route().current('marketing.attribution.*') },
                { name: 'Media Library', href: route('marketing.creatives.index'), icon: LayoutGrid, active: route().current('marketing.creatives.*') },
                { name: 'Budget & ROI', href: route('marketing.finance.index'), icon: DollarSign, active: route().current('marketing.finance.*') },
                { name: 'Automation', href: route('marketing.automation.index'), icon: Zap, active: route().current('marketing.automation.*') },
                { name: 'Settings', href: route('marketing.settings.index'), icon: Settings, active: route().current('marketing.settings.*') },
            ]
        },
        {
            name: 'HR',
            href: route('hr.dashboard'),
            icon: Users,
            active: route().current('hr.*') && !route().current('hr.clinic.*'),
            permission: 'manage_hr',
            children: [
                { name: 'Dashboard', href: route('hr.dashboard'), icon: LayoutGrid, permission: 'manage_hr', active: route().current('hr.dashboard') },
                { name: 'Employees', href: route('hr.employees.index'), icon: User, permission: 'manage_hr', active: route().current('hr.employees.*') },
                { name: 'Leaves', href: route('hr.leave.index'), icon: Calendar, permission: 'manage_hr', active: route().current('hr.leave.*') },
                { name: 'Shift Roster', href: route('hr.roster.index'), icon: Calendar, permission: 'manage_hr', active: route().current('hr.roster.*') },
                { name: 'Attendance', href: route('hr.attendance.index'), icon: Clock, permission: 'mark_attendance', active: route().current('hr.attendance.*') },
                { name: 'Holiday', href: route('hr.holidays.index'), icon: Calendar, permission: 'manage_hr', active: route().current('hr.holidays.*') },
                { name: 'Designation', href: route('hr.designations.index'), icon: Award, permission: 'manage_hr', active: route().current('hr.designations.*') },
                { name: 'Department', href: route('hr.departments.index'), icon: Building2, permission: 'manage_hr', active: route().current('hr.departments.*') },
                { name: 'Appreciation', href: route('hr.appreciations.index'), icon: Award, permission: 'manage_hr', active: route().current('hr.appreciations.*') },
                { name: 'Performance', href: route('hr.performance.index'), icon: BarChart3, permission: 'manage_hr', active: route().current('hr.performance.*') },
            ]
        },
        {
            name: 'Finance',
            href: '#',
            icon: DollarSign,
            active: route().current('finance.*'),
            permission: 'manage_finance',
            children: [
                { name: 'Proposal', href: '#', icon: FileText, permission: 'manage_finance', active: false },
                { name: 'Estimates', href: '#', icon: Calculator, permission: 'manage_finance', active: false },
                { name: 'Invoices', href: '#', icon: Receipt, permission: 'manage_finance', active: false },
                { name: 'Payments', href: '#', icon: CreditCard, permission: 'manage_finance', active: false },
                { name: 'Credit Note', href: '#', icon: FileMinus, permission: 'manage_finance', active: false },
                { name: 'Expenses', href: '#', icon: TrendingDown, permission: 'manage_finance', active: false },
                { name: 'Bank Account', href: '#', icon: Landmark, permission: 'manage_finance', active: false },
            ]
        },

    ].filter(item => !item.permission || can(item.permission));

    // Secondary sidebar filter for children
    const activeModule = navigation.find(n => n.active);
    const filteredChildren = activeModule?.children?.filter(child => !child.permission || can(child.permission));

    const breadcrumbs = [
        { name: user.clinic?.name || 'Clinic', href: '#' },
        { name: route().current('dashboard') ? 'Home' : 'Workspace', href: '#' }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
            {/* Primary Sidebar Rail (Desktop) */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 w-20 flex-col items-center py-6 z-[60] bg-white border-r border-slate-100/60 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.03)]">
                {/* Logo Area */}
                <div className="mb-8 w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                    <ApplicationLogo className="w-6 h-6 fill-white" />
                </div>

                {/* Orange Plus Button */}
                <button className="mb-10 w-11 h-11 bg-[#FF5C00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50 hover:scale-110 active:scale-95 transition-all group ring-4 ring-orange-50">
                    <Plus className="w-5 h-5 text-white stroke-[3.5] group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Icons Rail */}
                <nav className="flex-1 flex flex-col gap-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "p-3 rounded-xl transition-all relative group",
                                item.active
                                    ? "text-indigo-600 bg-indigo-50/50"
                                    : "text-slate-300 hover:text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", item.active && "stroke-[2.5]")} />
                            {/* Tooltip */}
                            {!item.active && (
                                <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-xl">
                                    {item.name}
                                </div>
                            )}
                            {item.active && (
                                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-l-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Icons */}
                <div className="mt-auto flex flex-col gap-5 pb-2">
                    {/* Settings now managed as a top-level module */}
                    <Link href={route('logout')} method="post" as="button" className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group relative">
                        <LogOut className="w-5 h-5" />
                        <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-xl">Logout</div>
                    </Link>
                </div>
            </aside>

            {/* Secondary Sidebar (Module Sub-menu) */}
            {filteredChildren && filteredChildren.length > 0 && (
                <aside className="hidden lg:flex fixed inset-y-0 left-20 w-64 flex-col py-8 z-50 bg-[#F8FAFC] border-r border-slate-100/60 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.02)] animate-in slide-in-from-left-4 duration-500">
                    <div className="px-8 mb-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Module</h3>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeModule?.name}</p>
                    </div>

                    <div className="px-4 space-y-1.5">
                        {filteredChildren.map((child) => (
                            <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                                    child.active
                                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100/50"
                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/80"
                                )}
                            >
                                <child.icon className="w-4 h-4" />
                                {child.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto px-8">
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase mb-2">Support</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed mb-4">Need help with this module?</p>
                            <button className="w-full py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">Docs</button>
                        </div>
                    </div>
                </aside>
            )}

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300">
                    <div className="absolute inset-y-0 left-0 w-72 bg-white p-8 animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-12">
                            <ApplicationLogo className="w-10 h-10" />
                            <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <nav className="space-y-4">
                            {navigation.map(item => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
                                        item.active ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" /> {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Wrapper */}
            <div className={cn(
                "flex-1 lg:ml-20 flex flex-col min-w-0 min-h-screen transition-all duration-500",
                navigation.find(n => n.active && n.children) && "lg:ml-[21rem]"
            )}>
                {/* Global Topbar */}
                <header className="h-16 shrink-0 flex items-center justify-between px-10 relative z-40 bg-[#F8FAFC]/80 backdrop-blur-xl border-b border-slate-100/50">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 mr-2"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <nav className="flex items-center gap-2.5">
                            <Link href="#" className="text-xs font-black text-slate-900 uppercase tracking-tighter hover:text-[#FF5C00] transition-colors">
                                {breadcrumbs[0].name}
                            </Link>
                            <div className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                {breadcrumbs[1].name}
                            </span>
                        </nav>
                    </div>

                    {/* Highly Professional Search Pill - Center */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-md">
                        <div className="relative w-full group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-900 transition-all duration-300" />
                            <input
                                type="text"
                                placeholder='Search leads, campaigns...'
                                className="w-full bg-slate-100/50 border-transparent rounded-2xl py-2.5 pl-12 pr-16 text-xs font-semibold placeholder:text-slate-400 transition-all duration-500 focus:bg-white focus:ring-4 focus:ring-slate-100/50 focus:border-slate-200 focus:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60 group-focus-within:opacity-100 transition-all duration-300">
                                <div className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-400 shadow-sm">
                                    <Command className="w-2.5 h-2.5" />
                                </div>
                                <div className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-400 shadow-sm">
                                    K
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile & Notifications - Professional Grouping */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-2xl border border-slate-100/20">
                            <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#FF5C00] rounded-full border-2 border-white" />
                            </button>
                            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-6 w-[1.5px] bg-slate-200/60 mx-1" />

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="group flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-300">
                                    <div className="h-9 w-9 bg-slate-900 rounded-[0.8rem] flex items-center justify-center text-white font-black text-[10px] uppercase shadow-lg group-hover:scale-105 transition-transform">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start translate-y-[-1px]">
                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{user.name.split(' ')[0]}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin</p>
                                        </div>
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="py-2 bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 w-52 mt-3 ring-1 ring-slate-900/5">
                                <div className="px-5 py-4 border-b border-slate-50 mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Account</p>
                                    <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-3 text-xs font-black text-slate-600 uppercase tracking-widest px-5 py-3.5 hover:bg-slate-50 transition-colors">
                                    <User className="w-4 h-4 text-slate-400" /> My Profile
                                </Dropdown.Link>
                                <div className="h-[1px] bg-slate-50 mx-2 my-1" />
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 text-xs font-black text-[#FF5C00] uppercase tracking-widest px-5 py-3.5 hover:bg-orange-50 w-full text-left transition-colors">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-10 pb-20 scroll-smooth">
                    {header && (
                        <div className="pt-8 pb-10">
                            {header}
                        </div>
                    )}
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {children}
                    </div>

                    {/* Floating Help / Support */}
                    <div className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-50">
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-2xl shadow-slate-200 invisible opacity-0 translate-y-2 translate-x-1 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Need some help?</p>
                            <Link href="#" className="text-xs font-black text-indigo-600 underline">Drop us a word</Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
