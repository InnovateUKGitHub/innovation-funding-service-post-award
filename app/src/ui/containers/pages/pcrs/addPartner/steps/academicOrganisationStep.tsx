import { useState } from "react";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { PcrPage } from "../../pcrPage";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useLinks } from "../../utils/useNextLink";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { SearchInput } from "@ui/components/bjss/inputs/searchInput";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  academicOrganisationErrorMap,
  AcademicOrganisationSchema,
  academicOrganisationSchema,
} from "../addPartner.zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useJesSearchQuery } from "./jesSearch.logic";
import { useContent } from "@ui/hooks/content.hook";

export const AcademicOrganisationStep = () => {
  const { getContent } = useContent();
  const { markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } = usePcrWorkflowContext();

  const link = useLinks();
  const { isServer } = useMounted();

  const { handleSubmit, register, formState, trigger, setValue } = useForm<AcademicOrganisationSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      button_submit: "submit",
      organisationName: "",
    },
    resolver: zodResolver(academicOrganisationSchema, {
      errorMap: academicOrganisationErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

  const registerButton = createRegisterButton(setValue, "button_submit");

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const { isLoading, jesAccounts } = useJesSearchQuery(searchInputValue);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <Form onSubmit={handleSubmit(data => onSave({ data, context: link(data) }))}>
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
            <Button data-qa="button-search-jes-organisations" name="jesOrganisationSearch">
              {getContent(x => x.pcrAddPartnerLabels.searchButton)}
            </Button>
          )}

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
                {getContent(x => x.pcrItem.returnToSummaryButton)}
              </Button>
            </Fieldset>
          </Section>
        </Form>
      </Section>
    </PcrPage>
  );
};
