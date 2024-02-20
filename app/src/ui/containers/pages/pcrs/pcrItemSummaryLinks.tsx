import { PCRStepType } from "@framework/constants/pcrConstants";
import { usePcrWorkflowContext } from "./pcrItemWorkflow";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { PcrWorkflow } from "./pcrWorkflow";
import { BaseProps } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";

export const ViewLink = ({ stepName }: { stepName: PCRStepType }) => {
  const { mode, workflow, routes, projectId, pcrId, itemId } = usePcrWorkflowContext();
  const { getContent } = useContent();
  if (mode !== "review") return null;

  return (
    <Link replace route={getStepReviewLink(workflow, stepName, routes, projectId, pcrId, itemId)}>
      {getContent(x => x.pcrLabels.view)}
    </Link>
  );
};

export const EditLink = ({ stepName, disabled }: { stepName: PCRStepType; disabled?: boolean }) => {
  const { mode, workflow, routes, projectId, pcrId, itemId } = usePcrWorkflowContext();
  const { getContent } = useContent();

  if (mode !== "prepare") return null;

  return (
    <Link disabled={disabled} replace route={getStepLink(workflow, stepName, routes, projectId, pcrId, itemId)}>
      {getContent(x => x.pcrLabels.edit)}
    </Link>
  );
};

export const getStepLink = (
  workflow: Pick<PcrWorkflow, "findStepNumberByName">,
  stepName: string,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  pcrId: PcrId,
  itemId: PcrItemId,
) => {
  return routes.pcrPrepareItem.getLink({
    projectId,
    pcrId,
    itemId,
    step: workflow && workflow.findStepNumberByName(stepName),
  });
};

export const getStepReviewLink = (
  workflow: Pick<PcrWorkflow, "findStepNumberByName">,
  stepName: string,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  pcrId: PcrId,
  itemId: PcrItemId,
) => {
  return routes.pcrReviewItem.getLink({
    projectId,
    pcrId,
    itemId,
    step: workflow && workflow.findStepNumberByName(stepName),
  });
};
