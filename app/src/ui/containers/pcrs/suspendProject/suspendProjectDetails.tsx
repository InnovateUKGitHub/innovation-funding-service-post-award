import { PCRItemForProjectSuspensionDto } from "@framework/dtos/pcrDtos";
import { getAuthRoles } from "@framework/types/authorisation";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { EditorStatus } from "@ui/constants/enums";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { useContent } from "@ui/hooks/content.hook";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators/pcrDtoValidator";

const Form = createTypedForm<PCRItemForProjectSuspensionDto>();

export const SuspendProjectDetails = (
  props: PcrStepProps<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator>,
) => {
  const { getContent } = useContent();
  const { isPm } = getAuthRoles(props.project.roles);

  const suspendProjectIntro = getContent(x => x.pages.pcrSuspendProjectDetails.suspendProjectIntro);
  const firstDayOfPauseTitle = getContent(x => x.pages.pcrSuspendProjectDetails.firstDayOfPauseTitle);
  const lastDayOfPauseTitle = getContent(x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseTitle);
  const lastDayOfPauseHint = getContent(x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseHint);

  return (
    <>
      {isPm && (
        <Section>
          <SimpleString>{suspendProjectIntro}</SimpleString>
        </Section>
      )}

      <Section>
        <Form.Form
          data={props.pcrItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave(false)}
          qa="projectSuspension"
        >
          <Form.Fieldset heading={firstDayOfPauseTitle}>
            <Form.MonthYear
              name="suspensionStartDate"
              startOrEnd="start"
              value={m => m.suspensionStartDate}
              validation={props.validator.suspensionStartDate}
              update={(m, v) => (m.suspensionStartDate = v)}
              hint={props.getRequiredToCompleteMessage()}
            />
          </Form.Fieldset>

          <Form.Fieldset heading={lastDayOfPauseTitle}>
            <Form.MonthYear
              name="suspensionEndDate"
              startOrEnd="end"
              value={m => m.suspensionEndDate}
              validation={props.validator.suspensionEndDate}
              update={(m, v) => (m.suspensionEndDate = v)}
              hint={lastDayOfPauseHint}
            />
          </Form.Fieldset>

          <Form.SubmitAndContinue />
        </Form.Form>
      </Section>
    </>
  );
};
