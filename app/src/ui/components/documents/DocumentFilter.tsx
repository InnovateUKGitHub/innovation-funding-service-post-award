import { useCallback } from "react";

import { noop } from "@ui/helpers/noop";
import { TypedForm } from "@ui/components/form";

// Note: TypedForm enforces an object shaped payload, so this can't a single primitive string
interface DocumentFilterState {
  filteredText: string;
}

export interface DocumentFilterProps {
  value: string;
  name?: string;
  qa: string;
  onSearch: (filteredText: string) => void;
  placeholder?: string;
}

export function DocumentFilter({ value, name, qa, placeholder = "Search documents", onSearch }: DocumentFilterProps) {
  const handleOnSearch = useCallback((newState: DocumentFilterState): void => onSearch(newState.filteredText), [
    onSearch,
  ]);

  const formData: DocumentFilterState = { filteredText: value };
  const FilterForm = TypedForm<typeof formData>();

  return (
    <FilterForm.Form qa={qa} data={formData} onSubmit={noop} onChange={handleOnSearch}>
      <FilterForm.Search
        name={name || "filter-item"}
        labelHidden
        autoComplete="off"
        placeholder={placeholder}
        value={x => x.filteredText}
        // Note: SearchInput will always return a string, form controls always return TValue | null poor generic defaults :(
        update={(x, v) => (x.filteredText = v!)}
      />
    </FilterForm.Form>
  );
}
