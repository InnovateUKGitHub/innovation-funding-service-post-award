import { useContent } from "@ui/hooks/content.hook";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { PcrPage } from "../../pcrPage";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { createRegisterButton } from "@framework/util/registerButton";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { SearchInput } from "@ui/components/bjss/inputs/searchInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { useUpdateCompaniesHouseResults } from "./useFetchCompanies";
import { CompaniesHouseSchema, getCompaniesHouseSchema } from "./schemas/companyHouse.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

export const CompaniesHouseStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue, reset, getValues, watch } =
    useForm<CompaniesHouseSchema>({
      defaultValues: {
        button_submit: "submit",
        organisationName: pcrItem.organisationName ?? "",
        registeredAddress: pcrItem.registeredAddress ?? "",
        registrationNumber: pcrItem.registrationNumber ?? "",
        searchResults: "",
      },
      resolver: zodResolver(getCompaniesHouseSchema(markedAsCompleteHasBeenChecked), {
        errorMap: addPartnerErrorMap,
      }),
    });
  const validationErrors = useRhfErrors(formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const { isFetchingCompanies, updateCompaniesHouseResults, companyResults } = useUpdateCompaniesHouseResults();

  const registerButton = createRegisterButton(setValue, "button_submit");
  const { isServer } = useMounted();

  const disabled = isFetching || isFetchingCompanies;

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section data-qa="company-house">
        <H2>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.sectionTitle)}</H2>
        <Form onSubmit={handleSubmit(data => onSave({ data, context: link(data) }))}>
          <Fieldset>
            <FormGroup>
              <Label bold htmlFor="searchCompaniesHouse">
                {getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearch)}
              </Label>
              <Hint id="hint-for-searchCompaniesHouse">
                {getContent(x => x.pcrAddPartnerLabels.jesOrganisationSectionSubtitle)}
              </Hint>
              <SearchInput
                disabled={isFetching}
                ariaDescribedBy="hint-for-searchCompaniesHouse"
                autoComplete="off"
                name="searchCompaniesHouse"
                onChange={searchValue => updateCompaniesHouseResults(searchValue?.trim() || "")}
                maxLength={160}
              />
            </FormGroup>
          </Fieldset>

          {isServer && (
            <Button name="companiesHouseSearch">
              {getContent(x => x.pages.pcrAddPartnerCompanyHouse.buttonSearch)}
            </Button>
          )}

          {isFetchingCompanies ? (
            <P>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultsLoading)}</P>
          ) : companyResults?.length > 0 ? (
            <Fieldset>
              <Legend>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearchResults)}</Legend>
              <FormGroup>
                <RadioList name="searchResults" register={register}>
                  {companyResults.map(x => (
                    <Radio
                      key={x.registrationNumber}
                      id={x.registrationNumber}
                      value={x.registrationNumber}
                      label={x.label}
                      disabled={disabled}
                      onClick={event => {
                        const registrationNumber = (event.target as HTMLInputElement).value;
                        const matchingCompany = companyResults.find(x => x.registrationNumber === registrationNumber);
                        if (!matchingCompany) throw new Error("Cannot find matching company");
                        reset({
                          button_submit: "submit",
                          registeredAddress: matchingCompany.addressFull,
                          organisationName: matchingCompany.title,
                          registrationNumber,
                        });
                      }}
                      defaultChecked={x.registrationNumber === getValues("registrationNumber")}
                    />
                  ))}
                </RadioList>
              </FormGroup>
            </Fieldset>
          ) : (
            <P>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultNotShowing)}</P>
          )}

          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingForm)}</Legend>

            <FormGroup hasError={!!validationErrors?.organisationName}>
              <Label htmlFor="organisationName">{getContent(x => x.pcrAddPartnerLabels.organisationNameHeading)}</Label>
              <ValidationError error={validationErrors?.organisationName as RhfError} />
              <TextInput
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
                hasError={!!validationErrors?.registeredAddress}
                id="registeredAddress"
                {...register("registeredAddress")}
                disabled={disabled}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={disabled}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>
            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={disabled}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
