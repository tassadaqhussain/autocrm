import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X, HelpCircle } from 'lucide-react';
import { Transition } from '@headlessui/react';

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
}

export default function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    label,
    required = false,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const safeOptions = Array.isArray(options) ? options : [];
    const filteredOptions = safeOptions.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const toggleOption = (optionValue: string) => {
        const safeValue = Array.isArray(value) ? value : [];
        const newValue = safeValue.includes(optionValue)
            ? safeValue.filter(v => v !== optionValue)
            : [...safeValue, optionValue];
        onChange(newValue);
    };

    const handleSelectAll = () => {
        onChange(safeOptions.map(o => o.value));
    };

    const handleDeselectAll = () => {
        onChange([]);
    };

    const selectedLabels = (Array.isArray(value) ? value : [])
        .map(v => safeOptions.find(o => o.value === v)?.label)
        .filter(Boolean)
        .join(', ');

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            {label && (
                <label className="block text-[13px] text-slate-600 font-medium flex items-center gap-1">
                    {label} {required && <span className="text-rose-500">*</span>}
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 flex items-center justify-between text-[13px] hover:border-slate-300 transition-all shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
                <span className={`block truncate ${!selectedLabels ? 'text-slate-400' : 'text-slate-700'}`}>
                    {selectedLabels || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div className="absolute z-[100] mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[280px]">
                    {/* Search Area */}
                    <div className="p-3 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-100 rounded-lg text-[13px] focus:ring-0 focus:border-blue-400 transition-all placeholder-slate-400"
                                placeholder="Search here..."
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex border-b border-slate-50 bg-slate-50/50">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="flex-1 py-2 text-[12px] font-bold text-slate-500 hover:text-blue-600 hover:bg-white transition-all border-r border-slate-100"
                        >
                            Select All
                        </button>
                        <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="flex-1 py-2 text-[12px] font-bold text-slate-500 hover:text-rose-600 hover:bg-white transition-all"
                        >
                            Deselect All
                        </button>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleOption(option.value)}
                                    className="w-full px-4 py-2.5 flex items-center justify-between text-[13px] text-slate-600 hover:bg-slate-50 transition-colors group"
                                >
                                    <span className={`block truncate ${Array.isArray(value) && value.includes(option.value) ? 'text-blue-600 font-semibold' : ''}`}>
                                        {option.label}
                                    </span>
                                    {Array.isArray(value) && value.includes(option.value) && (
                                        <Check className="w-4 h-4 text-blue-600 font-bold" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400 text-xs">
                                No results found for "{search}"
                            </div>
                        )}
                    </div>
                </div>
            </Transition>
        </div>
    );
}
