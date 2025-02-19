import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { useMounted } from "@ui/context/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  academicOrganisationSearchSchema,
  AcademicOrganisationSearchSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/academicOrganisation.zod";
import classNames from "classnames";
import { ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SearchResult } from "./Search.logic";
import { useExistingSearchParams } from "./useExistingSearchParams";

interface InitialSearchProps {
  query: string | null;
  setQuery: (query: string) => void;
  disabled?: boolean;
  maxLength: number | undefined;
  searchResults: SearchResult[];
  hint: ReactNode;
}

const InitialSearch = ({ query, setQuery, disabled, maxLength, searchResults, hint }: InitialSearchProps) => {
  const { getContent } = useContent();
  const params = useExistingSearchParams();
  const { isServer } = useMounted();
  const [hasFocus, setHasFocus] = useState(false);
  const timeoutId = useRef<number>(0);

  const { register, handleSubmit } = useForm<z.output<AcademicOrganisationSearchSchemaType>>({
    defaultValues: {
      search: query ?? undefined,
    },
    resolver: zodResolver(academicOrganisationSearchSchema, {
      errorMap: addPartnerErrorMap,
    }),
  });

  const onFocus = () => {
    window.clearTimeout(timeoutId.current);
    setHasFocus(true);
  };
  const onBlur = () => {
    timeoutId.current = window.setTimeout(() => {
      setHasFocus(false);
    }, 50);
  };

  return (
    <form
      method="GET"
      onSubmit={handleSubmit(data => {
        setQuery(data.search);
      })}
    >
      {isServer && <input type="hidden" name="step" value={params.get("step") ?? ""} />}
      <Fieldset>
        <FormGroup>
          <Label htmlFor="search">{hint}</Label>
          <TextInput
            {...register("search")}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {searchResults.length > 0 && (
            <ul
              aria-labelledby="autocomplete-default"
              id="autocomplete-default__listbox"
              role="listbox"
              className={classNames("autocomplete__menu", "autocomplete__menu--inline", {
                ["autocomplete__menu--hidden"]: !hasFocus,
              })}
            >
              {searchResults.map((v, i, a) => (
                <li
                  key={v.id}
                  aria-selected="false"
                  className="autocomplete__option"
                  id="autocomplete-default__option--6"
                  role="option"
                  tabIndex={-1}
                  aria-posinset={i + 1}
                  aria-setsize={a.length}
                >
                  <span>{v.label}</span>
                  {typeof v.hint === "string" && v.hint.length > 0 && (
                    <>
                      <br />
                      <span>{v.hint}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </FormGroup>
      </Fieldset>
      <Fieldset>
        <SubmitButton name="">{getContent(x => x.components.search.button)}</SubmitButton>
      </Fieldset>
    </form>
  );
};

export { InitialSearch };
