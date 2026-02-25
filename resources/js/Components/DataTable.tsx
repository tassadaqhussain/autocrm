import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const thClass = 'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500';
const tdClass = 'px-4 py-2.5 text-xs';

export default function DataTable<T>({
    columns,
    data,
    getRowId,
    emptyMessage = 'No records found.',
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
                      header: 'Action',
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
        <div className={cn('bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm', className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
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
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (renderActions ? 1 : 0)}
                                    className="px-4 py-10 text-center text-slate-500 text-sm"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
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
                <div className="px-4 py-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50/50">
                    <p className="text-xs text-slate-500">
                        Showing {pagination.from ?? 0}–{pagination.to ?? 0} of {pagination.total}
                    </p>
                    <div className="flex items-center gap-1">
                        {pagination.links.map((link, i) => (
                            <span key={i}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={cn(
                                            'inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded text-xs font-medium transition-colors',
                                            link.active
                                                ? 'bg-slate-800 text-white'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        )}
                                    >
                                        {link.label.replace('&laquo;', '').replace('&raquo;', '').trim() || (i === 0 ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded text-xs text-slate-400">
                                        {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
