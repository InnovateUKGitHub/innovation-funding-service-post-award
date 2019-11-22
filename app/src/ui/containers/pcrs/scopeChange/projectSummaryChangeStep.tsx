import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { StepProps } from "@ui/containers/pcrs/workflow";
import { scopeChangeWorkflow } from "./scopeChangeWorkflow";

export const ProjectSummaryChangeStep = (props: StepProps<typeof scopeChangeWorkflow>) => {
  const Form = ACC.TypedForm<PCRItemForScopeChangeDto>();

  return (
    <ACC.Section>
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
      >
        <Form.Fieldset heading="Proposed project summary">
          <ACC.Info summary="Published project summary"><ACC.Renderers.SimpleString multiline={true}>{props.pcrItem.projectSummarySnapshot || "No project summary available."}</ACC.Renderers.SimpleString></ACC.Info>
          <Form.MultilineString
            name="summary"
            hint={props.getRequiredToCompleteMessage()}
            value={m => m.projectSummary}
            update={(m, v) => m.projectSummary = v}
            validation={props.validator.projectSummary}
            qa="newSummary"
            rows={15}
          />
        </Form.Fieldset>
        <Form.Submit>Save and continue</Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};
