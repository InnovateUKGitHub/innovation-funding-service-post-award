import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { PcrItemWorkflowQuery } from "./__generated__/PcrItemWorkflowQuery.graphql";
import { pcrItemWorkflowQuery } from "./PcrItemWorkflow.query";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useNavigate } from "react-router-dom";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { Dispatch, SetStateAction } from "react";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { useMessageContext } from "@ui/context/messages";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export const usePcrItemWorkflowQuery = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcrItemId: PcrItemId,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<PcrItemWorkflowQuery>(
    pcrItemWorkflowQuery,
    { projectId, pcrId, pcrItemId },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["status", "typeOfAid"]);

  const { node: pcrNode } = getFirstEdge(projectNode?.Project_Change_Requests__r?.edges);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "id",
      "shortName",
      "type",
      "projectRole",
      "partnerType",
      "isCommercialWork",
      "typeOfAid",
      "organisationType",
      "hasOtherFunding",
      "guidance",
      "status",
      "typeName",
    ],
    { typeOfAid: project.typeOfAid },
  );

  return { project, pcrItem, fragmentRef: data?.salesforce?.uiapi };
};

const createMinimalPcrUpdateDto = ({
  projectId,
  pcrId,
  pcrItemId,
  data,
}: {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
  data: Partial<FullPCRItemDto>;
}) => {
  return {
    id: pcrId,
    projectId,
    items: [
      {
        id: pcrItemId,
        ...data,
      },
    ],
  };
};

export const useOnSavePcrItem = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcrItemId: PcrItemId,
  setFetchKey: Dispatch<SetStateAction<number>>,
  refreshItemWorkflowQuery: () => Promise<void>,
  step: number | undefined,
) => {
  const navigate = useNavigate();

  const { clearMessages } = useMessageContext();
  return useOnUpdate<Partial<FullPCRItemDto>, PCRDto, { link: ILinkInfo }>({
    req: data => {
      return clientsideApiClient.pcrs.update({
        projectId,
        id: pcrId,
        pcr: createMinimalPcrUpdateDto({
          projectId,
          pcrId,
          pcrItemId,
          data: { ...data, ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}) },
        }),
      });
    },
    onSuccess: async (_, __, context) => {
      await refreshItemWorkflowQuery();
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
