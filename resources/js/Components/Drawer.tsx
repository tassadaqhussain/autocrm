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
                    <div className="fixed inset-0 bg-slate-900/30 transition-opacity" />
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
                                <Dialog.Panel className={cn("pointer-events-auto w-screen relative bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)]", maxWidth)}>
                                    {/* Close button - pill on dark backdrop, overlaps white panel */}
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="absolute -left-[48px] top-[17px] z-10 py-[10px] px-[18px] flex items-center justify-center rounded-l-[22px] rounded-r-none bg-[#1d82f5] text-white hover:bg-[#1669c1] active:opacity-90 transition-all duration-200 focus:outline-none shadow-md"
                                        aria-label="Close"
                                    >
                                        <X className="w-3.5 h-3.5" strokeWidth={3.5} />
                                    </button>

                                    <div className="flex h-full flex-col bg-white">
                                        {/* Compact header */}
                                        <div className="flex items-center gap-4 pl-2 pr-6 py-4 border-b border-slate-200 shrink-0">
                                            <div className="min-w-0 flex-1">
                                                <Dialog.Title className="text-lg font-semibold text-slate-900 truncate">
                                                    {title}
                                                </Dialog.Title>
                                                {description && (
                                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="relative flex-1 px-6 py-5 overflow-y-auto overflow-x-hidden scroll-smooth">
                                            <div className="max-w-4xl mx-auto">
                                                {children}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        {footer && (
                                            <div className="shrink-0 border-t border-slate-200 px-6 py-4 bg-slate-50/50">
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
