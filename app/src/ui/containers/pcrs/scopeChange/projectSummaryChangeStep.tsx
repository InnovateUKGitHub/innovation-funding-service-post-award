import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/constants/enums";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Info } from "@ui/components/layout/info";

const Form = createTypedForm<PCRItemForScopeChangeDto>();

export const ProjectSummaryChangeStep = (
  props: PcrStepProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator>,
) => {
  return (
    <Section qa="newSummarySection">
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave(false)}
      >
        <Form.Fieldset heading={x => x.pages.pcrScopeChangeProjectSummaryChange.headingProjectSummary}>
          <Info summary={<Content value={x => x.pages.pcrScopeChangeProjectSummaryChange.publishedSummary} />}>
            <SimpleString multiline>
              {props.pcrItem.projectSummarySnapshot || (
                <Content value={x => x.pages.pcrScopeChangeProjectSummaryChange.noAvailableSummary} />
              )}
            </SimpleString>
          </Info>
          <Form.MultilineString
            name="summary"
            hint={props.getRequiredToCompleteMessage()}
            value={m => m.projectSummary}
            update={(m, v) => (m.projectSummary = v)}
            validation={props.validator.projectSummary}
            qa="newSummary"
            rows={15}
            maxLength={32_000}
            characterCountOptions={{
              type: "descending",
              maxValue: 32_000,
            }}
          />
        </Form.Fieldset>
        <Form.Submit>
          <Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </Section>
  );
};
