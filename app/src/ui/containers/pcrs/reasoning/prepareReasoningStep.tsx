import { PCRDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { ReasoningStepProps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ContainerBase } from "../../containerBase";

const PCRForm = createTypedForm<PCRDto>();

export class PCRPrepareReasoningStep extends ContainerBase<ReasoningStepProps> {
  render() {
    const { editor, onSave, onChange } = this.props;

    return (
      <Section qa="reasoning-save-and-return">
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
            <Content value={x => x.pcrItem.submitButton} />
          </PCRForm.Button>
        </PCRForm.Form>
      </Section>
    );
  }
}
