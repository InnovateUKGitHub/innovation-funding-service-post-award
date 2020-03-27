import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";

export const ProjectLocationStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <ACC.Section>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading="Name of town or city">
          <Form.String
            name="projectCity"
            value={dto => dto.projectCity}
            update={(x, val) => {
              x.projectCity = val;
            }}
            validation={props.validator.projectCity}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Postcode, postal code or zip code">
          <Form.String
            name="projectPostcode"
            hint="If this is not available, leave this blank."
            value={dto => dto.projectPostcode}
            update={(x, val) => {
              x.projectPostcode = val;
            }}
            validation={props.validator.projectPostcode}
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
