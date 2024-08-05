import { useState } from "react";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useMounted } from "@ui/context/Mounted";
import { PcrPage } from "../../pcrPage";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useLinks } from "../../utils/useNextLink";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { SearchInput } from "@ui/components/bjss/inputs/searchInput";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useJesSearchQuery } from "./jesSearch.logic";
import { useContent } from "@ui/hooks/content.hook";
import { AcademicOrganisationSchema, getAcademicOrganisationSchema } from "./schemas/academicOrganisation.zod";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { noop } from "lodash";
import { usePreloadedDataContext } from "@ui/context/preloaded-data";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const AcademicOrganisationStep = () => {
  const preloadedData = usePreloadedDataContext();

  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();
  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();
  const { isServer } = useMounted();

  const { handleSubmit, register, setError, formState, trigger, setValue, watch } = useForm<AcademicOrganisationSchema>(
    {
      defaultValues: {
        form: FormTypes.PcrAddPartnerAcademicOrganisationStep,
        markedAsComplete: String(markedAsCompleteHasBeenChecked),
        button_submit: "submit",
        organisationName: pcrItem.organisationName ?? undefined,
      },
      resolver: zodResolver(getAcademicOrganisationSchema(markedAsCompleteHasBeenChecked), {
        errorMap: addPartnerErrorMap,
      }),
    },
  );

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const { isLoading, jesAccounts: queriedJesAccounts } = useJesSearchQuery(searchInputValue);

  const jesAccounts = queriedJesAccounts || preloadedData?.data?.jesSearchResults || [];

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <form onSubmit={noop} method="POST">
          <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerAcademicOrganisationSearchStep} />

          <Fieldset>
            <Legend>{getContent(x => x.pcrAddPartnerLabels.jesOrganisationSectionTitle)}</Legend>
            <Section>
              <ValidationMessage
                messageType="info"
                qa="jes-organisation-info"
                message={x => x.pcrAddPartnerLabels.jesOrganisationInfo}
              />
            </Section>
            <FormGroup>
              <Hint id="hint-for-searchJesOrganisations">
                {getContent(x => x.pcrAddPartnerLabels.jesOrganisationSectionSubtitle)}
              </Hint>
              <SearchInput
                disabled={isFetching}
                ariaDescribedBy="hint-for-searchJesOrganisations"
                name="searchJesOrganisations"
                value={searchInputValue}
                onChange={searchValue => setSearchInputValue(searchValue?.trim() || "")}
                maxLength={160}
              />
            </FormGroup>
          </Fieldset>

          {isServer && (
            <Button type="submit" name="jesOrganisationSearch" data-qa="button-search-jes-organisations">
              {getContent(x => x.pcrAddPartnerLabels.searchButton)}
            </Button>
          )}
        </form>

        <Form onSubmit={handleSubmit(data => onSave({ data, context: link(data) }))}>
          <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerAcademicOrganisationStep} />
          <input type="hidden" {...register("markedAsComplete")} value={String(markedAsCompleteHasBeenChecked)} />

          <Section>
            {isLoading ? (
              <SimpleString>{getContent(x => x.pages.pcrAddPartnerAcademicOrganisation.loading)}</SimpleString>
            ) : jesAccounts?.length ? (
              <>
                <H2>{getContent(x => x.pages.pcrAddPartnerAcademicOrganisation.jesSearchResults)}</H2>
                <Fieldset data-qa="jesSearchResults">
                  <RadioList name="organisationName" register={register}>
                    {jesAccounts.map(option => (
                      <Radio key={option.id} id={option.id} value={option.companyName} label={option.companyName} />
                    ))}
                  </RadioList>
                </Fieldset>
              </>
            ) : (
              <P data-qa="no-jes-results-found">
                {getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultNotShowing)}
              </P>
            )}
          </Section>
          <Section>
            <Fieldset>
              <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
                {getContent(x => x.pcrItem.submitButton)}
              </Button>
              <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
                {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
              </Button>
            </Fieldset>
          </Section>
        </Form>
      </Section>
    </PcrPage>
  );
};
