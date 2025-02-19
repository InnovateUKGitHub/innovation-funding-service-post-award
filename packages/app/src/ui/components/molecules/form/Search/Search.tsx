import { FieldValues } from "react-hook-form";
import { InitialSearch } from "./InitialSearch";
import { SearchProps } from "./Search.logic";
import { SelectSearchResult } from "./SelectSearchResult";

const Search = <TFieldValues extends FieldValues = FieldValues>({
  name,
  register,
  query,
  setQuery,
  maxLength,
  disabled,
  defaultResult,
  searchResults,
  hint,
}: SearchProps<TFieldValues>) => {
  if ((defaultResult && query === null) || searchResults.length > 0) {
    return (
      <SelectSearchResult<TFieldValues>
        name={name}
        register={register}
        query={query}
        defaultResult={defaultResult}
        searchResults={searchResults}
      />
    );
  }

  return (
    <InitialSearch
      query={query}
      setQuery={setQuery}
      searchResults={searchResults}
      maxLength={maxLength}
      disabled={disabled}
      hint={hint}
    />
  );
};

export { Search };
