import { useIsClient } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { useCallback, useState } from "react";
import { DocumentsBase } from "./documents.interface";

export function useDocumentSearch(disableSearch: boolean, originalDocuments: DocumentsBase["documents"]) {
  const [filterValue, setFilter] = useState<string>("");
  const { features } = useStores().config.getConfig();
  const isJsEnabled = useIsClient();

  const enableFilter = isJsEnabled && !disableSearch;

  const setFilterText = useCallback(
    (valueToUpdate: string) => {
      if (!enableFilter) return;

      setFilter(valueToUpdate);
    },
    [enableFilter],
  );

  const getDocsValue = useCallback(() => {
    if (!enableFilter || !filterValue.length) return originalDocuments;

    return originalDocuments.filter(document => document.fileName.toLowerCase().includes(filterValue.toLowerCase()));
  }, [enableFilter, filterValue, originalDocuments]);

  const documents = getDocsValue();

  const minDocsForSearch = originalDocuments.length >= features.searchDocsMinThreshold;
  const hasDocuments = documents.length > 0;

  const isSearchable = isJsEnabled && minDocsForSearch;

  return {
    isSearchable,
    hasDocuments,
    documents,
    setFilterText,
  };
}
