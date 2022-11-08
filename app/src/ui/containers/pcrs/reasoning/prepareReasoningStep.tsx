import { PCRDto } from "@framework/dtos/pcrDtos";
import { ReasoningStepProps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { PCRDtoValidator } from "@ui/validators";
import { ContainerBase } from "../../containerBase";
import * as ACC from "../../../components";

const PCRForm = ACC.createTypedForm<PCRDto>();

export class PCRPrepareReasoningStep extends ContainerBase<ReasoningStepProps, {}> {
  render() {
    const { editor, onSave, onChange } = this.props;

    return (
      <ACC.Section qa="reasoning-save-and-return">
        <PCRForm.Form editor={editor} onChange={dto => onChange(dto)}>
          <PCRForm.Fieldset heading={x => x.pages.pcrReasoningPrepareReasoning.headingReasoning}>
            <PCRForm.MultilineString
              name="reasoningComments"
              label={x => x.pages.pcrReasoningPrepareReasoning.headingReasoning}
              labelHidden
              hint={x => x.pages.pcrReasoningPrepareReasoning.hint}
              qa="reason"
              value={m => m.reasoningComments}
              update={(m, v) => (m.reasoningComments = v || "")}
              validation={editor.validator.reasoningComments}
              characterCountOptions={{ type: "descending", maxValue: PCRDtoValidator.maxCommentsLength }}
              rows={15}
            />
          </PCRForm.Fieldset>
          <PCRForm.Button name="reasoningStep" styling="Primary" onClick={() => onSave(editor.data)}>
            <ACC.Content value={x => x.pcrItem.submitButton} />
          </PCRForm.Button>
        </PCRForm.Form>
      </ACC.Section>
    );
  }
}
