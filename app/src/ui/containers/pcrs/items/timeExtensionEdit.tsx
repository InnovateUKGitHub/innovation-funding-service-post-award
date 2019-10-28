import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRItemForTimeExtensionDto, ProjectDto } from "@framework/dtos";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";
import { DateTime } from "luxon";

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

  const updateItem = (item: PCRItemForTimeExtensionDto, value: number|null ) => {
    item.projectExtension = value;

    if(value && item.projectEndDateSnapshot && item.projectDurationSnapshot) {
      item.projectDuration = item.projectDurationSnapshot + value;
      item.projectEndDate = DateTime.fromJSDate(item.projectEndDateSnapshot).plus({
        months: item.projectDuration
      }).toJSDate();
    }
  };

  return (
    <ACC.Section>
      <Form.Form
        data={props.projectChangeRequestItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="itemStatus"
      >
        <ACC.SummaryList qa="existingProjectDetailsSummaryList" heading="Existing project details">
          <ACC.SummaryListItem label="Start date" content={<ACC.Renderers.ShortDate value={props.project.startDate} />} qa="currentStartDate" />
          <ACC.SummaryListItem label="End date" content={<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.projectEndDateSnapshot} />} qa="currentEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.MonthsDuration months={props.projectChangeRequestItem.projectDurationSnapshot} />} qa="currentDuration" />
        </ACC.SummaryList>
        <Form.Fieldset heading="Proposed project details">
          <Form.Numeric
            name="timeExtension"
            hint="Enter the number of months you want to extend your project by"
            width="small"
            value={m => (m.projectDuration) ? (m.projectDuration - props.project.durationInMonths) : null}
            update={(m, val) => updateItem(m, val)}
          />
          <ACC.SummaryList qa="newProjectDetailsSummaryList">
            <ACC.SummaryListItem label="Start date" content={<ACC.Renderers.ShortDate value={props.project.startDate} />} qa="currentStartDate" />
            <ACC.SummaryListItem label="End date" content={<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.projectEndDate} />} qa="currentEndDate" />
            <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.MonthsDuration months={props.projectChangeRequestItem.projectDuration} />} qa="currentDuration" />
          </ACC.SummaryList>
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
