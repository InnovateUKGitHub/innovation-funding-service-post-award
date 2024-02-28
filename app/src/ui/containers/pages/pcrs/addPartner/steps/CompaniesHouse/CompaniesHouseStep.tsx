import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { createRegisterButton } from "@framework/util/registerButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
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
import { useDefaultCompaniesHouseResult } from "./CompaniesHouseStep.logic";

export const CompaniesHouseStep = () => {
  const { getContent } = useContent();
  const {
    projectId,
    pcrId,
    itemId,
    fetchKey,
    markedAsCompleteHasBeenChecked,
    onSave,
    isFetching,
    search: defaultSearchQuery,
  } = usePcrWorkflowContext();
  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(defaultSearchQuery ?? "");
  const defaultCompaniesHouseResult = useDefaultCompaniesHouseResult();
  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();

  const { handleSubmit, register, formState, trigger, setValue, watch, reset, setError } = useForm<
    z.output<PcrAddPartnerCompaniesHouseStepSchemaType>
  >({
    resolver: zodResolver(getPcrAddPartnerCompaniesHouseStepSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });
  const validationErrors = useZodErrors(setError, formState.errors);
  const defaultUserInput = useServerInput<z.input<PcrAddPartnerCompaniesHouseStepSchemaType>>();
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);
  const registerButton = createRegisterButton(setValue, "form");
  const disabled = isFetching;

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section data-qa="company-house">
        <H2>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.sectionTitle)}</H2>

        <CompaniesHouseSearchBox setSearchQuery={setSearchQuery} />

        <CompaniesHouseSearch searchQuery={searchQuery} setCompanyInfo={reset} />

        <Form
          onSubmit={handleSubmit(data =>
            onSave({
              data,
              context: {
                link: data.form === FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue ? nextLink : summaryLink,
              },
            }),
          )}
        >
          <input type="hidden" value={projectId} {...register("projectId")} />
          <input type="hidden" value={pcrId} {...register("pcrId")} />
          <input type="hidden" value={itemId} {...register("pcrItemId")} />
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingForm)}</Legend>

            <FormGroup hasError={!!validationErrors?.organisationName}>
              <Label htmlFor="organisationName">{getContent(x => x.pcrAddPartnerLabels.organisationNameHeading)}</Label>
              <ValidationError error={validationErrors?.organisationName as RhfError} />
              <TextInput
                defaultValue={
                  defaultUserInput?.organisationName ??
                  defaultCompaniesHouseResult?.title ??
                  pcrItem?.organisationName ??
                  ""
                }
                hasError={!!validationErrors?.organisationName}
                id="organisationName"
                // inputWidth="one-third"
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
                  defaultUserInput?.registrationNumber ??
                  defaultCompaniesHouseResult?.registrationNumber ??
                  pcrItem.registrationNumber ??
                  ""
                }
                hasError={!!validationErrors?.registrationNumber}
                id="registrationNumber"
                // inputWidth="one-quarter"
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
                  defaultUserInput?.registeredAddress ??
                  defaultCompaniesHouseResult?.addressFull ??
                  pcrItem?.registeredAddress ??
                  ""
                }
                hasError={!!validationErrors?.registeredAddress}
                id="registeredAddress"
                // inputWidth="full"
                {...register("registeredAddress")}
                disabled={disabled}
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
