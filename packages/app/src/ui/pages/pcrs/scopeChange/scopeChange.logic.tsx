import { useLazyLoadQuery } from "react-relay";
import { pcrScopeChangeWorkflowQuery } from "./PcrScopeChangeWorkflow.query";
import { PcrScopeChangeWorkflowQuery } from "./__generated__/PcrScopeChangeWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import {
  PcrScopeChangeProjectSummarySchemaType,
  PcrScopeChangePublicDescriptionSchemaType,
  PcrScopeChangeSchemaType,
} from "./scopeChange.zod";
import { useNavigate } from "react-router-dom";

export const useScopeChangeWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrScopeChangeWorkflowQuery>(
    pcrScopeChangeWorkflowQuery,
    {
      projectId,
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "endDate", "startDate"]);

  const { node: pcrNode } = getFirstEdge(projectNode?.Project_Change_Requests__r?.edges ?? []);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "id",
      "lastUpdated",
      "projectId",
      "requestNumber",
      "started",
      "status",
      "statusName",
      "projectSummary",
      "projectSummarySnapshot",
      "publicDescription",
      "publicDescriptionSnapshot",
      "type",
    ],
    {},
  );

  return { project, pcrItem };
};

export type ScopeChangeSchemaType<T extends "summary" | "description" | "projectSummary"> = T extends "projectSummary"
  ? z.output<PcrScopeChangeProjectSummarySchemaType>
  : T extends "description"
    ? z.output<PcrScopeChangePublicDescriptionSchemaType>
    : z.output<PcrScopeChangeSchemaType>;

export const useOnUpdateScopeChange = <T extends "summary" | "description" | "projectSummary">() => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<ScopeChangeSchemaType<T>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.scopeChange({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (_: ScopeChangeSchemaType<T>, __: boolean, context: { link: ILinkInfo } | undefined) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
