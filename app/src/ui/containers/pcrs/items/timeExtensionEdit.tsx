import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRItemForTimeExtensionDto, ProjectDto } from "@framework/dtos";
import { PCRTimeExtentionItemDtoValidator } from "@ui/validators";
import { ProjectChangeRequestItemStatus } from "@framework/entities";

interface Props {
  project: ProjectDto;
  projectChangeRequestItem: PCRItemForTimeExtensionDto;
  validator: PCRTimeExtentionItemDtoValidator;
  status: EditorStatus;
  onChange: (dto: PCRItemForTimeExtensionDto) => void;
  onSave: () => void;
}

export const TimeExtensionEdit = (props: Props) => {
  const Form = ACC.TypedForm<PCRItemForTimeExtensionDto>();

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
        qa="itemStatus"
      >
        <Form.Fieldset heading="Current end date">
          <Form.Custom
            name="currentEndDate"
            value={m => <ACC.Renderers.SimpleString><ACC.Renderers.FullDate value={props.project.periodEndDate} /></ACC.Renderers.SimpleString>}
            update={(m, v) => { return; }}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Set a new end date">
          <Form.MonthYear
            name="endDate"
            value={m => m.projectEndDate}
            update={(m, v) => m.projectEndDate = v}
            validation={props.validator.projectEndDate}
            hint={"The date must be at the end of a month, for example 31 01 2021"}
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
