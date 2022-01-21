import { useCallback, useEffect, useState } from "react";
// Note: This is not latest as there is bug with the latest version https://github.com/krisk/Fuse/issues/469#issuecomment-862956883
import Fuse from "fuse.js";

import { useMounted } from "@ui/features";
import { useStores } from "@ui/redux";
import { formatDate, getFileSize } from "@framework/util";
import { DateFormat } from "@framework/constants/enums";

import { DocumentsBase } from "./documents.interface";

const fuzzySearch = <T>(value: string, items: T[], keysToSearch: string[]) => {
  const valueToSearch = value.trim();
  const scoreThreshold = 0.6;

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

const filterItems = (valueToSearch: string, items: DocumentsBase["documents"]) => {
  if (!valueToSearch.trim().length) return items;

  const preParsedItems = items.map(x => {
    const shortDate = formatDate(x.dateCreated, DateFormat.SHORT_DATE)!;
    const fullDate = formatDate(x.dateCreated, DateFormat.FULL_DATE)!;
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

export function useDocumentSearch(disableSearch: boolean, originalDocuments: DocumentsBase["documents"]) {
  const { features } = useStores().config.getConfig();
  const { isClient } = useMounted();

  const [filterValue, setFilterValue] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentsBase["documents"]>(originalDocuments);

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
