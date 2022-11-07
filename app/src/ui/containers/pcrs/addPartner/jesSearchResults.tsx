import * as ACC from "@ui/components";
import { AccountDto, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { H2 } from "@ui/components";
import { useContent } from "@ui/hooks";

interface JesSearchResultsProps {
  selected: AccountDto | undefined;
  jesAccounts: AccountDto[];
  update: (id: string | undefined, jesAccounts: AccountDto[]) => void;
}

export const JesSearchResults = ({ selected, jesAccounts, update }: JesSearchResultsProps) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  const { getContent } = useContent();

  const jesAccountsOptions: ACC.SelectOption[] = jesAccounts.map(x => ({
    id: x.id,
    value: <ACC.Renderers.SimpleString className="govuk-!-margin-bottom-0">{x.companyName}</ACC.Renderers.SimpleString>,
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
