import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { ArrowUpDown } from 'lucide-react';
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

const thClass = 'px-4 py-2.5 text-[13px] font-medium text-slate-600 border-b border-slate-200 bg-white align-middle whitespace-nowrap';
const tdClass = 'px-4 py-2.5 text-[13px] text-slate-600 border-b border-slate-100 align-middle';

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
        <div className={cn('bg-white border border-slate-200 rounded flex flex-col', className)}>
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id}>
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
                                            <div className={cn("flex items-center gap-1.5", align === 'right' && 'justify-end', align === 'center' && 'justify-center')}>
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                                {header.id !== 'actions' && header.id !== 'checkbox' && (
                                                    <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1" />
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (renderActions ? 1 : 0)}
                                    className="px-4 py-8 text-center text-sm text-slate-600 border-b border-slate-100"
                                >
                                    {emptyMessage === 'No architectural records found.' ? 'No data available in table' : emptyMessage}
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

            {/* Pagination & Footer */}
            <div className="px-4 py-3 bg-white flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-600 border-t border-slate-200">
                <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select className="border border-slate-300 rounded px-2 py-1 text-sm focus:ring-0 focus:border-indigo-500 bg-white">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span>entries</span>
                </div>

                <div className="flex items-center gap-4">
                    <span>
                        Showing {pagination ? (pagination.from ?? 0) : 0} to {pagination ? (pagination.to ?? 0) : 0} of {pagination ? pagination.total : 0} entries
                    </span>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
