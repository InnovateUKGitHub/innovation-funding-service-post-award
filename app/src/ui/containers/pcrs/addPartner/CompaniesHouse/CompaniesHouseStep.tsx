import { useState, useCallback } from "react";
import { Pending } from "@shared/pending";
import { EditorStatus } from "@ui/constants/enums";
import { useContent } from "@ui/hooks/content.hook";
import { noop } from "@ui/helpers/noop";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { CompaniesHouseResults } from "./CompaniesHouseResults";
import { CompanyDto } from "@framework/dtos/companyDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { useMounted } from "@ui/features/has-mounted/Mounted";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Loader } from "@ui/components/loading";

type CompaniesHouseStepProps = PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

const SearchForm = createTypedForm<null>();
const CompanyForm = createTypedForm<PCRItemForPartnerAdditionDto>();

export const CompaniesHouseStep = ({ pcrItem: originalPayload, ...props }: CompaniesHouseStepProps) => {
  const { companies } = useStores();
  const { getContent } = useContent();
  const { isServer } = useMounted();

  const [searchInputValue, setSearchInputValue] = useState<string>();
  const [formData, setFormData] = useState<PCRItemForPartnerAdditionDto>(originalPayload);

  const getCompanies: () => Pending<CompanyDto[]> = useCallback(
    () => (searchInputValue?.length ? companies.getCompanies(searchInputValue, 10) : Pending.done([])),
    [companies, searchInputValue],
  );

  const handleCompanySelection = (companySelection: CompanyDto): void => {
    const payload: PCRItemForPartnerAdditionDto = {
      ...originalPayload,
      organisationName: companySelection.title,
      registrationNumber: companySelection.registrationNumber,
      registeredAddress: companySelection.addressFull || originalPayload.registeredAddress,
    };

    setFormData(payload);
    props.onChange(payload);
  };

  return (
    <Section qa="company-house" title={getContent(x => x.pages.pcrAddPartnerCompanyHouse.sectionTitle)}>
      <SearchForm.Form qa="addPartnerForm" data={null} isSaving={props.status === EditorStatus.Saving} onSubmit={noop}>
        <SearchForm.Fieldset
          qa="search-companies-house"
          heading={getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearch)}
        >
          <SearchForm.Search
            labelHidden
            autoComplete="off"
            name="searchCompaniesHouse"
            hint={getContent(x => x.pages.pcrAddPartnerCompanyHouse.hint)}
            value={() => searchInputValue}
            update={(_, searchValue) => setSearchInputValue(searchValue?.trim() || "")}
          />

          {isServer && (
            <SearchForm.Button styling="Primary" name="companiesHouseSearch">
              {getContent(x => x.pages.pcrAddPartnerCompanyHouse.buttonSearch)}
            </SearchForm.Button>
          )}
        </SearchForm.Fieldset>

        <Loader
          pending={getCompanies()}
          renderLoading={() => (
            <SimpleString>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultsLoading)}</SimpleString>
          )}
          render={(companyResults, isLoading) => {
            const hasCompaniesResults = companyResults.length > 0;
            const hasEmptySearchValue = typeof searchInputValue === "string" && searchInputValue.length === 0;
            const isLoadingCompanies = hasEmptySearchValue && isLoading;
            const hasNoCompanies = !isLoading && (hasEmptySearchValue || !hasCompaniesResults);

            if (isLoadingCompanies) {
              return <SimpleString>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultsLoading)}</SimpleString>;
            }

            return (
              <>
                {hasCompaniesResults && (
                  <CompaniesHouseResults
                    options={companyResults}
                    selectedRegistrationNumber={formData.registrationNumber || undefined}
                    onSelect={handleCompanySelection}
                    Form={SearchForm}
                  />
                )}

                {hasNoCompanies && (
                  <SimpleString>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultNotShowing)}</SimpleString>
                )}
              </>
            );
          }}
        />
      </SearchForm.Form>

      <CompanyForm.Form
        qa="company-details-form"
        data={formData}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={props.onChange}
      >
        <CompanyForm.Fieldset
          qa="companies-house-form"
          heading={getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingForm)}
        >
          <CompanyForm.String
            name="organisationName"
            label={getContent(x => x.pcrAddPartnerLabels.organisationNameHeading)}
            value={dto => dto.organisationName}
            update={(dto, val) => (dto.organisationName = val)}
            validation={props.validator.companyHouseOrganisationName}
          />

          <CompanyForm.String
            name="registrationNumber"
            label={getContent(x => x.pcrAddPartnerLabels.registrationNumberHeading)}
            value={dto => dto.registrationNumber}
            update={(dto, val) => (dto.registrationNumber = val)}
            validation={props.validator.registrationNumber}
          />

          <CompanyForm.String
            name="registeredAddress"
            label={getContent(x => x.pcrAddPartnerLabels.registeredAddressHeading)}
            value={dto => dto.registeredAddress}
            update={(dto, val) => (dto.registeredAddress = val)}
            validation={props.validator.registeredAddress}
          />
        </CompanyForm.Fieldset>

        <CompanyForm.Fieldset qa="save-and-continue-companies-house">
          <CompanyForm.Submit>{getContent(x => x.pcrItem.submitButton)}</CompanyForm.Submit>

          <CompanyForm.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            {getContent(x => x.pcrItem.returnToSummaryButton)}
          </CompanyForm.Button>
        </CompanyForm.Fieldset>
      </CompanyForm.Form>
    </Section>
  );
};
