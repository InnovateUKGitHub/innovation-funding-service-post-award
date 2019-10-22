import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForTimeExtensionDto;
}

export const TimeExtensionView = (props: Props) => (
    <ACC.SummaryList qa="timeExtensionSummaryList">
      <ACC.SummaryListItem label="Current end date" content={<ACC.Renderers.ShortDate value={props.project.endDate} />} qa="currentEndDate" />
      <ACC.SummaryListItem label="Current duration" content={<ACC.Renderers.Duration startDate={props.project.startDate} endDate={props.project.endDate} />} qa="currentDuration" />
      <ACC.SummaryListItem label="New end date" content={<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.projectEndDate} />} qa="newEndDate" />
      <ACC.SummaryListItem label="New duration" content={<ACC.Renderers.Duration startDate={props.project.startDate} endDate={props.projectChangeRequestItem.projectEndDate} />} qa="newDuration" />
    </ACC.SummaryList>
);
