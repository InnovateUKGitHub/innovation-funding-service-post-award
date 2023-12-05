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

export const useSummaryLink = () => {
  const { projectId, pcrId, itemId, workflow, routes } = usePcrWorkflowContext();

  return useMemo(() => {
    return routes.pcrPrepareItem.getLink({
      projectId,
      pcrId,
      itemId,
      step: undefined,
    });
  }, [projectId, pcrId, itemId, routes, workflow]);
};

export const useLinks = () => {
  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();
  return (data: { button_submit: string }) => ({ link: data.button_submit === "submit" ? nextLink : summaryLink });
};
