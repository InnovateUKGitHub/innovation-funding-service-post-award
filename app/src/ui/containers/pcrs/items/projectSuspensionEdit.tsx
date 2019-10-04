import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRItemForProjectSuspensionDto, ProjectDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";
import { ProjectChangeRequestItemStatus } from "@framework/entities";

interface Props {
  project: ProjectDto;
  projectChangeRequestItem: PCRItemForProjectSuspensionDto;
  validator: PCRProjectSuspensionItemDtoValidator;
  status: EditorStatus;
  onChange: (dto: PCRItemForProjectSuspensionDto) => void;
  onSave: () => void;
}

export const ProjectSuspensionEdit = (props: Props) => {
  const Form = ACC.TypedForm<PCRItemForProjectSuspensionDto>();

  const options: ACC.SelectOption[] = [
    { id: "true", value: "This is ready to submit." }
  ];

  return (
    <ACC.Section>
      <Form.Form
        data={props.projectChangeRequestItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="projectSuspension"
      >
        <Form.Fieldset heading="Project pauses">
          <Form.MonthYear
            name="suspensionStartDate"
            value={m => m.suspensionStartDate}
            update={(m, v) => m.suspensionStartDate = v}
            hint="This will happen on the first day of the month."
            startOrEnd="start"
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Project restarts (if known)">
          <Form.MonthYear
            name="suspensionEndDate"
            value={m => m.suspensionEndDate}
            update={(m, v) => m.suspensionEndDate = v}
            hint="This will happen on the last day of the month."
            startOrEnd="end"
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Mark as complete">
          <Form.Checkboxes
            name="itemStatus"
            options={options}
            value={m => m.status === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
            update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
            validation={props.validator.status}
          />
          <Form.Submit>Save and return to request</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
