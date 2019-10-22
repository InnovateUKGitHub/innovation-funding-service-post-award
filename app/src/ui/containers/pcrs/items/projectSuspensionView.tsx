import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForProjectSuspensionDto;
}

export const ProjectSuspensionView = (props: Props) => (
  <ACC.Section title="Partner details">
    <ACC.SummaryList qa="projectSuspension">
      <ACC.SummaryListItem label="First day of pause" content={<ACC.Renderers.ShortDate value={props.projectChangeRequestItem.suspensionStartDate} />} qa="startDate" />
      <ACC.SummaryListItem label="Last day of pause (if known)" content={props.projectChangeRequestItem.suspensionEndDate ? <ACC.Renderers.ShortDate value={props.projectChangeRequestItem.suspensionEndDate} /> : "Not set"} qa="endDate" />
    </ACC.SummaryList>
  </ACC.Section>
);
