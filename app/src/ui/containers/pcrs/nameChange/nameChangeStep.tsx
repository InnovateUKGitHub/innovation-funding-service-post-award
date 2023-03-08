import { pcrOverpopulatedList } from "@framework/constants";
import { PartnerDto, PCRItemForAccountNameChangeDto } from "@framework/dtos";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/constants/enums";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";

interface InnerProps {
  partners: PartnerDto[];
}

const Form = ACC.createTypedForm<PCRItemForAccountNameChangeDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps,
) => {
  // Find all PCR items that are partner rename items,
  // that are also not the current PCR item.
  const renamePCRs = props.pcr.items
    .filter(x => pcrOverpopulatedList.includes(x.type))
    .filter(x => x.id !== props.pcrItem.id) as PCRItemForAccountNameChangeDto[];

  const partnerOptions: ACC.SelectOption[] = props.partners
    .filter(x => !x.isWithdrawn)
    .map(x => ({
      id: x.id,
      value: ACC.getPartnerName(x),
      disabled: renamePCRs.some(renamePCR => renamePCR.partnerId === x.id),
    }));

  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  return (
    <ACC.Section>
      <Form.Form
        qa="changePartnerNameForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pages.pcrNameChange.headingSelectPartner}>
          <Form.Radio
            name="partnerId"
            hint={props.getRequiredToCompleteMessage()}
            options={partnerOptions}
            inline={false}
            value={() => selectedPartnerOption}
            update={(x, value) => (x.partnerId = value && (value.id as PartnerId))}
            validation={props.validator.partnerId}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pages.pcrNameChange.headingEnterName}>
          <Form.String
            label={x => x.pcrNameChangeLabels.enterName}
            hint={props.getRequiredToCompleteMessage()}
            labelHidden
            name="accountName"
            value={x => x.accountName}
            update={(x, value) => (x.accountName = value)}
            validation={props.validator.accountName}
          />
        </Form.Fieldset>
        <Form.Submit>
          <ACC.Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};

export const NameChangeStep = (
  props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.partners.getPartnersForProject(props.project.id)}
      render={x => <InnerContainer {...props} partners={x} />}
    />
  );
};
