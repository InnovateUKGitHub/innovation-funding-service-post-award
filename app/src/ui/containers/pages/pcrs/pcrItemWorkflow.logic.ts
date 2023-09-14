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
import { useStores } from "@ui/redux/storesProvider";

export const usePcrItemWorkflowQuery = (projectId: ProjectId, pcrId: PcrId, pcrItemId: PcrItemId) => {
  const data = useLazyLoadQuery<PcrItemWorkflowQuery>(
    pcrItemWorkflowQuery,
    { projectId, pcrId, pcrItemId },
    { fetchPolicy: "network-only" },
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
) => {
  const navigate = useNavigate();
  const stores = useStores();
  return useOnUpdate<Partial<FullPCRItemDto>, PCRDto, { link: ILinkInfo }>({
    req: data => {
      return clientsideApiClient.pcrs.update({
        projectId,
        id: pcrId,
        pcr: createMinimalPcrUpdateDto({
          projectId,
          pcrId,
          pcrItemId,
          data,
        }),
      });
    },
    onSuccess: (_, __, context) => {
      stores.messages.clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
