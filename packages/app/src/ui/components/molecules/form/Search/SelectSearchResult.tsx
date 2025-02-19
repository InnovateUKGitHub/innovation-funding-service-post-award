import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { RadioDivider } from "@ui/components/atoms/form/RadioDivider/RadioDivider";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { SearchResult } from "./Search.logic";
import { useContent } from "@ui/hooks/content.hook";

interface SelectSearchResultProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  query: string | null;
  defaultResult: SearchResult | null;
  searchResults: SearchResult[];
  disabled?: boolean;
}

const SelectSearchResult = <TFieldValues extends FieldValues = FieldValues>({
  name,
  register,
  query,
  defaultResult,
  searchResults,
  disabled,
}: SelectSearchResultProps<TFieldValues>) => {
  const { getContent } = useContent();
  return (
    <Fieldset>
      <FormGroup>
        {query !== null && (
          <Hint id="hint-for-select-search-result">
            {getContent(x => x.components.search.results({ count: searchResults.length, input: query }))}
          </Hint>
        )}
        <RadioList register={register} name={name} id="select-search-result">
          {query === null && defaultResult && (
            <Radio
              defaultChecked={true}
              name={name}
              key={defaultResult.id}
              id={defaultResult.id}
              value={defaultResult.value}
              label={defaultResult.label}
              disabled={disabled}
            />
          )}
          {searchResults.map(v => (
            <Radio
              name={name}
              key={v.id}
              id={v.id}
              value={v.value}
              label={v.label}
              defaultChecked={v.id === defaultResult?.id}
              disabled={disabled}
            />
          ))}
          <RadioDivider />
          <Radio name={name} id="search" label={"Search for another Je-S organisation"} disabled={disabled} />
        </RadioList>
      </FormGroup>
    </Fieldset>
  );
};

export { SelectSearchResult };
