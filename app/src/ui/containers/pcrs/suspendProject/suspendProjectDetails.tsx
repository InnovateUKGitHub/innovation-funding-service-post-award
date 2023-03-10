import { getAuthRoles } from "@framework/types";
import { EditorStatus } from "@ui/constants/enums";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";

const Form = ACC.createTypedForm<PCRItemForProjectSuspensionDto>();

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
        <ACC.Section>
          <ACC.Renderers.SimpleString>{suspendProjectIntro}</ACC.Renderers.SimpleString>
        </ACC.Section>
      )}

      <ACC.Section>
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
      </ACC.Section>
    </>
  );
};
