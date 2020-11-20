import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";

export const AcademicOrganisationStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
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
        <Form.Fieldset headingContent={x => x.pcrAddPartnerAcademicOrganisation.labels.organisationSectionTitle}>
          <Form.String
            name="organisationName"
            hintContent={x => x.pcrAddPartnerAcademicOrganisation.hint()}
            value={dto => dto.organisationName}
            update={(x, val) => {
              x.organisationName = val;
            }}
            validation={props.validator.organisationName}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit><ACC.Content value={x => x.pcrAddPartnerAcademicOrganisation.pcrItem.submitButton()}/></Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}><ACC.Content value={x => x.pcrAddPartnerAcademicOrganisation.pcrItem.returnToSummaryButton()}/></Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
