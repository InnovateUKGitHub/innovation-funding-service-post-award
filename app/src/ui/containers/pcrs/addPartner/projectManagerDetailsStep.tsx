import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRContactRole } from "@framework/constants";

const useFinanceContactDetails = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const dto = props.pcrItem;
  dto.contact2Forename = dto.contact1Forename;
  dto.contact2Surname = dto.contact1Surname;
  dto.contact2Phone = dto.contact1Phone;
  dto.contact2Email = dto.contact1Email;
  props.onChange(dto);
};

export const ProjectManagerDetailsStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <ACC.Section titleContent={x => x.pcrAddPartnerProjectContacts.sectionTitle}>
      <ACC.Renderers.SimpleString><ACC.Content value={x => x.pcrAddPartnerProjectContacts.guidance}/></ACC.Renderers.SimpleString>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset headingContent={x => x.pcrAddPartnerProjectContacts.labels.projectLeadContactHeading}>
          {props.isClient && <Form.Button name="useFinanceContactDetails" onClick={() => useFinanceContactDetails(props)}><ACC.Content value={x => x.pcrAddPartnerProjectContacts.useFinanceDetails}/></Form.Button>}
          <Form.Hidden name="contact2ProjectRole" value={x => x.contact2ProjectRole = PCRContactRole.ProjectManager}/>
          <Form.String
            labelContent={x => x.pcrAddPartnerProjectContacts.labels.contactFirstNameHeading}
            name="contact2Forename"
            value={dto => dto.contact2Forename}
            update={(x, val) => {
              x.contact2Forename = val;
            }}
            validation={props.validator.contact2Forename}
          />
          <Form.String
            labelContent={x => x.pcrAddPartnerProjectContacts.labels.contactLastNameHeading}
            name="contact2Surname"
            value={dto => dto.contact2Surname}
            update={(x, val) => {
              x.contact2Surname = val;
            }}
            validation={props.validator.contact2Surname}
          />
          <Form.String
            labelContent={x => x.pcrAddPartnerProjectContacts.labels.contactPhoneNumberHeading}
            hintContent={x => x.pcrAddPartnerProjectContacts.phoneNumberHint}
            name="contact2Phone"
            value={dto => dto.contact2Phone}
            update={(x, val) => {
              x.contact2Phone = val;
            }}
            validation={props.validator.contact2Phone}
          />
          <Form.String
            labelContent={x => x.pcrAddPartnerProjectContacts.labels.contactEmailHeading}
            name="contact2Email"
            value={dto => dto.contact2Email}
            update={(x, val) => {
              x.contact2Email = val;
            }}
            validation={props.validator.contact2Email}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>S<ACC.Content value={x => x.pcrAddPartnerProjectContacts.pcrItem.submitButton()}/></Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}><ACC.Content value={x => x.pcrAddPartnerProjectContacts.pcrItem.returnToSummaryButton()}/></Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
