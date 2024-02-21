import WithScrollToTopOnPropChange from "@ui/features/scroll-to-top-on-prop-change";
import { usePcrWorkflowContext } from "./pcrItemWorkflow";

export const SummarySection = () => {
  const { workflow } = usePcrWorkflowContext();

  /**
   * Will need to handle various features previously handled by PCRSummaryContext.
   * preferably the data for these should be obtained by the relevant Workflow Summary page rather than at
   * the global PCR summary stage
   *
   * features that may be relevant are `displayCompleteForm` and `allowSubmit`
   * @see `usePcrSummary` hook
   */

  return (
    <WithScrollToTopOnPropChange propToScrollOn={workflow?.getCurrentStepName()}>
      <Summary />
    </WithScrollToTopOnPropChange>
  );
};

const Summary = () => {
  const { pcrItem, itemId, workflow } = usePcrWorkflowContext();
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);

  const workflowSummary = workflow?.getSummary();

  if (!workflowSummary) return null;

  if (!workflowSummary.summaryRender) {
    throw new Error(`pcr item workflow for ${workflow.getCurrentStepName()} is missing a migratedStepRender method`);
  }

  const SummaryComponent = workflowSummary.summaryRender;

  return <SummaryComponent />;
};
