import * as ACC from "@ui/components";
import { PartnerDto, PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { useStores } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { EditorStatus } from "@ui/constants/enums";

interface InnerProps {
  partners: PartnerDto[];
}

const Form = ACC.createTypedForm<PCRItemForPartnerWithdrawalDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps,
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
        qa="withdrawPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pages.pcrRemovePartner.headingSelectPartner}>
          <Form.Radio
            name="partnerId"
            hint={props.getRequiredToCompleteMessage()}
            options={partnerOptions}
            inline={false}
            value={() => selectedPartnerOption}
            update={(x, value) => (x.partnerId = value && value.id)}
            validation={props.validator.partnerId}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pages.pcrRemovePartner.headingRemovalPeriod}>
          <Form.Numeric
            label={x => x.pcrRemovePartnerLabels.removalPeriod}
            hint={x => x.pages.pcrRemovePartner.hintRemovalPeriod}
            labelHidden
            width={3}
            name="removalPeriod"
            value={x => x.removalPeriod}
            update={(x, value) => (x.removalPeriod = value)}
            validation={props.validator.removalPeriod}
          />
        </Form.Fieldset>
        <Form.Submit>
          <ACC.Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};

export const RemovePartnerStep = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.partners.getPartnersForProject(props.project.id)}
      render={x => <InnerContainer partners={x} {...props} />}
    />
  );
};
