import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/constants/enums";
import { Pending } from "@shared/pending";
import { useCallback, useState } from "react";
import { noop } from "@ui/helpers/noop";
import { useContent } from "@ui/hooks/content.hook";
import { JesSearchResults } from "./jesSearchResults";
import { AccountDto } from "@framework/dtos/accountDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { ValidationMessage } from "@ui/components/validationMessage";
import { useMounted } from "@ui/features/has-mounted/Mounted";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Loader } from "@ui/components/loading";

const AddForm = createTypedForm<PCRItemForPartnerAdditionDto>();
const PartnerForm = createTypedForm<PCRItemForPartnerAdditionDto>();

export const AcademicOrganisationStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const { accounts } = useStores();
  const { getContent } = useContent();
  const { isServer } = useMounted();

  const [searchInputValue, setSearchInputValue] = useState<string>("");
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
    <SimpleString>{getContent(x => x.pages.pcrAddPartnerAcademicOrganisation.loading)}</SimpleString>
  );

  return (
    <Section>
      <AddForm.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={noop}
      >
        <AddForm.Fieldset heading={x => x.pcrAddPartnerLabels.jesOrganisationSectionTitle}>
          <Section>
            <ValidationMessage
              messageType="info"
              qa="jes-organisation-info"
              message={x => x.pcrAddPartnerLabels.jesOrganisationInfo}
            />
          </Section>
          <AddForm.Search
            name="searchJesOrganisations"
            qa="input-search-jes-organisations"
            hint={x => x.pcrAddPartnerLabels.jesOrganisationSectionSubtitle}
            value={() => searchInputValue}
            update={(_, searchValue) => setSearchInputValue(searchValue?.trim() || "")}
          />

          {isServer && (
            <AddForm.Button qa="button-search-jes-organisations" styling="Primary" name="jesOrganisationSearch">
              {getContent(x => x.pcrAddPartnerLabels.searchButton)}
            </AddForm.Button>
          )}
        </AddForm.Fieldset>
      </AddForm.Form>

      <PartnerForm.Form
        qa="jes-accounts-form"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={props.onChange}
      >
        <Loader
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
                Form={PartnerForm}
              />
            ) : (
              <>
                <SimpleString qa="no-jes-results-found">
                  {getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultNotShowing)}
                </SimpleString>
              </>
            );
          }}
        />
        <PartnerForm.Fieldset qa="save-and-continue">
          <PartnerForm.Submit>
            <Content value={x => x.pcrItem.submitButton} />
          </PartnerForm.Submit>
          <PartnerForm.Button
            qa="save-and-return-to-summary"
            name="saveAndReturnToSummary"
            onClick={() => props.onSave(true)}
          >
            <Content value={x => x.pcrItem.returnToSummaryButton} />
          </PartnerForm.Button>
        </PartnerForm.Fieldset>
      </PartnerForm.Form>
    </Section>
  );
};
