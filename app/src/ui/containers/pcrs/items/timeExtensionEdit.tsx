import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRItemForTimeExtensionDto, ProjectDto } from "@framework/dtos";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";
import { isNumber } from "util";

interface Props {
  project: ProjectDto;
  projectChangeRequestItem: PCRItemForTimeExtensionDto;
  validator: PCRTimeExtensionItemDtoValidator;
  status: EditorStatus;
  onChange: (dto: PCRItemForTimeExtensionDto) => void;
  onSave: () => void;
}

export const TimeExtensionEdit = (props: Props) => {
  const Form = ACC.TypedForm<PCRItemForTimeExtensionDto>();

  const options: ACC.SelectOption[] = [
    { id: "true", value: "I have finished making changes." }
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
        <Form.Fieldset heading="Existing project details">
          <Form.Custom label="Start and end date" name="currentDates" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={m.projectDurationSnapshot} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
          <Form.Custom label="Duration" name="currentDuration" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.Months months={m.projectDurationSnapshot} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
        </Form.Fieldset>
        <Form.Fieldset heading="Proposed project details">
          <Form.Numeric
            name="timeExtension"
            hint="Enter the number of months you want to extend your project by"
            width="one-quarter"
            value={m => m.projectDuration !== null && m.projectDuration !== undefined ? (m.projectDuration - m.projectDurationSnapshot) : null }
            update={(m, val) => m.projectDuration = (val || val === 0 ? m.projectDurationSnapshot + val : val)}
            validation={props.validator.projectDuration}
          />
          <Form.Custom label="Start and end date" name="proposedDates" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={m.projectDuration} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
          <Form.Custom label="Duration" name="proposedDuration" value={(m) => <ACC.Renderers.SimpleString><ACC.Renderers.Months months={m.projectDuration} /></ACC.Renderers.SimpleString>} update={() => { return; }} />
        </Form.Fieldset>
        <Form.Fieldset heading="Mark as complete">
          <Form.Checkboxes
            name="itemStatus"
            options={options}
            value={m => m.status === PCRItemStatus.Complete ? [options[0]] : []}
            update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
            validation={props.validator.status}
          />
          <Form.Submit>Save and return to request</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
