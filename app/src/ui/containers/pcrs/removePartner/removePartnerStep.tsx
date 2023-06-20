import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { RadioOptionProps } from "@ui/components/inputs/radioList";
import { Section } from "@ui/components/layout/section";
import { Loader } from "@ui/components/loading";
import { getPartnerName } from "@ui/components/partners/partnerName";
import { EditorStatus } from "@ui/constants/enums";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators/pcrDtoValidator";

interface InnerProps {
  partners: PartnerDto[];
}

const Form = createTypedForm<PCRItemForPartnerWithdrawalDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps,
) => {
  const partnerOptions: RadioOptionProps[] = props.partners
    .filter(x => !x.isWithdrawn)
    .map(x => ({
      id: x.id,
      value: getPartnerName(x),
    }));

  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  return (
    <Section>
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
          <Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </Section>
  );
};

export const RemovePartnerStep = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator>,
) => {
  const stores = useStores();

  const pending = Pending.combine({
    partners: stores.partners.getPartnersForProject(props.project.id),
  });

  return <Loader pending={pending} render={({ partners }) => <InnerContainer partners={partners} {...props} />} />;
};
