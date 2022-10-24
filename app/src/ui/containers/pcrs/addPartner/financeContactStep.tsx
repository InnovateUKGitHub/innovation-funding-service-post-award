import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRContactRole } from "@framework/constants";
import { EditorStatus } from "@ui/constants/enums";

export const FinanceContactStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <ACC.Section title={x => x.pages.pcrAddPartnerProjectContacts.sectionTitle}>
      <ACC.Renderers.SimpleString>
        <ACC.Content value={x => x.pages.pcrAddPartnerProjectContacts.guidance} />
      </ACC.Renderers.SimpleString>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.financeContactHeading}>
          <Form.Hidden
            name="contact1ProjectRole"
            value={x => (x.contact1ProjectRole = PCRContactRole.FinanceContact)}
          />
          <Form.String
            label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
            name="contact1Forename"
            value={dto => dto.contact1Forename}
            update={(x, val) => {
              x.contact1Forename = val;
            }}
            validation={props.validator.contact1Forename}
          />
          <Form.String
            label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
            name="contact1Surname"
            value={dto => dto.contact1Surname}
            update={(x, val) => {
              x.contact1Surname = val;
            }}
            validation={props.validator.contact1Surname}
          />
          <Form.String
            label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
            hint={x => x.pages.pcrAddPartnerProjectContacts.phoneNumberHint}
            name="contact1Phone"
            value={dto => dto.contact1Phone}
            update={(x, val) => {
              x.contact1Phone = val;
            }}
            validation={props.validator.contact1Phone}
          />
          <Form.String
            label={x => x.pcrAddPartnerLabels.contactEmailHeading}
            name="contact1Email"
            value={dto => dto.contact1Email}
            update={(x, val) => {
              x.contact1Email = val;
            }}
            validation={props.validator.contact1Email}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <ACC.Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <ACC.Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
