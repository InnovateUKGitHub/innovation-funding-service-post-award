import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PCRContactRole } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
export const FinanceContactStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  return (
    <Section title={x => x.pages.pcrAddPartnerProjectContacts.sectionTitle}>
      <SimpleString>
        <Content value={x => x.pages.pcrAddPartnerProjectContacts.guidance} />
      </SimpleString>
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
            <Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </Section>
  );
};
