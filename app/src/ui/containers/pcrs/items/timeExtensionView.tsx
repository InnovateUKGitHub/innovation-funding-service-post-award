import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { DateTime } from "luxon";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForTimeExtensionDto;
}

export const TimeExtensionView = (props: Props) => {

  const originalProjectEndDate = (props.project.startDate && props.projectChangeRequestItem.projectDurationSnapshot) ? DateTime.fromJSDate(props.project.startDate).plus({
    months: props.projectChangeRequestItem.projectDurationSnapshot
  }).endOf("month").toJSDate() : null;

  const newProjectEndDate = (props.project.startDate && props.projectChangeRequestItem.projectDuration) ? DateTime.fromJSDate(props.project.startDate).plus({
    months: props.projectChangeRequestItem.projectDuration
  }).endOf("month").toJSDate() : null;

  return (
    <React.Fragment>
    <ACC.Section title="Existing project details">
        <ACC.SummaryList qa="existingProjectDetails">
          <ACC.SummaryListItem label="Start and end date" content={<ACC.Renderers.ShortDateRange start={props.project.startDate} end={originalProjectEndDate} />} qa="currentStartToEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.Duration startDate={props.project.startDate} endDate={originalProjectEndDate} />} qa="currentDuration" />
        </ACC.SummaryList>
      </ACC.Section>
      <ACC.Section title="Proposed project details">
        <ACC.SummaryList qa="proposedProjectDetails">
          <ACC.SummaryListItem label="Start and end date" content={<ACC.Renderers.ShortDateRange start={props.project.startDate} end={newProjectEndDate} />} qa="newStartToEndDate" />
          <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.Duration startDate={props.project.startDate} endDate={newProjectEndDate} />} qa="newDuration" />
        </ACC.SummaryList>
      </ACC.Section>
    </React.Fragment>);
};
