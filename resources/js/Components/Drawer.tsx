import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
}

export default function Drawer({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    maxWidth = 'max-w-[90vw]', // Human-style: extremely wide but not quite 100%
}: DrawerProps) {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-400"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-out duration-[600ms] cubic-bezier(0.16, 1, 0.3, 1)"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in duration-[400ms]"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className={cn("pointer-events-auto w-screen shadow-2xl shadow-slate-900/5", maxWidth)}>
                                    <div className="flex h-full flex-col bg-white">
                                        {/* Premium Compact Header */}
                                        <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                                            <div>
                                                <Dialog.Title className="text-xl font-bold text-slate-900 tracking-tight">
                                                    {title}
                                                </Dialog.Title>
                                                {description && (
                                                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest leading-none">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="p-2 rounded-lg text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                                onClick={onClose}
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Body - Clean & Spacious */}
                                        <div className="relative flex-1 p-10 overflow-y-auto overflow-x-hidden scroll-smooth">
                                            <div className="max-w-4xl mx-auto">
                                                {children}
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        {footer && (
                                            <div className="shrink-0 border-t border-slate-50 px-10 py-6 bg-slate-50/20">
                                                <div className="max-w-4xl mx-auto">
                                                    {footer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
