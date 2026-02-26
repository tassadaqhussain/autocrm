import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Inbox, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
}

export interface DataTableColumn<T> {
    id: string;
    header: string;
    align?: 'left' | 'right' | 'center';
    cell: (row: T) => ReactNode;
    /** Optional: for sorting/filtering; uses row[id] if not provided */
    accessorKey?: keyof T;
    headerClassName?: string;
    cellClassName?: string;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
    emptyMessage?: string;
    pagination?: PaginationMeta;
    /** Render actions for each row (e.g. View, Edit, Delete buttons). Adds an "Action" column. */
    renderActions?: (row: T) => ReactNode;
    /** Optional wrapper class for the card */
    className?: string;
}

const thClass = 'px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm';
const tdClass = 'px-6 py-5 text-[13px] font-semibold text-slate-600';

export default function DataTable<T>({
    columns,
    data,
    getRowId,
    emptyMessage = 'No architectural records found.',
    pagination,
    renderActions,
    className,
}: DataTableProps<T>) {
    const columnHelper = createColumnHelper<T>();
    const tableColumns = [
        ...columns.map((col) =>
            columnHelper.display({
                id: col.id,
                header: col.header,
                cell: ({ row }) => col.cell(row.original),
                meta: {
                    align: col.align ?? 'left',
                    headerClassName: col.headerClassName,
                    cellClassName: col.cellClassName,
                },
            })
        ),
        ...(renderActions
            ? [
                columnHelper.display({
                    id: 'actions',
                    header: 'Operations',
                    cell: ({ row }) => renderActions(row.original),
                    meta: { align: 'right' as const },
                }),
            ]
            : []),
    ];

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(getRowId(row)),
    });

    const headerGroups = table.getHeaderGroups();
    const rows = table.getRowModel().rows;

    return (
        <div className={cn('bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 relative', className)}>
            <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} className="relative">
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as { align?: 'left' | 'right' | 'center'; headerClassName?: string } | undefined;
                                    const align = meta?.align ?? 'left';
                                    return (
                                        <th
                                            key={header.id}
                                            className={cn(
                                                thClass,
                                                align === 'right' && 'text-right',
                                                align === 'center' && 'text-center',
                                                meta?.headerClassName
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="italic">{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (renderActions ? 1 : 0)}
                                    className="px-6 py-24 text-center"
                                >
                                    <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="p-5 bg-slate-50 rounded-[2rem] text-slate-300 ring-8 ring-slate-50/50">
                                            <Inbox className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-black text-slate-800 uppercase tracking-widest italic">{emptyMessage}</p>
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Try refining your selection criteria</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    className="group hover:bg-slate-50/50 transition-all duration-300 relative"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as { align?: 'left' | 'right' | 'center'; cellClassName?: string } | undefined;
                                        const align = meta?.align ?? 'left';
                                        return (
                                            <td
                                                key={cell.id}
                                                className={cn(
                                                    tdClass,
                                                    align === 'right' && 'text-right',
                                                    align === 'center' && 'text-center',
                                                    meta?.cellClassName
                                                )}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && rows.length > 0 && (
                <div className="px-10 py-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/30 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-indigo-600">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Data Perspective</p>
                            <p className="text-[13px] font-bold text-slate-900 mt-0.5">
                                Showing <span className="text-indigo-600">{pagination.from ?? 0}</span>–<span className="text-indigo-600">{pagination.to ?? 0}</span> of {pagination.total} records
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {pagination.links.map((link, i) => {
                            const isPrev = i === 0;
                            const isNext = i === pagination.links.length - 1;
                            const label = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();

                            return (
                                <span key={i}>
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            className={cn(
                                                'inline-flex items-center justify-center min-w-[44px] h-11 px-3 rounded-xl text-[12px] font-black uppercase tracking-tight transition-all duration-300 shadow-sm active:scale-90',
                                                link.active
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 border border-indigo-500'
                                                    : 'bg-white border border-slate-100 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md'
                                            )}
                                        >
                                            {label || (isPrev ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center justify-center min-w-[44px] h-11 rounded-xl text-[12px] font-black text-slate-300 border border-transparent whitespace-nowrap opacity-50">
                                            {label || (isPrev ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
