import Drawer from '@/Components/Drawer';
import { Pencil } from 'lucide-react';
import type { ClientDrawerClient } from './ClientDrawerTypes';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    client: ClientDrawerClient | null;
    onEdit: (client: ClientDrawerClient) => void;
}

function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="text-[13px] font-medium text-slate-900">{value ?? '—'}</p>
        </div>
    );
}

function YesNo({ value }: { value?: boolean }) {
    return <span className="text-[13px] font-medium text-slate-900">{value ? 'Yes' : 'No'}</span>;
}

export default function ShowClientDrawer({ isOpen, onClose, client, onEdit }: Props) {
    if (!client) return null;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={client.name}
            description="Client details"
            maxWidth="max-w-[80vw]"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-transparent text-slate-400 text-[13px] font-semibold hover:text-slate-600 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(client)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Pencil className="w-4 h-4" /> Edit
                    </button>
                </div>
            }
        >
            <div className="space-y-12">
                {/* Account Details */}
                <div className="space-y-8">
                    <div className="pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
                        <p className="text-[12px] text-slate-400 mt-1">Basic profile information.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <Field label="Salutation" value={client.salutation ?? undefined} />
                        <Field label="Client Name" value={client.name} />
                        <Field label="Email" value={client.email} />
                        <Field label="Mobile" value={client.mobile} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <Field label="Country" value={client.country ?? undefined} />
                        <Field label="Gender" value={client.gender ?? undefined} />
                        <Field label="Language" value={client.language ?? undefined} />
                        <Field label="Client Category" value={client.client_category ?? undefined} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Sub Category</p>
                            <p className="text-[13px] font-medium text-slate-900">{client.client_sub_category ?? '—'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Login Allowed?</p>
                            <YesNo value={client.login_allowed} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email notifications?</p>
                            <YesNo value={client.email_notifications} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {client.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Company Details */}
                <div className="pt-4 pb-16 border-t border-slate-100">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-900">Company Details</h3>
                        <p className="text-[11px] text-slate-400">Company information for billing and documents.</p>
                    </div>
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Field label="Company Name" value={client.company_name ?? undefined} />
                            <Field label="Official Website" value={client.official_website ?? undefined} />
                            <Field label="Tax Name" value={client.tax_name ?? undefined} />
                            <Field label="GST/VAT Number" value={client.gst_vat_number ?? undefined} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Field label="Office Phone" value={client.office_phone ?? undefined} />
                            <Field label="City" value={client.city ?? undefined} />
                            <Field label="State" value={client.state ?? undefined} />
                            <Field label="Postal code" value={client.postal_code ?? undefined} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Company Address</p>
                                <p className="text-[13px] font-medium text-slate-900 whitespace-pre-wrap">{client.company_address ?? '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Shipping Address</p>
                                <p className="text-[13px] font-medium text-slate-900 whitespace-pre-wrap">{client.shipping_address ?? '—'}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Note</p>
                            <p className="text-[13px] font-medium text-slate-900 whitespace-pre-wrap">{client.note ?? '—'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
