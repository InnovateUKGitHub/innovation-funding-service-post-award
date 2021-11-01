import { useCallback, useMemo } from "react";

import { CompanyDto, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import * as ACC from "@ui/components";

interface CompaniesHouseResultsProps {
  selectedRegistrationNumber: string | undefined;
  options: CompanyDto[];
  onSelect: (option: CompanyDto) => void;
}

export function CompaniesHouseResults({ selectedRegistrationNumber, options, onSelect }: CompaniesHouseResultsProps) {
  const { getContent } = useContent();

  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

  const handleSelection = (companyId: string | undefined, results: CompanyDto[]): void => {
    if (!companyId) return;

    const newSelectedCompany = results.find(x => x.registrationNumber === companyId);

    if (newSelectedCompany) onSelect(newSelectedCompany);
  };

  const compayOptions: ACC.SelectOption[] = useMemo(() => {
    return options.map(x => ({
      id: x.registrationNumber,
      value: (
        <>
          <ACC.Renderers.SimpleString className="govuk-!-margin-bottom-0">{x.title}</ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString className="govuk-!-margin-bottom-0">
            {x.registrationNumber}
          </ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString className="govuk-!-margin-bottom-0">{x.addressFull}</ACC.Renderers.SimpleString>
        </>
      ),
    }));
  }, [options]);

  const getSelectedOption: ACC.SelectOption | undefined = selectedRegistrationNumber
    ? compayOptions.find(x => x.id === selectedRegistrationNumber)
    : undefined;

  return (
    <Form.Fieldset qa="searchResults" heading={getContent(x => x.pcrAddPartnerCompanyHouse.searchResultsHeading)}>
      <Form.Radio
        name="searchResults"
        inline={false}
        options={compayOptions}
        value={useCallback(() => getSelectedOption, [getSelectedOption])}
        update={(_, selectedOpt) => handleSelection(selectedOpt?.id, options)}
      />
    </Form.Fieldset>
  );
}