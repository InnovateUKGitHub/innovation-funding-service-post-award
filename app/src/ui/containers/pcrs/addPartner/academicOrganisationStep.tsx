import * as ACC from "@ui/components";
import { AccountDto, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { EditorStatus } from "@ui/constants/enums";
import { useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { useCallback, useState } from "react";
import { noop } from "@ui/helpers/noop";
import { useContent } from "@ui/hooks";
import { Section, ValidationMessage } from "@ui/components";
import { JesSearchResults } from "./jesSearchResults";

export const AcademicOrganisationStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

  const { accounts } = useStores();
  const { getContent } = useContent();

  const [searchInputValue, setSearchInputValue] = useState<string>();
  const [currentSelectedOption, setCurrentSelectedOption] = useState<AccountDto>();

  const getJesAccounts: () => Pending<AccountDto[]> = useCallback(
    () => (searchInputValue?.length ? accounts.getJesAccountsByName(searchInputValue) : Pending.done([])),
    [accounts, searchInputValue],
  );

  const updateOrganisationName = (organisationId: string | undefined, jesOrganisations: AccountDto[]) => {
    if (!organisationId) return;

    const selectedOrganisation = jesOrganisations.find(org => org.id === organisationId);
    if (!selectedOrganisation?.companyName) return;

    setCurrentSelectedOption(selectedOrganisation);
    props.pcrItem.organisationName = selectedOrganisation?.companyName;
    props.onChange(props.pcrItem);
  };

  const renderLoading = () => (
    <ACC.Renderers.SimpleString>
      {getContent(x => x.pcrAddPartnerAcademicOrganisation.loading)}
    </ACC.Renderers.SimpleString>
  );

  return (
    <ACC.Section>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={noop}
      >
        <Form.Fieldset headingContent={x => x.pcrAddPartnerAcademicOrganisation.labels.jesOrganisationSectionTitle}>
          <Section>
            <ValidationMessage
              messageType="info"
              qa="on-hold-info-message"
              message={x => x.pcrAddPartnerAcademicOrganisation.labels.jesOrganisationInfo}
            />
          </Section>
          <Form.Search
            name="searchJesOrganisations"
            hint={
              <ACC.Content value={x => x.pcrAddPartnerAcademicOrganisation.labels.jesOrganisationSectionSubtitle} />
            }
            value={() => searchInputValue}
            update={(_, searchValue) => setSearchInputValue(searchValue?.trim() || "")}
          />
          {!props.isClient && (
            <Form.Button styling="Primary" name="jesOrganisationSearch">
              {getContent(x => x.pcrAddPartnerAcademicOrganisation.labels.searchButton)}
            </Form.Button>
          )}
        </Form.Fieldset>
      </Form.Form>

      <Form.Form
        qa="jes-accounts-form"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={props.onSave}
        onChange={props.onChange}
      >
        <ACC.Loader
          pending={getJesAccounts()}
          renderLoading={() => renderLoading()}
          render={(jesAccounts, loading) => {
            const hasJesAccounts = jesAccounts.length > 0;
            const hasEmptySearchValue = typeof searchInputValue === "string" && searchInputValue.length === 0;
            const displayResultsLoading = hasEmptySearchValue && loading;

            if (displayResultsLoading) {
              renderLoading();
            }

            return hasJesAccounts ? (
              <JesSearchResults
                selected={currentSelectedOption}
                jesAccounts={jesAccounts}
                update={updateOrganisationName}
              />
            ) : (
              <>
                <ACC.Renderers.SimpleString>
                  {getContent(x => x.pcrAddPartnerCompanyHouse.resultNotShowing)}
                </ACC.Renderers.SimpleString>
              </>
            );
          }}
        />
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <ACC.Content value={x => x.pcrAddPartnerAcademicOrganisation.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <ACC.Content value={x => x.pcrAddPartnerAcademicOrganisation.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
