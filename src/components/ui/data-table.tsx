"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Presentational primitives                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Horizontal scroll container. On narrow viewports the table scrolls rather
 * than reflowing, which keeps column relationships intact.
 */
export function Table({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"table"> & { containerClassName?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto scrollbar-thin", containerClassName)}>
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:border-line", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({
  className,
  interactive = false,
  selected = false,
  ...props
}: React.ComponentProps<"tr"> & { interactive?: boolean; selected?: boolean }) {
  return (
    <tr
      data-selected={selected || undefined}
      className={cn(
        "border-b border-line-subtle transition-colors last:border-0",
        interactive && "cursor-pointer hover:bg-surface-hover",
        selected && "bg-accent-muted hover:bg-accent-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  align = "left",
  ...props
}: React.ComponentProps<"th"> & { align?: "left" | "right" | "center" }) {
  return (
    <th
      scope="col"
      className={cn(
        "h-9 whitespace-nowrap bg-surface px-3 text-2xs font-medium uppercase tracking-wide text-fg-muted",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  align = "left",
  ...props
}: React.ComponentProps<"td"> & { align?: "left" | "right" | "center" }) {
  return (
    <td
      className={cn(
        "h-11 px-3 align-middle text-fg-secondary",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Generic data table                                                         */
/* -------------------------------------------------------------------------- */

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  /** Enables sorting for this column. */
  sortValue?: (row: T) => string | number;
  width?: string;
  /** Hides the column below the given breakpoint. */
  hideBelow?: "sm" | "md" | "lg" | "xl" | "2xl";
  headerClassName?: string;
  cellClassName?: string;
}

type SortDirection = "asc" | "desc";

const HIDE_BELOW_CLASSES = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
  "2xl": "hidden 2xl:table-cell",
} as const;

export interface DataTableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  getRowId: (row: T) => string;
  /** Shows skeleton rows instead of data. */
  isLoading?: boolean;
  skeletonRows?: number;
  /** Rendered inside the table body when `rows` is empty. */
  emptyState: React.ReactNode;
  onRowClick?: (row: T) => void;
  selectedRowId?: string;
  initialSort?: { columnId: string; direction: SortDirection };
  /** Minimum table width before the container starts scrolling. */
  minWidth?: string;
  className?: string;
  rowClassName?: (row: T) => string | undefined;
  /** Rows after this index are visually de-emphasised (pagination preview). */
  dimAfter?: number;
}

function compare(
  a: string | number,
  b: string | number,
): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "en", { numeric: true });
}

/**
 * Sortable, loading-aware table.
 *
 * Sorting is client-side over the already-loaded rows, which is correct for
 * Phase 1's mocked lists; Phase 2 can drive it from the server by passing a
 * controlled sort instead.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  skeletonRows = 6,
  emptyState,
  onRowClick,
  selectedRowId,
  initialSort,
  minWidth = "48rem",
  className,
  rowClassName,
  dimAfter,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ columnId: string; direction: SortDirection } | null>(
    initialSort ?? null,
  );

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((candidate) => candidate.id === sort.columnId);
    if (!column?.sortValue) return rows;

    const factor = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort(
      (a, b) => factor * compare(column.sortValue!(a), column.sortValue!(b)),
    );
  }, [columns, rows, sort]);

  function toggleSort(column: Column<T>) {
    if (!column.sortValue) return;
    setSort((current) => {
      if (current?.columnId !== column.id) {
        return { columnId: column.id, direction: "desc" };
      }
      return {
        columnId: column.id,
        direction: current.direction === "desc" ? "asc" : "desc",
      };
    });
  }

  return (
    <Table containerClassName={className} style={{ minWidth }}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => {
            const sortable = Boolean(column.sortValue);
            const active = sort?.columnId === column.id;

            return (
              <TableHead
                key={column.id}
                align={column.align}
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  // `group` lets the sort affordance stay hidden until the
                  // header is hovered, keeping the header row quiet.
                  sortable && "group",
                  column.hideBelow && HIDE_BELOW_CLASSES[column.hideBelow],
                  column.headerClassName,
                )}
                aria-sort={
                  active ? (sort?.direction === "asc" ? "ascending" : "descending") : undefined
                }
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-xs transition-colors hover:text-fg focus-ring",
                      column.align === "right" && "flex-row-reverse",
                      active && "text-fg",
                    )}
                  >
                    {column.header}
                    {active ? (
                      sort?.direction === "asc" ? (
                        <ChevronUp className="size-3" aria-hidden />
                      ) : (
                        <ChevronDown className="size-3" aria-hidden />
                      )
                    ) : (
                      <ChevronsUpDown
                        className="size-3 opacity-0 transition-opacity group-hover:opacity-60 group-focus-within:opacity-60"
                        aria-hidden
                      />
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  className={cn(column.hideBelow && HIDE_BELOW_CLASSES[column.hideBelow])}
                >
                  <Skeleton className="h-3.5" style={{ width: `${45 + ((rowIndex * 13) % 45)}%` }} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : sortedRows.length === 0 ? (
          emptyState
        ) : (
          sortedRows.map((row, index) => {
            const id = getRowId(row);
            return (
              <TableRow
                key={id}
                interactive={Boolean(onRowClick)}
                selected={selectedRowId === id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(dimAfter !== undefined && index >= dimAfter && "opacity-50", rowClassName?.(row))}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className={cn(
                      column.hideBelow && HIDE_BELOW_CLASSES[column.hideBelow],
                      column.cellClassName,
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
