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
    <ACC.Section title="Add person to organisation">
      <ACC.Renderers.SimpleString>This information will be used to create an account for this person in the Innovation Funding Service.</ACC.Renderers.SimpleString>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading="Project manager">
          {props.isClient && <Form.Button name="useFinanceContactDetails" onClick={() => useFinanceContactDetails(props)}>Use the same details as the finance contact</Form.Button>}
          <Form.Hidden name="contact2ProjectRole" value={x => x.contact2ProjectRole = PCRContactRole.ProjectManager}/>
          <Form.String
            label="First name"
            name="contact2Forename"
            value={dto => dto.contact2Forename}
            update={(x, val) => {
              x.contact2Forename = val;
            }}
            validation={props.validator.contact2Forename}
          />
          <Form.String
            label="Last name"
            name="contact2Surname"
            value={dto => dto.contact2Surname}
            update={(x, val) => {
              x.contact2Surname = val;
            }}
            validation={props.validator.contact2Surname}
          />
          <Form.String
            label="Phone number"
            hint="We may use this to contact the partner for more information about this request."
            name="contact2Phone"
            value={dto => dto.contact2Phone}
            update={(x, val) => {
              x.contact2Phone = val;
            }}
            validation={props.validator.contact2Phone}
          />
          <Form.String
            label="Email"
            name="contact2Email"
            value={dto => dto.contact2Email}
            update={(x, val) => {
              x.contact2Email = val;
            }}
            validation={props.validator.contact2Email}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>Save and continue</Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>Save and return to summary</Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
