import React from "react";
import { ContainerBase } from "../../containerBase";
import * as ACC from "../../../components";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { ReasoningStepProps } from "@ui/containers/pcrs/reasoning/workflowMetadata";

export class PCRPrepareReasoningStep extends ContainerBase<ReasoningStepProps, {}> {
  render() {
    const {editor, onSave, onChange} = this.props;
    const PCRForm = ACC.TypedForm<PCRDto>();

    const reasoningHint = (
      <ACC.Renderers.SimpleString>
        You must explain each change. Be brief and write clearly.<br/>
        If you are requesting a reallocation of project costs, you must justify each change to your costs.
      </ACC.Renderers.SimpleString>
    );

    return (
      <ACC.Section qa="reasoning-save-and-return">
        <PCRForm.Form
          editor={editor}
          onChange={dto => onChange(dto)}
        >
          <PCRForm.Fieldset heading="Reasoning">
            <PCRForm.MultilineString
              name="reasoningComments"
              label="Reasoning"
              labelHidden={true}
              hint={reasoningHint}
              qa="reason"
              value={m => m.reasoningComments}
              update={(m, v) => m.reasoningComments = v || ""}
              validation={editor.validator.reasoningComments}
              rows={15}
            />
          </PCRForm.Fieldset>
          <PCRForm.Button name="reasoningStep" styling="Primary" onClick={() => onSave(editor.data)}>Save and continue</PCRForm.Button>
        </PCRForm.Form>
      </ACC.Section>
    );
  }
}
