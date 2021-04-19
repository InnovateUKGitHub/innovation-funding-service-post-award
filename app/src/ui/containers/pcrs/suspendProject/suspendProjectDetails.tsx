import { EditorStatus } from "@ui/redux";
import { getAuthRoles } from "@framework/types";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";

export function SuspendProjectDetails(
  props: PcrStepProps<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator>,
) {
  const { getContent } = useContent();
  const { isPm } = getAuthRoles(props.project.roles);

  const Form = ACC.TypedForm<PCRItemForProjectSuspensionDto>();

  return (
    <>
      {isPm && (
        <ACC.Section>
          <ACC.Renderers.SimpleString>
            {getContent(x => x.pcrScopeChangeProjectContent.suspendProjectIntro)}
          </ACC.Renderers.SimpleString>
        </ACC.Section>
      )}

      <ACC.Section>
        <Form.Form
          data={props.pcrItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave()}
          qa="projectSuspension"
        >
          <Form.Fieldset headingContent={x => x.pcrScopeChangeProjectContent.firstDayOfPauseTitle}>
            <Form.MonthYear
              name="suspensionStartDate"
              startOrEnd="start"
              value={m => m.suspensionStartDate}
              validation={props.validator.suspensionStartDate}
              update={(m, v) => (m.suspensionStartDate = v)}
              hint={props.getRequiredToCompleteMessage(
                getContent(x => x.pcrScopeChangeProjectContent.firstDayOfPauseHint),
              )}
            />
          </Form.Fieldset>

          <Form.Fieldset headingContent={x => x.pcrScopeChangeProjectContent.firstDayOfPauseTitle}>
            <Form.MonthYear
              name="suspensionEndDate"
              startOrEnd="end"
              value={m => m.suspensionEndDate}
              validation={props.validator.suspensionEndDate}
              update={(m, v) => (m.suspensionEndDate = v)}
              hint={getContent(x => x.pcrScopeChangeProjectContent.lastDayOfPauseHint)}
            />
          </Form.Fieldset>

          <Form.SubmitAndContinue />
        </Form.Form>
      </ACC.Section>
    </>
  );
}
