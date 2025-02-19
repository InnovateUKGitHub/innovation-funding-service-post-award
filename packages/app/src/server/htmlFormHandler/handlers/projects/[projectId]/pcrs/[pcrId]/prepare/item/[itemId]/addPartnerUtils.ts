import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
  ProjectChangeRequestPrepareItemSearchParams,
} from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
import { isNil } from "lodash";

interface GetAddPartnerStepProps {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
  stepNumber?: string | number;
  toSummary?: boolean;
  context: IContext;
  nextStep: boolean;
  params?: ProjectChangeRequestPrepareItemSearchParams;
}

export const getAddPartnerStep = async ({
  projectId,
  pcrId,
  pcrItemId,
  stepNumber,
  toSummary,
  context,
  nextStep,
  params,
}: GetAddPartnerStepProps) => {
  const pcr = await context.runQuery(new GetPCRByIdQuery(projectId, pcrId));

  const item = pcr.items.find(x => x.id === pcrItemId);

  if (!item) throw new Error("Cannot find PCR item ID");

  const workflow = PcrWorkflow.getWorkflow(item, typeof stepNumber === undefined ? undefined : Number(stepNumber));

  const stepInfo = nextStep ? workflow?.getNextStepInfo() : workflow?.getCurrentStepInfo();

  if (!stepInfo) throw new Error("Cannot find next workflow step to navigate to");

  let url = PCRPrepareItemRoute.getLink({
    projectId: projectId,
    pcrId: pcrId,
    itemId: pcrItemId,
    step: toSummary ? undefined : stepInfo.stepNumber,
    ...params,
  }).path;

  return url;
};

export const getNextAddPartnerStep = (props: Omit<GetAddPartnerStepProps, "nextStep">) =>
  getAddPartnerStep({ ...props, nextStep: true });

export const updatePcrItem = async function ({
  params,
  context,
  data,
}: {
  params: ProjectChangeRequestPrepareItemParams;
  context: IContext;
  data: Partial<FullPCRItemDto>;
}) {
  await context.runCommand(
    new UpdatePCRCommand({
      projectId: params.projectId,
      projectChangeRequestId: params.pcrId,
      pcr: {
        projectId: params.projectId,
        id: params.pcrId,
        items: [
          {
            id: params.itemId,
            ...data,
            ...(!isNil(params.step) ? { status: PCRItemStatus.Incomplete } : {}),
          },
        ],
      },
    }),
  );
};
