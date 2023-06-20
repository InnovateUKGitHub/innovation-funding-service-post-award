import { useCallback, useMemo } from "react";
import { useContent } from "@ui/hooks/content.hook";
import { CompanyDto } from "@framework/dtos/companyDto";
import { FormBuilder, SelectOption } from "@ui/components/form";
import { SimpleString } from "@ui/components/renderers/simpleString";

interface CompaniesHouseResultsProps {
  selectedRegistrationNumber: string | undefined;
  options: CompanyDto[];
  onSelect: (option: CompanyDto) => void;
  Form: FormBuilder<null>;
}

export const CompaniesHouseResults = ({
  selectedRegistrationNumber,
  options,
  onSelect,
  Form,
}: CompaniesHouseResultsProps) => {
  const { getContent } = useContent();

  const handleSelection = (companyId: string | undefined, results: CompanyDto[]): void => {
    if (!companyId) return;

    const newSelectedCompany = results.find(x => x.registrationNumber === companyId);

    if (newSelectedCompany) onSelect(newSelectedCompany);
  };

  const companyOptions: SelectOption[] = useMemo(() => {
    return options.map(x => ({
      id: x.registrationNumber,
      value: (
        <>
          <SimpleString className="govuk-!-margin-bottom-0">{x.title}</SimpleString>

          <SimpleString className="govuk-!-margin-bottom-0">{x.registrationNumber}</SimpleString>

          <SimpleString className="govuk-!-margin-bottom-0">{x.addressFull}</SimpleString>
        </>
      ),
    }));
  }, [options]);

  const getSelectedOption: SelectOption | undefined = selectedRegistrationNumber
    ? companyOptions.find(x => x.id === selectedRegistrationNumber)
    : undefined;

  return (
    <Form.Fieldset qa="searchResults" heading={getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearchResults)}>
      <Form.Radio
        name="searchResults"
        inline={false}
        options={companyOptions}
        value={useCallback(() => getSelectedOption, [getSelectedOption])}
        update={(_, selectedOpt) => handleSelection(selectedOpt?.id, options)}
      />
    </Form.Fieldset>
  );
};
