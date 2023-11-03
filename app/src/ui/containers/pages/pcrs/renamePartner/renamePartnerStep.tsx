import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Loader } from "@ui/components/bjss/loading";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux/storesProvider";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { getPartnerName } from "@ui/components/atomicDesign/organisms/partners/utils/partnerName";

interface InnerProps {
  partners: PartnerDto[];
}

const Form = createTypedForm<PCRItemForAccountNameChangeDto>();

const RenamePartnerStepComponent = (
  props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps,
) => {
  const partnerOptions: SelectOption[] = props.partners
    .filter(x => !x.isWithdrawn)
    .map(x => ({
      id: x.id,
      value: getPartnerName(x),
    }));

  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  return (
    <Section>
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
          <Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </Section>
  );
};

export const RenamePartnerStep = (
  props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.partners.getPartnersForProject(props.project.id)}
      render={x => <RenamePartnerStepComponent {...props} partners={x} />}
    />
  );
};
