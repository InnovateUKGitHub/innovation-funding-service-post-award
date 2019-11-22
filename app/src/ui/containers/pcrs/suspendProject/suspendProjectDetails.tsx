import React from "react";
import * as ACC from "@ui/components";
import { StepProps } from "../workflow";
import { suspendProjectWorkflow } from "./workflow";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";

export const SuspendProjectDetails = (props: StepProps<typeof suspendProjectWorkflow>) => {
  const Form = ACC.TypedForm<PCRItemForProjectSuspensionDto>();

  return (
    <ACC.Section>
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="projectSuspension"
      >
        <Form.Fieldset heading="First day of pause">
          <Form.MonthYear
            name="suspensionStartDate"
            value={m => m.suspensionStartDate}
            validation={props.validator.suspensionStartDate}
            update={(m, v) => m.suspensionStartDate = v}
            hint="This will happen on the first day of the month and is required to complete request."
            startOrEnd="start"
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Last day of pause (if known)">
          <Form.MonthYear
            name="suspensionEndDate"
            value={m => m.suspensionEndDate}
            validation={props.validator.suspensionEndDate}
            update={(m, v) => m.suspensionEndDate = v}
            hint="This will happen on the last day of the month."
            startOrEnd="end"
          />
        </Form.Fieldset>
        <Form.Submit>Save and continue</Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};
