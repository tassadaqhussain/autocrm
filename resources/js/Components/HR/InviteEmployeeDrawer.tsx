import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Send, Info, Link2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'email' | 'link';
type LinkRestriction = 'any' | 'domain';

export default function InviteEmployeeDrawer({ isOpen, onClose }: Props) {
    const [tab, setTab] = useState<Tab>('email');
    const [linkRestriction, setLinkRestriction] = useState<LinkRestriction>('any');
    const [domain, setDomain] = useState('');
    const [creatingLink, setCreatingLink] = useState(false);
    const [createdLinkUrl, setCreatedLinkUrl] = useState<string | null>(null);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCreatedLinkUrl(null);
        }
    }, [isOpen]);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        message: '',
    });

    const handleSendInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.employees.invite'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleCreateLink = async () => {
        setCreatingLink(true);
        setCreatedLinkUrl(null);
        try {
            const { data } = await axios.post<{ url: string }>(route('hr.employees.invite-link'), {
                domain: linkRestriction === 'domain' && domain.trim() ? domain.trim() : null,
            });
            await navigator.clipboard.writeText(data.url);
            setCreatedLinkUrl(data.url);
        } catch (err) {
            console.error(err);
        } finally {
            setCreatingLink(false);
        }
    };

    const handleCopyCreatedLink = async () => {
        if (!createdLinkUrl) return;
        await navigator.clipboard.writeText(createdLinkUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Invite employee"
            description="Send an invitation to join your organization."
            maxWidth="max-w-md"
            footer={
                tab === 'email' ? (
                    <div className="flex justify-end w-full">
                        <button
                            type="button"
                            onClick={handleSendInvite}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60"
                        >
                            <Send className="w-4 h-4" /> Send Invite
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end w-full">
                        <button
                            type="button"
                            onClick={handleCreateLink}
                            disabled={creatingLink}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60"
                        >
                            <Link2 className="w-4 h-4" /> Create Link
                        </button>
                    </div>
                )
            }
        >
            <div className="space-y-5">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        type="button"
                        onClick={() => setTab('email')}
                        className={cn(
                            'pb-3 px-1 text-[13px] font-medium transition-colors border-b-2 -mb-px',
                            tab === 'email'
                                ? 'border-[#4358E4] text-[#4358E4]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        )}
                    >
                        Invite by email
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('link')}
                        className={cn(
                            'pb-3 px-1 ml-6 text-[13px] font-medium transition-colors border-b-2 -mb-px',
                            tab === 'link'
                                ? 'border-[#4358E4] text-[#4358E4]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        )}
                    >
                        Invite by link
                    </button>
                </div>

                {tab === 'email' ? (
                    <>
                        {/* Info banner - email tab only */}
                        <div className="flex gap-3 p-3 rounded-lg bg-slate-100 border border-slate-200">
                            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                            <p className="text-[13px] text-slate-600 leading-snug">
                                Employees will receive an email to log in and update their profile through the self-service portal.
                            </p>
                        </div>

                        <form onSubmit={handleSendInvite} className="space-y-5">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-700 font-medium">
                                    Email <span className="text-rose-500">*</span>
                                </InputLabel>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="e.g. johndoe@example.com"
                                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-700 font-medium">Message</InputLabel>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Add a message (optional)"
                                    rows={3}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[80px]"
                                />
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <p className="text-[13px] text-slate-600">
                            Create an invite link for members to join.
                        </p>

                        {/* Radio: Allow any email */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="link_restriction"
                                checked={linkRestriction === 'any'}
                                onChange={() => setLinkRestriction('any')}
                                className="w-4 h-4 text-[#4358E4] border-slate-300 focus:ring-[#4358E4]"
                            />
                            <span className="text-[13px] font-medium text-slate-800">Allow any email address</span>
                        </label>

                        {/* Radio: Only allow domain */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="link_restriction"
                                    checked={linkRestriction === 'domain'}
                                    onChange={() => setLinkRestriction('domain')}
                                    className="w-4 h-4 text-[#4358E4] border-slate-300 focus:ring-[#4358E4]"
                                />
                                <span className="text-[13px] font-medium text-slate-800">Only allow email addresses with domain</span>
                            </label>
                            {linkRestriction === 'domain' && (
                                <div className="flex pl-7">
                                    <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                        <span className="inline-flex items-center h-11 px-3 bg-slate-100 border-r border-slate-200 text-slate-500 text-[13px]">
                                            @
                                        </span>
                                        <input
                                            type="text"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            placeholder="example.com"
                                            className="flex-1 min-w-0 h-11 px-3 bg-white text-[13px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-0"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Created link (shown after Create Link) */}
                        {createdLinkUrl && (
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                                <p className="text-[12px] font-medium text-slate-600">Invite link created (copied to clipboard)</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={createdLinkUrl}
                                        className="flex-1 min-w-0 h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyCreatedLink}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-medium rounded-lg transition-colors shrink-0"
                                    >
                                        {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                        {linkCopied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Drawer>
    );
}
