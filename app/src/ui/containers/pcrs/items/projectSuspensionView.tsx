import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForProjectSuspensionDto;
}

export const ProjectSuspensionView = (props: Props) => (
  <ACC.SummaryList qa="projectSuspension">
    <ACC.SummaryListItem label="Start date" content={<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.suspensionStartDate}/>} qa="startDate" />
    <ACC.SummaryListItem label="End date" content={props.projectChangeRequestItem.suspensionEndDate ? <ACC.Renderers.ShortDate value={props.projectChangeRequestItem.suspensionEndDate}/> : "Not set"} qa="endDate" />
  </ACC.SummaryList>
);
