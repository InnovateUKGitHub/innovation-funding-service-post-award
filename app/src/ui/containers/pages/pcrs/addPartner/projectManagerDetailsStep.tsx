import { PCRContactRole } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { EditorStatus } from "@ui/redux/constants/enums";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PcrStepProps } from "../pcrWorkflow";

const getFinanceContactDetails = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const dto = props.pcrItem;
  dto.contact2Forename = dto.contact1Forename;
  dto.contact2Surname = dto.contact1Surname;
  dto.contact2Phone = dto.contact1Phone;
  dto.contact2Email = dto.contact1Email;
  props.onChange(dto);
};

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

export const ProjectManagerDetailsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const { isClient } = useMounted();

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
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.projectLeadContactHeading}>
          {isClient && (
            <Form.Button name="useFinanceContactDetails" onClick={() => getFinanceContactDetails(props)}>
              <Content value={x => x.pages.pcrAddPartnerProjectContacts.useFinanceDetails} />
            </Form.Button>
          )}

          <Form.Hidden
            name="contact2ProjectRole"
            value={x => (x.contact2ProjectRole = PCRContactRole.ProjectManager)}
          />

          <Form.String
            label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
            name="contact2Forename"
            value={dto => dto.contact2Forename}
            update={(x, val) => {
              x.contact2Forename = val;
            }}
            validation={props.validator.contact2Forename}
          />

          <Form.String
            label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
            name="contact2Surname"
            value={dto => dto.contact2Surname}
            update={(x, val) => {
              x.contact2Surname = val;
            }}
            validation={props.validator.contact2Surname}
          />

          <Form.String
            label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
            hint={x => x.pages.pcrAddPartnerProjectContacts.phoneNumberHint}
            name="contact2Phone"
            value={dto => dto.contact2Phone}
            update={(x, val) => {
              x.contact2Phone = val;
            }}
            validation={props.validator.contact2Phone}
          />

          <Form.String
            label={x => x.pcrAddPartnerLabels.contactEmailHeading}
            name="contact2Email"
            value={dto => dto.contact2Email}
            update={(x, val) => {
              x.contact2Email = val;
            }}
            validation={props.validator.contact2Email}
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
