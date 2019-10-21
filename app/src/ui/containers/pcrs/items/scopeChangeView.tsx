import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

interface Props {
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForScopeChangeDto;
}

export const ScopeChangeView = (props: Props) => (
  <React.Fragment>
    <ACC.SectionPanel title="New public description" qa="newDescription">
      <ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.publicDescription}</ACC.Renderers.SimpleString>
      <ACC.Info summary="Published public description" qa="currentDescription"><ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.publicDescriptionSnapshot}</ACC.Renderers.SimpleString></ACC.Info>
    </ACC.SectionPanel>
    <ACC.SectionPanel title="New public summary" qa="newSummary">
      <ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.projectSummary}</ACC.Renderers.SimpleString>
      <ACC.Info summary="Published public summary" qa="currentSummary"><ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.projectSummarySnapshot}</ACC.Renderers.SimpleString></ACC.Info>
    </ACC.SectionPanel>
  </React.Fragment>
);
