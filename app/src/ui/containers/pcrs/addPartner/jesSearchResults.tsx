import { AccountDto } from "@framework/dtos/accountDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { createTypedForm, SelectOption } from "@ui/components/form";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { H2 } from "@ui/components/typography/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";

interface JesSearchResultsProps {
  selected: AccountDto | undefined;
  jesAccounts: AccountDto[];
  update: (id: string | undefined, jesAccounts: AccountDto[]) => void;
  Form: ReturnType<typeof createTypedForm<PCRItemForPartnerAdditionDto>>;
}

export const JesSearchResults = ({ selected, jesAccounts, update, Form }: JesSearchResultsProps) => {
  const { getContent } = useContent();

  const jesAccountsOptions: SelectOption[] = jesAccounts.map(x => ({
    id: x.id,
    value: <SimpleString className="govuk-!-margin-bottom-0">{x.companyName}</SimpleString>,
  }));
  const value = jesAccountsOptions.find(y => y.id === selected?.id);

  return (
    <>
      <H2>{getContent(x => x.pages.pcrAddPartnerAcademicOrganisation.jesSearchResults)}</H2>
      <Form.Fieldset qa="jesSearchResults">
        <Form.Radio
          name="searchResults"
          inline={false}
          options={jesAccountsOptions}
          value={() => value}
          update={(_, val) => update(val?.id, jesAccounts)}
        />
      </Form.Fieldset>
    </>
  );
};
