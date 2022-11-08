import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRContactRole } from "@framework/constants";
import { EditorStatus } from "@ui/constants/enums";
import { useMounted } from "@ui/features";

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

const Form = ACC.createTypedForm<PCRItemForPartnerAdditionDto>();

export const ProjectManagerDetailsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const { isClient } = useMounted();

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
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.projectLeadContactHeading}>
          {isClient && (
            <Form.Button name="useFinanceContactDetails" onClick={() => getFinanceContactDetails(props)}>
              <ACC.Content value={x => x.pages.pcrAddPartnerProjectContacts.useFinanceDetails} />
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
