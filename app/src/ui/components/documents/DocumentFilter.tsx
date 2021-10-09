import { useState } from "react";

import { noop } from "@ui/helpers/noop";
import { TypedForm } from "@ui/components/form";

// Note: TypedForm enforces an object shaped payload, so this can't a single primitive string
interface DocumentFilterState {
  filteredText: string;
}

export interface DocumentFilterProps {
  name?: string;
  qa: string;
  onSearch: (filteredText: string) => void;
  intitialFilter?: string;
  placeholder?: string;
}

export function DocumentFilter({
  name,
  qa,
  placeholder = "Search documents",
  intitialFilter,
  onSearch,
}: DocumentFilterProps) {
  const [filteredText, setFilteredText] = useState<string>(intitialFilter || "");

  const handleOnSearch = (newState: DocumentFilterState): void => {
    const newFilteredValue = newState.filteredText.trim();

    setFilteredText(newFilteredValue);
    onSearch(newFilteredValue);
  };

  const FilterForm = TypedForm<DocumentFilterState>();

  return (
    <FilterForm.Form qa={qa} data={{ filteredText }} onSubmit={noop} onChange={handleOnSearch}>
      <FilterForm.Search
        name={name || "filter-item"}
        labelHidden
        placeholder={placeholder}
        value={x => x.filteredText}
        // Note: SearchInput will always return a string, form controls always return TValue | null poor generic defaults :(
        update={(x, v) => (x.filteredText = v!)}
      />
    </FilterForm.Form>
  );
}
