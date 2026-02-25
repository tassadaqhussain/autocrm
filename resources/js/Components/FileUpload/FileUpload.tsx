import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { FileText, Download, Trash2, X, Check, Plus } from 'lucide-react';

export interface UploadableFile {
    id: number;
    name: string;
    path: string;
    size: number;
    type: string;
}

interface FileUploadProps {
    uploadRoute: string;
    uploadRouteParams: Record<string, number>;
    deleteRoute: string;
    getDeleteRouteParams: (file: UploadableFile) => Record<string, number>;
    files: UploadableFile[];
    title?: string;
    emptyMessage?: string;
    className?: string;
    /** Compact layout for use in tables (smaller empty state, no big grid) */
    compact?: boolean;
}

const STORAGE_PREFIX = '/storage/';

export default function FileUpload({
    uploadRoute,
    uploadRouteParams,
    deleteRoute,
    getDeleteRouteParams,
    files,
    title = 'Upload File',
    emptyMessage = 'No file uploaded.',
    className = '',
    compact = false,
}: FileUploadProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<UploadableFile | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        if (!acceptedFiles.length) return;
        setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const removeSelected = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        router.post(route(uploadRoute, uploadRouteParams), { files: selectedFiles }, {
            forceFormData: true,
            onSuccess: () => {
                setSelectedFiles([]);
                setIsModalOpen(false);
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteConfirm) return;
        router.delete(route(deleteRoute, getDeleteRouteParams(deleteConfirm)), {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const isImageType = (type: string) =>
        type && /jpg|jpeg|png|gif|webp/i.test(type);

    return (
        <div className={className}>
            {!compact && (
                <div className="flex justify-between items-center mb-4">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:translate-x-1 transition-transform"
                    >
                        <Plus className="w-5 h-5" /> {title}
                    </button>
                </div>
            )}

            {files.length > 0 ? (
                <div className={compact ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className={compact ? 'flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-slate-50 border border-slate-100' : 'p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 group hover:bg-white hover:shadow-md transition-all'}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {isImageType(file.type) ? (
                                    <div className={compact ? 'w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0' : 'w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0'}>
                                        <img
                                            src={`${STORAGE_PREFIX}${file.path}`}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className={compact ? 'w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0' : 'w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0'}>
                                        <FileText className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <span className={compact ? 'text-xs font-semibold text-slate-700 truncate max-w-[100px]' : 'text-[13px] font-bold text-slate-700 truncate max-w-[140px]'}>
                                        {file.name}
                                    </span>
                                    {!compact && (
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <a
                                    href={`${STORAGE_PREFIX}${file.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(file)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={compact ? 'flex items-center gap-2' : 'flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100'}>
                    {compact ? (
                        <>
                            <span className="text-xs text-slate-400">{emptyMessage}</span>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="text-indigo-600 font-bold text-xs hover:underline"
                            >
                                Attach
                            </button>
                        </>
                    ) : (
                        <>
                            <FileText className="w-10 h-10 text-slate-200 mb-4" />
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">- {emptyMessage} -</span>
                        </>
                    )}
                </div>
            )}

            {/* Upload modal */}
            <Modal
                show={isModalOpen}
                onClose={() => {
                    if (uploading) return;
                    setIsModalOpen(false);
                    setSelectedFiles([]);
                }}
                maxWidth="2xl"
            >
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                if (uploading) return;
                                setIsModalOpen(false);
                                setSelectedFiles([]);
                            }}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                isDragActive
                                    ? 'border-indigo-400 bg-indigo-50/60'
                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <FileText className="w-8 h-8 text-indigo-400 mb-3" />
                            <p className="text-sm font-semibold text-slate-700">
                                {isDragActive ? 'Drop files here...' : 'Click or drag files to upload'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Multiple files. Max 10 MB each.</p>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected files</h4>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {selectedFiles.map((file, index) => {
                                        const isImage = file.type.startsWith('image/');
                                        const previewUrl = isImage ? URL.createObjectURL(file) : null;
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-100"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {isImage && previewUrl ? (
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                                            <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-semibold text-slate-700 truncate max-w-[220px]">{file.name}</span>
                                                        <span className="text-[11px] text-slate-400 font-bold">{(file.size / 1024).toFixed(1)} KB</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelected(index)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-6 bg-white border-t border-slate-50 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (uploading) return;
                                setIsModalOpen(false);
                                setSelectedFiles([]);
                            }}
                            className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading || selectedFiles.length === 0}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {uploading ? (
                                <>
                                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 stroke-[3px]" /> Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal show={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} maxWidth="sm">
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-8 py-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                <Trash2 className="w-6 h-6 text-rose-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Delete file?</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Are you sure you want to delete <span className="font-semibold text-slate-800">&quot;{deleteConfirm?.name}&quot;</span>? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
