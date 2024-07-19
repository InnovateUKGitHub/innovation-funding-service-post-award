import { useCallback, useState } from "react";
import { noop } from "@ui/helpers/noop";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { SearchInput } from "@ui/components/bjss/inputs/searchInput";
import { useDidUpdate } from "@ui/hooks/generic.hook";

export interface DocumentFilterProps {
  value: string;
  name?: string;
  qa: string;
  onSearch: (filteredText: string) => void;
  placeholder?: string;
}

export const DocumentFilter = ({
  value,
  name,
  qa,
  placeholder = "Search documents",
  onSearch,
}: DocumentFilterProps) => {
  const handleOnSearch = useCallback((filterText: string): void => onSearch(filterText), [onSearch]);

  const [searchInputValue, setSearchInputValue] = useState<string>(value);

  useDidUpdate(() => {
    handleOnSearch(searchInputValue);
  }, [searchInputValue, handleOnSearch]);

  return (
    <Form data-qa={qa} onSubmit={noop}>
      <FormGroup>
        <SearchInput
          autoComplete="off"
          width="full"
          name={name || "filter-item"}
          value={searchInputValue}
          onChange={searchValue => setSearchInputValue(searchValue?.trim() || "")}
          maxLength={100}
          placeholder={placeholder}
        />
      </FormGroup>
    </Form>
  );
};
