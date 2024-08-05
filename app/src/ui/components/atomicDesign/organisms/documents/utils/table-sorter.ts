import { stringComparator, numberComparator, dateComparator } from "@framework/util/comparator";
import { Logger } from "@shared/developmentLogger";
import { useMounted } from "@ui/context/Mounted";
import { useMemo, useState } from "react";

export type SortOptions = "none" | "ascending" | "descending";

interface ColumnSortState<T> {
  sortKey?: T;
  sortDirection: SortOptions;
}

const logger = new Logger("Table Sort");

// Note: Get current state and return next state
const sortOptionsWorkflow: Record<SortOptions, SortOptions> = {
  none: "ascending",
  ascending: "descending",
  descending: "ascending",
};

/**
 * sorts rows according to the sort key and sort direction
 */
function sortRowsFromKey<T>({ sortKey, sortDirection }: ColumnSortState<keyof T | null | undefined>, rows: T[]) {
  if (!sortKey || sortDirection === "none") return rows;

  return rows.sort((unCheckedA, uncheckedB) => {
    const sortValues = [unCheckedA[sortKey], uncheckedB[sortKey]];

    if (sortDirection === "descending") sortValues.reverse();

    const [firstItem, secondItem] = sortValues;

    if (typeof firstItem === "string" && typeof secondItem === "string") {
      return stringComparator(firstItem, secondItem);
    }

    if (typeof firstItem === "number" && typeof secondItem === "number") {
      return numberComparator(firstItem, secondItem);
    }

    if (firstItem instanceof Date && secondItem instanceof Date) {
      return dateComparator(firstItem, secondItem);
    }

    logger.warn(`Table Sort value ${String(sortKey)} has not matched against any comparator`);
    return 0;
  });
}

/**
 * ### useTableSorter
 *
 * hook returns sorted table configuration
 */
export function useTableSorter<T>({
  sortKeys,
  tableRows,
  initialSortKey,
  initialSortState = "none",
}: {
  sortKeys: (keyof T | null | undefined)[];
  tableRows: T[];
  initialSortKey?: keyof T;
  initialSortState?: SortOptions;
}) {
  const { isServer } = useMounted();
  const [sortColumn, setSortColumn] = useState<ColumnSortState<keyof T | null | undefined>>({
    sortKey: initialSortKey,
    sortDirection: initialSortState,
  });

  const sortedRows = useMemo(() => sortRowsFromKey(sortColumn, tableRows), [sortColumn, tableRows]);

  const handleSort = (clickedIndex: number): void => {
    const sortKey = sortKeys[clickedIndex];

    if (isServer || !sortKey) return;

    setSortColumn(currentState => {
      const isDifferentSortKey = currentState.sortKey !== sortKey;
      const currentDirection = isDifferentSortKey ? initialSortState : sortColumn.sortDirection;
      const sortDirection = sortOptionsWorkflow[currentDirection];

      return {
        sortKey,
        sortDirection,
      };
    });
  };

  const getColumnOption = (columnIndex: number): SortOptions | undefined => {
    const sortKey = sortKeys[columnIndex];

    if (isServer || !sortColumn || !sortKey) return undefined;

    return sortColumn.sortKey === sortKey ? sortColumn.sortDirection : "none";
  };

  return {
    sortedRows,
    handleSort,
    getColumnOption,
  };
}
