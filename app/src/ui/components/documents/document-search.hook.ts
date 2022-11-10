import { useCallback, useEffect, useState } from "react";
import Fuse from "fuse.js";

import { useMounted } from "@ui/features";
import { useStores } from "@ui/redux";
import { formatDate, getFileSize } from "@framework/util";
import { DateFormat } from "@framework/constants/enums";

import { DocumentSummaryDto } from "@framework/dtos";

/**
 * Perform a fuzzy search on a list of items.
 *
 * @param value The user's input search value
 * @param items The list of items to search through
 * @param keysToSearch Keys in `item` that can be searched through
 * @returns A list of all items that match the user's input value.
 */
const fuzzySearch = <T>(value: string, items: T[], keysToSearch: string[]) => {
  const valueToSearch = value.trim();

  // TODO: reconfirm this value after migrating to Node16
  const scoreThreshold = 0.19;

  const fusedQuery = new Fuse(items, {
    threshold: scoreThreshold,
    includeScore: true,
    ignoreLocation: true,
    keys: keysToSearch,
  });

  const initialResults = fusedQuery.search(valueToSearch);

  // Note: Remove results outside of scoreThreshold - enforces stricter approach
  return initialResults.filter(x => Number(x.score?.toFixed(2)) <= scoreThreshold);
};

const filterItems = <T extends DocumentSummaryDto>(valueToSearch: string, items: T[]) => {
  if (!valueToSearch.trim().length) return items;

  const preParsedItems = items.map(x => {
    const shortDate = formatDate(x.dateCreated, DateFormat.SHORT_DATE);
    const fullDate = formatDate(x.dateCreated, DateFormat.FULL_DATE);
    // Note: No date support for 'fuse.js'
    const dateCreated = `${shortDate} ${fullDate}`;

    // Note: Parse file size as value being search is a number not parsed string - this allows both to be indexed
    const fileSize = `${x.fileSize} ${getFileSize(x.fileSize)}`;

    return { ...x, dateCreated, fileSize };
  });

  const fusedQuery = fuzzySearch(valueToSearch, preParsedItems, ["fileName", "uploadedBy", "dateCreated", "fileSize"]);
  const filteredItemsIds: string[] = fusedQuery.map(x => x.item.id);

  return items.filter(x => filteredItemsIds.includes(x.id));
};

/**
 * hook to handle document search functionality
 */
export function useDocumentSearch<T extends DocumentSummaryDto>(disableSearch: boolean, originalDocuments: T[]) {
  const { features } = useStores().config.getConfig();
  const { isClient } = useMounted();

  const [filterValue, setFilterValue] = useState<string>("");
  const [documents, setDocuments] = useState<T[]>(originalDocuments);

  const minDocsForSearch = originalDocuments.length >= features.searchDocsMinThreshold;
  const enableFilter = isClient && !disableSearch;

  const hasDocuments = documents.length > 0;

  const displaySearch = !disableSearch && isClient && minDocsForSearch;

  useEffect(() => {
    if (!enableFilter) return;

    const updatedDocuments = filterItems(filterValue, originalDocuments);
    setDocuments(updatedDocuments);
  }, [enableFilter, filterValue, originalDocuments]);

  const onSearch = useCallback(
    (valueToUpdate: string) => {
      if (enableFilter) {
        setFilterValue(valueToUpdate);
      }
    },
    [enableFilter],
  );

  return {
    documents,
    displaySearch,
    hasDocuments,
    filterConfig: {
      value: filterValue,
      onSearch,
    },
  };
}
