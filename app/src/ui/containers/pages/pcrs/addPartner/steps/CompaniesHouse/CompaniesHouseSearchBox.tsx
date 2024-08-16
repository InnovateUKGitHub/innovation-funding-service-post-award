import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { useMounted } from "@ui/context/Mounted";
import { useDebounce } from "@ui/components/atomicDesign/input-utils";
import { noop } from "@ui/helpers/noop";
import { useContent } from "@ui/hooks/content.hook";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../../../pcrItemWorkflow";
import {
  PcrAddPartnerCompaniesHouseStepSearchSchemaType,
  pcrAddPartnerCompaniesHouseStepErrorMap,
  pcrAddPartnerCompaniesHouseStepSearchMaxLength,
  pcrAddPartnerCompaniesHouseStepSearchSchema,
} from "../schemas/companiesHouse.zod";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useValidateInitialSearchQuery } from "./CompaniesHouseStep.logic";

interface CompaniesHouseSearchProps {
  setSearchQuery?: (searchQuery?: string) => void;
}

const CompaniesHouseSearchBox = ({ setSearchQuery }: CompaniesHouseSearchProps) => {
  const { isServer } = useMounted();
  const { getContent } = useContent();
  const { step, search: initialSearchQuery } = usePcrWorkflowContext();
  const { handleSubmit, register, watch, formState, setError, trigger } = useForm<
    z.output<PcrAddPartnerCompaniesHouseStepSearchSchemaType>
  >({
    resolver: zodResolver(pcrAddPartnerCompaniesHouseStepSearchSchema, {
      errorMap: pcrAddPartnerCompaniesHouseStepErrorMap,
    }),
    mode: "all",
  });

  const searchErrors = useValidateInitialSearchQuery({ step, search: String(initialSearchQuery) });
  const validationErrors = useZodErrors(setError, formState.errors, searchErrors);

  const searchQuery = watch("search");
  const setDebouncedSearchQuery = useDebounce(setSearchQuery);

  useEffect(() => {
    setDebouncedSearchQuery?.(searchQuery);
  }, [setDebouncedSearchQuery, searchQuery]);

  // Trigger initial validation to ensure transition
  // from JS disabled to enabled does not flash
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <form onSubmit={handleSubmit(noop)}>
      {/* Re-fill the step number into the URL get params */}
      <input type="hidden" value={step} {...register("step")}></input>
      <Fieldset>
        <FormGroup hasError={!!validationErrors?.search}>
          <h2 className="govuk-label-wrapper">
            <Label htmlFor="search" bold>
              {getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearch)}
            </Label>
          </h2>
          {/* <Hint id="hint-for-search">{getContent(x => x.pages.pcrAddPartnerCompanyHouse.hint)}</Hint> */}
          <ValidationError error={validationErrors?.search as RhfError} />
          <TextInput
            hasError={!!validationErrors?.search}
            defaultValue={initialSearchQuery}
            // Fully stop at 200 characters.
            maxLength={pcrAddPartnerCompaniesHouseStepSearchMaxLength + 1}
            {...register("search")}
          />
        </FormGroup>
      </Fieldset>
      {isServer && (
        <Button type="submit" styling="Secondary">
          {getContent(x => x.pages.pcrAddPartnerCompanyHouse.buttonSearch)}
        </Button>
      )}
    </form>
  );
};

export { CompaniesHouseSearchBox };
