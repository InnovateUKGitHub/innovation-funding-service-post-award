import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  project: Dtos.ProjectDto;
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForScopeChangeDto;
}

export const ScopeChangeView = (props: Props) => (
  <ACC.SummaryList qa="scopeChangeSummary">
    <ACC.SummaryListItem label="Original public description" content={<ACC.Renderers.SimpleString multiline={true}>{props.project.description}</ACC.Renderers.SimpleString>} qa="currentDescription" />
    <ACC.SummaryListItem label="Original public summary" content={<ACC.Renderers.SimpleString multiline={true}>{props.project.summary}</ACC.Renderers.SimpleString>} qa="currentSummary" />
    <ACC.SummaryListItem label="New public description" content={<ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.publicDescription}</ACC.Renderers.SimpleString>} qa="newDescription" />
    <ACC.SummaryListItem label="New public summary" content={<ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.projectSummary}</ACC.Renderers.SimpleString>} qa="newSummary" />
  </ACC.SummaryList>
);
