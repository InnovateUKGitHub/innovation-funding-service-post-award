import { useCallback, useEffect, useState } from "react";

import { useMounted } from "@ui/features";
import { formatDate, getFileSize } from "@framework/util";
import { DateFormat } from "@framework/constants/enums";

import { DocumentSummaryDto } from "@framework/dtos";
import { useClientOptionsQuery } from "@gql/hooks/useSiteOptionsQuery";
import { fuzzySearch } from "@framework/util/fuzzySearch";

const filterItems = <T extends Pick<DocumentSummaryDto, "id" | "dateCreated" | "fileSize">>(
  valueToSearch: string,
  items: T[],
) => {
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
export function useDocumentSearch<T extends Pick<DocumentSummaryDto, "id" | "dateCreated" | "fileSize">>(
  disableSearch: boolean,
  originalDocuments: T[],
) {
  const { data } = useClientOptionsQuery();
  const { isClient } = useMounted();

  const [filterValue, setFilterValue] = useState<string>("");
  const [documents, setDocuments] = useState<T[]>(originalDocuments);

  const minDocsForSearch = originalDocuments.length >= data.clientConfig.features.searchDocsMinThreshold;
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
