import { useState, useCallback } from "react";

import { Pending } from "@shared/pending";
import { CompanyDto, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useStores } from "@ui/redux";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { EditorStatus } from "@ui/constants/enums";
import { useContent } from "@ui/hooks";
import { useMounted } from "@ui/features";
import { noop } from "@ui/helpers/noop";
import * as ACC from "@ui/components";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";

import { CompaniesHouseResults } from "./CompaniesHouseResults";

type CompaniesHouseStepProps = PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

export const CompaniesHouseStep = ({ pcrItem: originalPayload, ...props }: CompaniesHouseStepProps) => {
  const { companies } = useStores();
  const { getContent } = useContent();
  const { isServer } = useMounted();

  const [searchInputValue, setSearchInputValue] = useState<string>();
  const [formData, setFormData] = useState<PCRItemForPartnerAdditionDto>(originalPayload);

  const Form = ACC.TypedForm<typeof formData>();

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
    <ACC.Section qa="company-house" title={getContent(x => x.pages.pcrAddPartnerCompanyHouse.sectionTitle)}>
      <Form.Form
        qa="addPartnerForm"
        data={originalPayload}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={noop}
      >
        <Form.Fieldset
          qa="search-companies-house"
          heading={getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearch)}
        >
          <Form.Search
            labelHidden
            autoComplete="off"
            name="searchCompaniesHouse"
            hint={getContent(x => x.pages.pcrAddPartnerCompanyHouse.hint)}
            value={() => searchInputValue}
            update={(_, searchValue) => setSearchInputValue(searchValue?.trim() || "")}
          />

          {isServer && (
            <Form.Button styling="Primary" name="companiesHouseSearch">
              {getContent(x => x.pages.pcrAddPartnerCompanyHouse.buttonSearch)}
            </Form.Button>
          )}
        </Form.Fieldset>
      </Form.Form>

      <Form.Form
        qa="company-details-form"
        data={formData}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={props.onChange}
      >
        <ACC.Loader
          pending={getCompanies()}
          renderLoading={() => (
            <ACC.Renderers.SimpleString>
              {getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultsLoading)}
            </ACC.Renderers.SimpleString>
          )}
          render={(companyResults, isLoading) => {
            const hasCompaniesResults = companyResults.length > 0;
            const hasEmptySearchValue = typeof searchInputValue === "string" && searchInputValue.length === 0;
            const isLoadingCompanies = hasEmptySearchValue && isLoading;
            const hasNoCompanies = !isLoading && (hasEmptySearchValue || !hasCompaniesResults);

            if (isLoadingCompanies) {
              return (
                <ACC.Renderers.SimpleString>
                  {getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultsLoading)}
                </ACC.Renderers.SimpleString>
              );
            }

            return (
              <>
                {hasCompaniesResults && (
                  <CompaniesHouseResults
                    options={companyResults}
                    selectedRegistrationNumber={formData.registrationNumber || undefined}
                    onSelect={handleCompanySelection}
                  />
                )}

                {hasNoCompanies && (
                  <ACC.Renderers.SimpleString>
                    {getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultNotShowing)}
                  </ACC.Renderers.SimpleString>
                )}
              </>
            );
          }}
        />

        <Form.Fieldset
          qa="companies-house-form"
          heading={getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingForm)}
        >
          <Form.String
            name="organisationName"
            label={getContent(x => x.pcrAddPartnerLabels.organisationNameHeading)}
            value={dto => dto.organisationName}
            update={(dto, val) => (dto.organisationName = val)}
            validation={props.validator.companyHouseOrganisationName}
          />

          <Form.String
            name="registrationNumber"
            label={getContent(x => x.pcrAddPartnerLabels.registrationNumberHeading)}
            value={dto => dto.registrationNumber}
            update={(dto, val) => (dto.registrationNumber = val)}
            validation={props.validator.registrationNumber}
          />

          <Form.String
            name="registeredAddress"
            label={getContent(x => x.pcrAddPartnerLabels.registeredAddressHeading)}
            value={dto => dto.registeredAddress}
            update={(dto, val) => (dto.registeredAddress = val)}
            validation={props.validator.registeredAddress}
          />
        </Form.Fieldset>

        <Form.Fieldset qa="save-and-continue-companies-house">
          <Form.Submit>{getContent(x => x.pcrItem.submitButton)}</Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            {getContent(x => x.pcrItem.returnToSummaryButton)}
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
