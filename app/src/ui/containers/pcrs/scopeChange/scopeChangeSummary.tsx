import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { scopeChangeStepNames } from "@ui/containers/pcrs/scopeChange/scopeChangeWorkflow";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators/pcrDtoValidator";

export const ScopeChangeSummary = (
  props: PcrSummaryProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator, scopeChangeStepNames>,
) => {
  const { pcrItem, validator } = props;
  return (
    <Section qa="scope-change-summary">
      <SummaryList qa="scope-change-summary-list">
        <SummaryListItem
          label={x => x.pcrScopeChangeLabels.existingDescription}
          content={<SimpleString multiline>{pcrItem.publicDescriptionSnapshot}</SimpleString>}
          qa="currentPublicDescription"
        />
        <SummaryListItem
          label={x => x.pcrScopeChangeLabels.newDescription}
          content={<SimpleString multiline>{pcrItem.publicDescription}</SimpleString>}
          qa="newPublicDescription"
          validation={validator.publicDescription}
          action={props.getEditLink(PCRStepId.publicDescriptionStep, validator.publicDescription)}
        />
        <SummaryListItem
          label={x => x.pcrScopeChangeLabels.existingSummary}
          content={<SimpleString multiline>{pcrItem.projectSummarySnapshot}</SimpleString>}
          qa="currentProjectSummary"
        />
        <SummaryListItem
          label={x => x.pcrScopeChangeLabels.newSummary}
          content={<SimpleString multiline>{pcrItem.projectSummary}</SimpleString>}
          qa="newProjectSummary"
          validation={validator.projectSummary}
          action={props.getEditLink(PCRStepId.projectSummaryStep, validator.projectSummary)}
        />
      </SummaryList>
    </Section>
  );
};
