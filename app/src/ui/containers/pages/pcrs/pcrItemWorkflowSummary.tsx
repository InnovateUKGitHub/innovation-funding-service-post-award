import WithScrollToTopOnPropChange from "@ui/features/scroll-to-top-on-prop-change";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import { EditLink, ViewLink, getStepLink } from "./pcrItemSummaryLinks";

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
  const { pcrItem, itemId, workflow, projectId, pcrId, routes } = usePcrWorkflowContext();
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);

  const workflowSummary = workflow?.getMigratedSummary();

  if (!workflowSummary) return null;

  if (!workflowSummary.migratedSummaryRender) {
    throw new Error(`pcr item workflow for ${workflow.getCurrentStepName()} is missing a migratedStepRender method`);
  }

  const SummaryComponent = workflowSummary.migratedSummaryRender;

  return (
    <SummaryComponent
      getEditLink={stepName => <EditLink stepName={stepName} />}
      getStepLink={stepName => getStepLink(workflow, stepName, routes, projectId, pcrId, itemId)}
      getViewLink={stepName => <ViewLink stepName={stepName} />}
    />
  );

  // });
};
