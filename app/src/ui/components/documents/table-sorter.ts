import { useState, useMemo } from "react";
import { useMounted } from "@ui/features";
import { dateComparator, numberComparator, stringComparator } from "@framework/util";
import { devLogger } from "@ui/helpers/dev-logger";

export type SortOptions = "none" | "ascending" | "descending";

// Note: Get current state and return next state
const sortOptionsWorkflow: Record<SortOptions, SortOptions> = {
  none: "ascending",
  ascending: "descending",
  descending: "ascending",
};

function sortRowsFromKey({ sortKey, sortDirection }: ColumnSortState, rows: any[]) {
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

    devLogger("Table Sort value ${sortKey} has not matched against any comparator");
    return 0;
  });
}

export type TableSortKey = string | null;
interface ColumnSortState {
  sortKey?: string;
  sortDirection: SortOptions;
}

const initialSortState: SortOptions = "none";

export function useTableSorter(sortKeys: TableSortKey[], tableRows: any[]) {
  const { isServer } = useMounted();
  const [sortColumn, setSortColumn] = useState<ColumnSortState>({ sortDirection: initialSortState });

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
