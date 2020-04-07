import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";

export const CompaniesHouseStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <ACC.Section title="Company House">
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading="Company details">
          <Form.String
            label="Organisation name"
            name="organisationName"
            value={dto => dto.organisationName}
            update={(x, val) => {
              x.organisationName = val;
            }}
            validation={props.validator.companyHouseOrganisationName}
          />
          <Form.String
            label="Registration number"
            name="registrationNumber"
            value={dto => dto.registrationNumber}
            update={(x, val) => {
              x.registrationNumber = val;
            }}
            validation={props.validator.registrationNumber}
          />
          <Form.String
            label="Registered address"
            name="registeredAddress"
            value={dto => dto.registeredAddress}
            update={(x, val) => {
              x.registeredAddress = val;
            }}
            validation={props.validator.registeredAddress}
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
