import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  className,
  emptyMessage = 'No records found.',
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 light:bg-white light:border-slate-200 shadow-md', className)}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 light:bg-slate-100 light:border-slate-200 light:text-slate-600">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3.5 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors hover:bg-slate-800/40 text-slate-200 light:text-slate-800 light:hover:bg-slate-50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 whitespace-nowrap">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-2 py-3 text-xs text-slate-400">
      <span>
        Page <strong className="text-slate-200">{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>
      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none light:border-slate-200 light:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none light:border-slate-200 light:bg-slate-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
