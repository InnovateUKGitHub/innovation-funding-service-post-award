import React from "react";
import * as ACC from "../../../components";
import { SummaryProps } from "@ui/containers/pcrs/workflow";
import { scopeChangeWorkflow } from "./scopeChangeWorkflow";

export const ScopeChangeSummary = (props: SummaryProps<typeof scopeChangeWorkflow>) => {
  const { pcrItem, validator } = props;
  return (
    <ACC.Section qa="scope-change-summary">
      <ACC.SummaryList qa="scope-change-summary-list">
        <ACC.SummaryListItem
          label="Existing public description"
          content={pcrItem.publicDescriptionSnapshot}
          qa="currentPublicDescription"
        />
        <ACC.SummaryListItem
          label="New public description"
          content={pcrItem.publicDescription}
          qa="newPublicDescription"
          validation={validator.publicDescription}
          action={props.getEditLink("publicDescriptionStep", validator.publicDescription)}
        />
        <ACC.SummaryListItem
          label="Existing project summary"
          content={pcrItem.projectSummarySnapshot}
          qa="currentProjectSummary"
        />
        <ACC.SummaryListItem
          label="New project summary"
          content={pcrItem.projectSummary}
          qa="newProjectSummary"
          validation={validator.projectSummary}
          action={props.getEditLink("projectSummaryStep", validator.projectSummary)}
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
