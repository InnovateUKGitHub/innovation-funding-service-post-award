import React from "react";
import * as Dtos from "@framework/dtos";
import * as ACC from "@ui/components";
import { timeExtensionStepNames } from "./timeExtensionWorkflow";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForTimeExtensionDto } from "@framework/dtos";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";

export const TimeExtensionSummary = (props: PcrSummaryProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator, timeExtensionStepNames>) => {
  const newProjectDuration = (x: Dtos.PCRItemForTimeExtensionDto) => !!x.additionalMonths || x.additionalMonths === 0 ? x.additionalMonths + x.projectDurationSnapshot : null;

  return (
    <React.Fragment>
      <ACC.Section title="Existing project details">
        <ACC.SummaryList qa="existingProjectDetails">
          <ACC.SummaryListItem label="Start and end date" content={<ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={props.pcrItem.projectDurationSnapshot} />} qa="currentStartToEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.Months months={props.pcrItem.projectDurationSnapshot} />} qa="currentDuration" />
        </ACC.SummaryList>
      </ACC.Section>
      <ACC.Section title="Proposed project details">
        <ACC.SummaryList qa="proposedProjectDetails">
          <ACC.SummaryListItem label="Additional months" content={props.pcrItem.additionalMonths} qa="additionalMonths" validation={props.validator.additionalMonths} action={props.getEditLink("timeExtension", props.validator.additionalMonths)} />
          <ACC.SummaryListItem label="Start and end date" content={<ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={newProjectDuration(props.pcrItem)} />} qa="newStartToEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.Months months={newProjectDuration(props.pcrItem)} />} qa="newDuration" />
        </ACC.SummaryList>
      </ACC.Section>
    </React.Fragment>
  );
};
