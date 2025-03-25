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
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { useMessageContext } from "@ui/context/messages";
import { PCRItemStatus, pcrItemTypes } from "@framework/constants/pcrConstants";
import { usePcrWorkflowContext } from "./pcrItemWorkflow";
import { z, ZodSchema } from "zod";
import { IPCRsApi } from "@server/apis/pcrs";

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

  const project = mapToProjectDto(projectNode, ["status", "typeOfAid", "isActive"]);

  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "id",
      "type",
      "projectRole",
      "partnerType",
      "isCommercialWork",
      "typeOfAid",
      "organisationType",
      "guidance",
      "status",
      "typeName",
    ],
    { typeOfAid: project.typeOfAid },
  );

  return { project, pcrItem, fragmentRef: data?.salesforce?.uiapi };
};

export const getDisplayName = (typeName: string) => {
  const matchedItemType = pcrItemTypes.find(x => x.typeName === typeName);

  if (matchedItemType && "displayName" in matchedItemType && typeof matchedItemType.displayName === "string") {
    return matchedItemType.displayName;
  } else {
    return typeName;
  }
};

type PcrApiParams<T extends ZodSchema> = {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
  pcr: z.output<T>;
};

type Updater<T extends ZodSchema> = (params: PcrApiParams<T>) => Promise<boolean>;

type AllowedMethods = Exclude<
  keyof IPCRsApi<"client">,
  | "update"
  | "create"
  | "inviteTeamMember"
  | "deleteTeamMember"
  | "replaceTeamMember"
  | "updateTeamMember"
  | "deleteProjectCost"
  | "delete"
>;

export const pcrUpdater = <T extends ZodSchema>(apiPath: AllowedMethods) => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<T>, boolean, { link: ILinkInfo }>({
    req: data => {
      return (clientsideApiClient.pcrs[apiPath] as Updater<T>)({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: data,
        ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
      });
    },

    onSuccess: async function (_: z.output<T>, __: boolean, context: { link: ILinkInfo } | undefined) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
