import { useMemo } from "react";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";

export const useNextLink = () => {
  const { projectId, pcrId, itemId, workflow, routes } = usePcrWorkflowContext();

  return useMemo(() => {
    const nextStep = workflow.getNextStepInfo();

    return routes.pcrPrepareItem.getLink({
      projectId,
      pcrId,
      itemId,
      step: nextStep?.stepNumber,
    });
  }, [projectId, pcrId, itemId, routes, workflow]);
};
