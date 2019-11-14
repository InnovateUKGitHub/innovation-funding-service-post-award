import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForTimeExtensionDto;
}

export const TimeExtensionView = (props: Props) => {
  return (
    <React.Fragment>
      <ACC.Section title="Existing project details">
        <ACC.SummaryList qa="existingProjectDetails">
          <ACC.SummaryListItem label="Start and end date" content={<ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={props.projectChangeRequestItem.projectDurationSnapshot} />} qa="currentStartToEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.Months months={props.projectChangeRequestItem.projectDurationSnapshot} />} qa="currentDuration" />
        </ACC.SummaryList>
      </ACC.Section>
      <ACC.Section title="Proposed project details">
        <ACC.SummaryList qa="proposedProjectDetails">
          <ACC.SummaryListItem label="Start and end date" content={<ACC.Renderers.ShortDateRangeFromDuration startDate={props.project.startDate} months={props.projectChangeRequestItem.projectDuration} />} qa="newStartToEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.Months months={props.projectChangeRequestItem.projectDuration} />} qa="newDuration" />
        </ACC.SummaryList>
      </ACC.Section>
    </React.Fragment>);
};
