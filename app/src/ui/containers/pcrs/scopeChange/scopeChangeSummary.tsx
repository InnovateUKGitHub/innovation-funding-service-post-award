import { SimpleString } from "@ui/components/renderers";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { scopeChangeStepNames } from "@ui/containers/pcrs/scopeChange/scopeChangeWorkflow";
import * as ACC from "../../../components";
import { PCRStepId } from "@framework/types";

export const ScopeChangeSummary = (
  props: PcrSummaryProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator, scopeChangeStepNames>,
) => {
  const { pcrItem, validator } = props;
  return (
    <ACC.Section qa="scope-change-summary">
      <ACC.SummaryList qa="scope-change-summary-list">
        <ACC.SummaryListItem
          label={x => x.pcrScopeChangeLabels.existingDescription}
          content={<SimpleString multiline>{pcrItem.publicDescriptionSnapshot}</SimpleString>}
          qa="currentPublicDescription"
        />
        <ACC.SummaryListItem
          label={x => x.pcrScopeChangeLabels.newDescription}
          content={<SimpleString multiline>{pcrItem.publicDescription}</SimpleString>}
          qa="newPublicDescription"
          validation={validator.publicDescription}
          action={props.getEditLink(PCRStepId.publicDescriptionStep, validator.publicDescription)}
        />
        <ACC.SummaryListItem
          label={x => x.pcrScopeChangeLabels.existingSummary}
          content={<SimpleString multiline>{pcrItem.projectSummarySnapshot}</SimpleString>}
          qa="currentProjectSummary"
        />
        <ACC.SummaryListItem
          label={x => x.pcrScopeChangeLabels.newSummary}
          content={<SimpleString multiline>{pcrItem.projectSummary}</SimpleString>}
          qa="newProjectSummary"
          validation={validator.projectSummary}
          action={props.getEditLink(PCRStepId.projectSummaryStep, validator.projectSummary)}
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
