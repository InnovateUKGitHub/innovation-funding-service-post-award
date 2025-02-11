import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { ProjectChangeRequestPrepareQuery } from "./__generated__/ProjectChangeRequestPrepareQuery.graphql";
import { pcrPrepareQuery } from "./ProjectChangeRequestPrepare.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToPcrStatusDtoArray } from "@gql/dtoMapper/mapPcrStatus";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { clientsideApiClient } from "@ui/apiClient";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ProjectDto } from "@framework/dtos/projectDto";
import { useRoutes } from "@ui/context/routesProvider";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";
import { z } from "zod";
import { PcrPrepareSchema } from "./projectChangeRequestPrepare.zod";

export const usePCRPrepareQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<ProjectChangeRequestPrepareQuery>(
    pcrPrepareQuery,
    { projectId, pcrId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["id", "typeOfAid", "roles", "monitoringLevel", "competitionType"]);

  const pcr = mapToPcrDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [],
    ["id", "status", "reasoningStatus", "requestNumber", "comments"],
    [
      "accountName",
      "hasOtherFunding",
      "id",
      "isCommercialWork",
      "organisationName",
      "organisationType",
      "partnerNameSnapshot",
      "partnerType",
      "projectRole",
      "shortName",
      "status",
      "type",
      "typeName",
      "typeOfAid",
    ],
    { typeOfAid: project.typeOfAid },
  ).find(x => x.id === pcrId);

  if (!pcr) throw new Error("Failed to find a matching PCR");

  const pcrs = mapToPcrDtoArray(
    data.salesforce.uiapi.query.OtherPCRs?.edges ?? [],
    ["id", "status"],
    ["id", "type"],
    {},
  );

  const numberOfPartners = projectNode?.Acc_ProjectParticipantsProject__r?.totalCount ?? 0;
  const isMultipleParticipants = numberOfPartners > 0;

  const statusChanges = mapToPcrStatusDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
    ["id", "pcrId", "createdBy", "createdDate", "newStatus", "previousStatus", "newStatusLabel", "comments"],
    { roles: project.roles },
  );

  const editableItemTypes = getEditableItemTypes(pcr);

  return {
    project,
    pcr,
    pcrs,
    editableItemTypes,
    statusChanges,
    isMultipleParticipants,
    numberOfPartners,
    fragmentRef: data.salesforce.uiapi,
  };
};

export const useOnUpdatePcrPrepare = (pcrId: PcrId, project: Pick<ProjectDto, "monitoringLevel" | "id">) => {
  const routes = useRoutes();
  const navigate = useNavigate();
  const projectId = project.id;
  return useOnUpdate<z.output<PcrPrepareSchema>, boolean>({
    req(data) {
      return clientsideApiClient.pcrs.submitPcr({
        projectId,
        pcrId,
        pcr: { ...data, monitoringLevel: project.monitoringLevel },
      });
    },
    onSuccess(data) {
      if (data.button_submit === "submit") {
        navigate(routes.projectChangeRequestSubmittedForReview.getLink({ projectId, pcrId }).path);
      }

      if (data.button_submit === "save-and-return") {
        navigate(routes.pcrsDashboard.getLink({ projectId }).path);
      }
    },
  });
};
