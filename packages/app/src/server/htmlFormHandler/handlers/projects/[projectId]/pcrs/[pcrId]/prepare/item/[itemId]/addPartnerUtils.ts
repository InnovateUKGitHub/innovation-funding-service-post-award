import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { PCRPrepareItemRoute } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow } from "@ui/pages/pcrs/pcrWorkflow";

export const getNextAddPartnerStep = async ({
  projectId,
  pcrId,
  pcrItemId,
  stepNumber,
  toSummary,
  context,
}: {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
  stepNumber?: string | number;
  toSummary?: boolean;
  context: IContext;
}) => {
  const pcr = await context.runQuery(new GetPCRByIdQuery(projectId, pcrId));

  const item = pcr.items.find(x => x.id === pcrItemId);

  if (!item) throw new Error("Cannot find PCR item ID");

  const workflow = PcrWorkflow.getWorkflow(item, typeof stepNumber === undefined ? undefined : Number(stepNumber));

  const nextInfo = workflow?.getNextStepInfo();

  if (!nextInfo) throw new Error("Cannot find next workflow step to navigate to");

  return PCRPrepareItemRoute.getLink({
    projectId: projectId,
    pcrId: pcrId,
    itemId: pcrItemId,
    step: toSummary ? undefined : nextInfo.stepNumber,
  }).path;
};
