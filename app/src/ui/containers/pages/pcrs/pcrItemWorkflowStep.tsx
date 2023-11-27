import { ForbiddenError } from "@shared/appError";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import WithScrollToTopOnPropChange from "@ui/features/scroll-to-top-on-prop-change";

export const WorkflowStep = () => {
  const { mode, workflow } = usePcrWorkflowContext();

  const currentStep = workflow.getCurrentStepInfo();

  if (!currentStep) throw Error("PCR step does not exist on this workflow.");

  if (mode === "review") {
    // When reviewing a pcr, the MO should only be able to visit pages which support read only.
    if (!currentStep.migratedReadonlyStepRender) throw new ForbiddenError();

    const ReadonlyCurrentStep = currentStep.migratedReadonlyStepRender;
    return <ReadonlyCurrentStep />;
  }

  if (!currentStep?.migratedStepRender) {
    throw new Error(
      `${currentStep.displayName} workflow does not have a matching migratedStepRender method on the config`,
    );
  }

  const CurrentStep = currentStep?.migratedStepRender;

  return (
    <WithScrollToTopOnPropChange propToScrollOn={workflow.getCurrentStepName()}>
      <CurrentStep />
    </WithScrollToTopOnPropChange>
  );
};
