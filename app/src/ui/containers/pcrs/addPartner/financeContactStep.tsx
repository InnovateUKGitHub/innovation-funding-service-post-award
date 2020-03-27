import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRContactRole } from "@framework/constants";

export const FinanceContactStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
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
        <Form.Fieldset heading="Finance contact">
          <Form.Hidden name="contact1ProjectRole" value={x => x.contact1ProjectRole = PCRContactRole.FinanceContact}/>
          <Form.String
            label="First name"
            name="contact1Forename"
            value={dto => dto.contact1Forename}
            update={(x, val) => {
              x.contact1Forename = val;
            }}
            validation={props.validator.contact1Forename}
          />
          <Form.String
            label="Last name"
            name="contact1Surname"
            value={dto => dto.contact1Surname}
            update={(x, val) => {
              x.contact1Surname = val;
            }}
            validation={props.validator.contact1Surname}
          />
          <Form.String
            label="Phone number"
            hint="We may use this to contact the partner for more information about this request."
            name="contact1Phone"
            value={dto => dto.contact1Phone}
            update={(x, val) => {
              x.contact1Phone = val;
            }}
            validation={props.validator.contact1Phone}
          />
          <Form.String
            label="Email"
            name="contact1Email"
            value={dto => dto.contact1Email}
            update={(x, val) => {
              x.contact1Email = val;
            }}
            validation={props.validator.contact1Email}
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
