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
          labelContent={x => x.pcrScopeChangeSummary.labels.existingDescription()}
          content={
            <SimpleString multiline={true}>{pcrItem.publicDescriptionSnapshot}</SimpleString>
          }
          qa="currentPublicDescription"
        />
        <ACC.SummaryListItem
          labelContent={x => x.pcrScopeChangeSummary.labels.newDescription()}
          content={
            <SimpleString multiline={true}>{pcrItem.publicDescription}</SimpleString>
          }
          qa="newPublicDescription"
          validation={validator.publicDescription}
          action={props.getEditLink("publicDescriptionStep", validator.publicDescription)}
        />
        <ACC.SummaryListItem
          labelContent={x => x.pcrScopeChangeSummary.labels.existingSummary()}
          content={
            <SimpleString multiline={true}>{pcrItem.projectSummarySnapshot}</SimpleString>
          }
          qa="currentProjectSummary"
        />
        <ACC.SummaryListItem
          labelContent={x => x.pcrScopeChangeSummary.labels.newSummary()}
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
