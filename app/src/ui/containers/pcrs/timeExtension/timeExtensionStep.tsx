import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForTimeExtensionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";
import { useContent } from "@ui/hooks";

export const TimeExtensionStep = (props: PcrStepProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator>) => {
  const { getContent } = useContent();

  const Form = ACC.TypedForm<PCRItemForTimeExtensionDto>();
  const newProjectDuration = props.pcrItem.additionalMonths || props.pcrItem.additionalMonths === 0 ? props.pcrItem.additionalMonths + props.pcrItem.projectDurationSnapshot : null;

  const existingProjectHeading = getContent(x => x.pcrTimeExtensionStepContent.existingProjectHeading);
  const dateLabel = getContent(x => x.pcrTimeExtensionStepContent.dateLabel);
  const durationLabel = getContent(x => x.pcrTimeExtensionStepContent.durationLabel);
  const proposedProjectHeading = getContent(x => x.pcrTimeExtensionStepContent.proposedProjectHeading);
  const timeExtensionHint = getContent(x => x.pcrTimeExtensionStepContent.timeExtensionHint);
  const saveAndContinue = getContent(x => x.pcrTimeExtensionStepContent.saveAndContinue);

  return (
    <ACC.Section>
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="itemStatus"
      >
        <Form.Fieldset heading={existingProjectHeading}>
        <Form.Custom label={dateLabel} name="currentDates" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={m.projectDurationSnapshot} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
          <Form.Custom label={durationLabel} name="currentDuration" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.Months months={m.projectDurationSnapshot} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
        </Form.Fieldset>
        <Form.Fieldset heading={proposedProjectHeading}>
          <Form.Numeric
            name="timeExtension"
            hint={props.getRequiredToCompleteMessage(timeExtensionHint)}
            width={3}
            value={m => m.additionalMonths }
            update={(m, val) => m.additionalMonths = val}
            validation={props.validator.additionalMonths}
          />
        {props.isClient && <Form.Custom label={dateLabel} name="proposedDates" value={() => <ACC.Renderers.SimpleString><ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={newProjectDuration} /></ACC.Renderers.SimpleString>} update={() => { return; }} />}
          {props.isClient && <Form.Custom label={durationLabel} name="proposedDuration" value={() => <ACC.Renderers.SimpleString><ACC.Renderers.Months months={newProjectDuration} /></ACC.Renderers.SimpleString>} update={() => { return; }} />}
        </Form.Fieldset>
        <Form.Fieldset>
          <Form.Submit>{saveAndContinue}</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
