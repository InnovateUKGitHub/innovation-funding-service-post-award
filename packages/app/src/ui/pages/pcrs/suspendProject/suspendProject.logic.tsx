import { useLazyLoadQuery } from "react-relay";
import { pcrSuspendProjectWorkflowQuery } from "./PcrSuspendProjectWorkflow.query";
import { PcrSuspendProjectWorkflowQuery } from "./__generated__/PcrSuspendProjectWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";
import { z } from "zod";
import { ProjectSuspensionSchema, ProjectSuspensionSummarySchema } from "./suspendProject.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export const usePcrSuspendProjectWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrSuspendProjectWorkflowQuery>(
    pcrSuspendProjectWorkflowQuery,
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

  const project = mapToProjectDto(projectNode, ["roles", "startDate", "endDate"]);

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
      "type",
      "suspensionEndDate",
      "suspensionStartDate",
    ],
    {},
  );

  return { project, pcrItem };
};

export const useOnUpdateSuspendProject = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<ProjectSuspensionSchema>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.suspendProject({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          suspensionStartDate_month: data.suspensionStartDate_month ?? "",
          suspensionStartDate_year: data.suspensionStartDate_year ?? "",
          suspensionEndDate_month: data.suspensionEndDate_month ?? "",
          suspensionEndDate_year: data.suspensionEndDate_year ?? "",
          suspensionStartDate: null,
          suspensionEndDate: null,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<ProjectSuspensionSchema>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};

export const useOnUpdateSuspendProjectSummary = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<ProjectSuspensionSummarySchema>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.suspendProject({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          suspensionStartDate_month: "",
          suspensionStartDate_year: "",
          suspensionEndDate_month: "",
          suspensionEndDate_year: "",
          projectStartDate: null,
          projectEndDate: null,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<ProjectSuspensionSummarySchema>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
