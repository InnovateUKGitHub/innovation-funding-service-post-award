import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { createRegisterButton } from "@framework/util/registerButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";
import { Section } from "@ui/components/atoms/Section/Section";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../../../pcrItemWorkflow";
import { PcrPage } from "../../../pcrPage";
import { useNextLink, useSummaryLink } from "../../../utils/useNextLink";
import { useAddPartnerWorkflowQuery } from "../../addPartner.logic";
import { addPartnerErrorMap } from "../../addPartnerSummary.zod";
import {
  PcrAddPartnerCompaniesHouseStepSchemaType,
  getPcrAddPartnerCompaniesHouseStepSchema,
} from "../schemas/companiesHouse.zod";
import { CompaniesHouseSearch } from "./CompaniesHouseSearch";
import { CompaniesHouseSearchBox } from "./CompaniesHouseSearchBox";
import { useDefaultCompaniesHouseResult, useOnUpdateCompanyDetails } from "./CompaniesHouseStep.logic";

export const CompaniesHouseStep = () => {
  const { getContent } = useContent();
  const {
    projectId,
    itemId,
    fetchKey,
    markedAsCompleteHasBeenChecked,
    search: defaultSearchQuery,
  } = usePcrWorkflowContext();
  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(String(defaultSearchQuery ?? ""));
  const defaultCompaniesHouseResult = useDefaultCompaniesHouseResult();
  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();

  const { handleSubmit, register, formState, trigger, setValue, watch, reset, setError } = useForm<
    z.output<PcrAddPartnerCompaniesHouseStepSchemaType>
  >({
    defaultValues: {
      form: FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit,
      organisationName: pcrItem?.organisationName ?? "",
      registrationNumber: pcrItem?.registrationNumber ?? "",
      registeredAddress: pcrItem?.registeredAddress ?? "",
    },
    resolver: zodResolver(getPcrAddPartnerCompaniesHouseStepSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });
  const validationErrors = useZodErrors(setError, formState.errors);

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);
  const registerButton = createRegisterButton(setValue, "form");

  const { onUpdate, apiError, isFetching } = useOnUpdateCompanyDetails();
  const disabled = isFetching;

  return (
    <PcrPage validationErrors={validationErrors} apiError={apiError}>
      <Section data-qa="company-house">
        <H2>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.sectionTitle)}</H2>

        <CompaniesHouseSearchBox setSearchQuery={setSearchQuery} />

        <CompaniesHouseSearch searchQuery={searchQuery} setCompanyInfo={reset} />

        <Form
          onSubmit={handleSubmit(data =>
            onUpdate({
              data,
              context: {
                link: data.form === FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue ? nextLink : summaryLink,
              },
            }),
          )}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingForm)}</Legend>

            <FormGroup hasError={!!validationErrors?.organisationName}>
              <Label htmlFor="organisationName">{getContent(x => x.pcrAddPartnerLabels.organisationNameHeading)}</Label>
              <ValidationError error={validationErrors?.organisationName as RhfError} />
              <TextInput
                defaultValue={
                  pcrItem?.organisationName ?? defaultCompaniesHouseResult?.title ?? pcrItem?.organisationName ?? ""
                }
                hasError={!!validationErrors?.organisationName}
                id="organisationName"
                {...register("organisationName")}
                disabled={disabled}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.registrationNumber}>
              <Label htmlFor="registrationNumber">
                {getContent(x => x.pcrAddPartnerLabels.registrationNumberHeading)}
              </Label>
              <ValidationError error={validationErrors?.registrationNumber as RhfError} />
              <TextInput
                defaultValue={
                  pcrItem?.registrationNumber ??
                  defaultCompaniesHouseResult?.registrationNumber ??
                  pcrItem.registrationNumber ??
                  ""
                }
                hasError={!!validationErrors?.registrationNumber}
                id="registrationNumber"
                {...register("registrationNumber")}
                disabled={disabled}
              />
            </FormGroup>

            <FormGroup hasError={!!validationErrors?.registeredAddress}>
              <Label htmlFor="registeredAddress">
                {getContent(x => x.pcrAddPartnerLabels.registeredAddressHeading)}
              </Label>
              <ValidationError error={validationErrors?.registeredAddress as RhfError} />
              <TextInput
                defaultValue={
                  pcrItem?.registeredAddress ??
                  defaultCompaniesHouseResult?.addressFull ??
                  pcrItem?.registeredAddress ??
                  ""
                }
                hasError={!!validationErrors?.registeredAddress}
                id="registeredAddress"
                {...register("registeredAddress")}
                disabled={disabled}
                maxLength={2200}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button
              type="submit"
              {...registerButton(FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue)}
              disabled={disabled}
            >
              {getContent(x => x.pcrItem.submitButton)}
            </Button>
            <Button
              type="submit"
              secondary
              {...registerButton(FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit)}
              disabled={disabled}
            >
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
