import { PCRDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ReasoningStepProps } from "@ui/containers/pages/pcrs/reasoning/workflowMetadata";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { BaseProps } from "../../../containerBase";

const PCRForm = createTypedForm<PCRDto>();

export const PCRPrepareReasoningStep = (props: BaseProps & ReasoningStepProps) => {
  const { editor, onSave, onChange } = props;

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
            characterCountOptions={{
              type: "descending",
              maxValue: PCRDtoValidator.maxSalesforceFieldLength,
              warnValue: PCRDtoValidator.maxSalesforceFieldLength - 2000,
            }}
            rows={15}
          />
        </PCRForm.Fieldset>
        <PCRForm.Button name="reasoningStep" styling="Primary" onClick={() => onSave(editor.data)}>
          <Content value={x => x.pcrItem.submitButton} />
        </PCRForm.Button>
      </PCRForm.Form>
    </Section>
  );
};
