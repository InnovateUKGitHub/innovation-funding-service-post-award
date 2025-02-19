import { ReactNode } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface SearchProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  disabled?: boolean;
  maxLength: number | undefined;
  query: string | null;
  setQuery: (query: string) => void;
  defaultResult: SearchResult | null;
  searchResults: SearchResult[];
  hint: ReactNode;
}

interface SearchResult {
  id: string;
  value: string;
  label: string;
  hint?: string;
}

export { SearchProps, SearchResult };
