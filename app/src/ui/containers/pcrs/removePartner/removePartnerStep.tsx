import { PartnerDto, PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { RadioOptionProps } from "@ui/components/inputs";
import { EditorStatus } from "@ui/constants/enums";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";

interface InnerProps {
  partners: PartnerDto[];
}

const Form = ACC.createTypedForm<PCRItemForPartnerWithdrawalDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps,
) => {
  const partnerOptions: RadioOptionProps[] = props.partners
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
            update={(x: PCRItemForPartnerWithdrawalDto, value) => {
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

  const pending = Pending.combine({
    partners: stores.partners.getPartnersForProject(props.project.id),
  });

  return <ACC.Loader pending={pending} render={({ partners }) => <InnerContainer partners={partners} {...props} />} />;
};
