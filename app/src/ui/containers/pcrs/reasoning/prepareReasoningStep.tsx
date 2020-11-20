import React from "react";
import { ContainerBase } from "../../containerBase";
import * as ACC from "../../../components";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { ReasoningStepProps } from "@ui/containers/pcrs/reasoning/workflowMetadata";

export class PCRPrepareReasoningStep extends ContainerBase<ReasoningStepProps, {}> {
  render() {
    const {editor, onSave, onChange} = this.props;
    const PCRForm = ACC.TypedForm<PCRDto>();

    return (
      <ACC.Section qa="reasoning-save-and-return">
        <PCRForm.Form
          editor={editor}
          onChange={dto => onChange(dto)}
        >
          <PCRForm.Fieldset headingContent={x => x.pcrPrepareReasoning.reasoningHeading}>
            <PCRForm.MultilineString
              name="reasoningComments"
              labelContent={x => x.pcrPrepareReasoning.reasoningHeading}
              labelHidden={true}
              hintContent={x => x.pcrPrepareReasoning.hint}
              qa="reason"
              value={m => m.reasoningComments}
              update={(m, v) => m.reasoningComments = v || ""}
              validation={editor.validator.reasoningComments}
              rows={15}
            />
          </PCRForm.Fieldset>
          <PCRForm.Button name="reasoningStep" styling="Primary" onClick={() => onSave(editor.data)}><ACC.Content value={x => x.pcrPrepareReasoning.pcrItem.submitButton()}/></PCRForm.Button>
        </PCRForm.Form>
      </ACC.Section>
    );
  }
}
