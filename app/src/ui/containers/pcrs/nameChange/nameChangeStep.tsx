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
  const partnerOptions: ACC.SelectOption[] = props.partners
    .filter(x => !x.isWithdrawn)
    .map(x => ({
      id: x.id,
      value: ACC.getPartnerName(x),
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
            update={(x, value) => {
              if (value?.id) {
                x.partnerId = value.id as PartnerId;
                // Save a copy of the partner name in our DTO, so our client can show the past name.
                // Salesforce must never save this value. If it does, that's an accountability problem.
                x.partnerNameSnapshot = props.partners.find(x => x.id === value.id)?.name ?? "";
              } else {
                x.partnerId = null;
                x.partnerNameSnapshot = "";
              }
            }}
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
