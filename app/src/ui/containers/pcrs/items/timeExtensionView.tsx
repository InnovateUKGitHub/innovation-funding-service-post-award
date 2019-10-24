import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForTimeExtensionDto;
}

export const TimeExtensionView = (props: Props) => (
  <React.Fragment>
      <ACC.SummaryList qa="existingProjectDetails" heading="Existing project details">
        <ACC.SummaryListItem label="Start and end date" content={<React.Fragment><ACC.Renderers.ShortDate value={props.project.startDate} />{" to "}<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.projectEndDateSnapshot} /></React.Fragment>} qa="currentStartToEndDate" />
        <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.MonthsDuration months={props.projectChangeRequestItem.projectDurationSnapshot} />} qa="currentDuration" />
      </ACC.SummaryList>
      <ACC.SummaryList qa="proposedProjectDetails" heading="Proposed project details">
        <ACC.SummaryListItem label="Start and end date" content={<React.Fragment><ACC.Renderers.ShortDate value={props.project.startDate} />{" to "}<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.projectEndDate} /></React.Fragment>} qa="newStartToEndDate" />
        <ACC.SummaryListItem label="Duration" content={<ACC.Renderers.MonthsDuration months={props.projectChangeRequestItem.projectDuration} />} qa="newDuration" />
      </ACC.SummaryList>
  </React.Fragment>
);
