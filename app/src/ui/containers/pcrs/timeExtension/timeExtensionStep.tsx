import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForTimeExtensionDto } from "@framework/dtos";
import { StepProps } from "@ui/containers/pcrs/workflow";
import { EditorStatus } from "@ui/redux";
import { timeExtensionItemWorkflow } from "./timeExtensionWorkflow";

export const TimeExtensionStep = (props: StepProps<typeof timeExtensionItemWorkflow>) => {
  const Form = ACC.TypedForm<PCRItemForTimeExtensionDto>();
  const newProjectDuration = props.pcrItem.additionalMonths || props.pcrItem.additionalMonths === 0 ? props.pcrItem.additionalMonths + props.pcrItem.projectDurationSnapshot : null;

  return (
    <ACC.Section>
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="itemStatus"
      >
        <Form.Fieldset heading="Existing project details">
          <Form.Custom label="Start and end date" name="currentDates" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={m.projectDurationSnapshot} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
          <Form.Custom label="Duration" name="currentDuration" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.Months months={m.projectDurationSnapshot} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
        </Form.Fieldset>
        <Form.Fieldset heading="Proposed project details">
          <Form.Numeric
            name="timeExtension"
            hint={props.getRequiredToCompleteMessage("Enter the number of months you want to extend your project by.")}
            width={3}
            value={m => m.additionalMonths }
            update={(m, val) => m.additionalMonths = val}
            validation={props.validator.additionalMonths}
          />
          {props.isClient && <Form.Custom label="Start and end date" name="proposedDates" value={() => <ACC.Renderers.SimpleString><ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={newProjectDuration} /></ACC.Renderers.SimpleString>} update={() => { return; }} />}
          {props.isClient && <Form.Custom label="Duration" name="proposedDuration" value={() => <ACC.Renderers.SimpleString><ACC.Renderers.Months months={newProjectDuration} /></ACC.Renderers.SimpleString>} update={() => { return; }} />}
        </Form.Fieldset>
        <Form.Fieldset>
          <Form.Submit>Save and continue</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
