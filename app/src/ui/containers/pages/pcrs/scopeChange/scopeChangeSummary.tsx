import { PCRStepType } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";

export const ScopeChangeSummary = (props: { getEditLink: (pcrStep: PCRStepType) => React.ReactElement }) => {
  const { projectId, itemId, fetchKey } = usePcrWorkflowContext();

  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);

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
          action={props.getEditLink(PCRStepType.publicDescriptionStep)}
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
          action={props.getEditLink(PCRStepType.projectSummaryStep)}
        />
      </SummaryList>
    </Section>
  );
};
