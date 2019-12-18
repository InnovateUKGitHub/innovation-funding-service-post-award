import React from "react";
import * as ACC from "../../../components";
import { SimpleString } from "@ui/components/renderers";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { scopeChangeStepNames } from "@ui/containers/pcrs/scopeChange/scopeChangeWorkflow";

export const ScopeChangeSummary = (props: PcrSummaryProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator, scopeChangeStepNames>) => {
  const { pcrItem, validator } = props;
  return (
    <ACC.Section qa="scope-change-summary">
      <ACC.SummaryList qa="scope-change-summary-list">
        <ACC.SummaryListItem
          label="Existing public description"
          content={
            <SimpleString multiline={true}>{pcrItem.publicDescriptionSnapshot}</SimpleString>
          }
          qa="currentPublicDescription"
        />
        <ACC.SummaryListItem
          label="New public description"
          content={
            <SimpleString multiline={true}>{pcrItem.publicDescription}</SimpleString>
          }
          qa="newPublicDescription"
          validation={validator.publicDescription}
          action={props.getEditLink("publicDescriptionStep", validator.publicDescription)}
        />
        <ACC.SummaryListItem
          label="Existing project summary"
          content={
            <SimpleString multiline={true}>{pcrItem.projectSummarySnapshot}</SimpleString>
          }
          qa="currentProjectSummary"
        />
        <ACC.SummaryListItem
          label="New project summary"
          content={
            <SimpleString multiline={true}>{pcrItem.projectSummary}</SimpleString>}
          qa="newProjectSummary"
          validation={validator.projectSummary}
          action={props.getEditLink("projectSummaryStep", validator.projectSummary)}
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
