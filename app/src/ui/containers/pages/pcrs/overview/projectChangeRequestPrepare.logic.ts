import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { ProjectChangeRequestPrepareQuery } from "./__generated__/ProjectChangeRequestPrepareQuery.graphql";
import { pcrPrepareQuery } from "./ProjectChangeRequestPrepare.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToPcrStatusDtoArray } from "@gql/dtoMapper/mapPcrStatus";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { clientsideApiClient } from "@ui/apiClient";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { useRoutes } from "@ui/redux/routesProvider";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";

export const usePCRPrepareQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<ProjectChangeRequestPrepareQuery>(
    pcrPrepareQuery,
    { projectId, pcrId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, [
    "id",
    "title",
    "status",
    "projectNumber",
    "typeOfAid",
    "roles",
    "monitoringLevel",
    "competitionType",
    "isActive",
  ]);

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
    ["id", "type", "typeName", "shortName"],
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

  return { project, pcr, pcrs, editableItemTypes, statusChanges, isMultipleParticipants, numberOfPartners };
};

export type FormValues = {
  comments: string;
  items: { [k: string]: string }[];
  reasoningStatus: string;
  button_submit: string;
};

const getPayload = (
  saveAndContinue: boolean,
  project: Pick<ProjectDto, "monitoringLevel" | "id">,
  pcr: Pick<PCRDto, "status" | "id">,
  data: Pick<FormValues, "comments">,
) => {
  const payload = { ...pcr, comments: data.comments, projectId: project.id };
  if (saveAndContinue) {
    switch (pcr.status) {
      case PCRStatus.DraftWithProjectManager:
      case PCRStatus.QueriedByMonitoringOfficer:
        if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          payload.status = PCRStatus.SubmittedToInnovateUK;
        } else {
          payload.status = PCRStatus.SubmittedToMonitoringOfficer;
        }
        break;
      case PCRStatus.QueriedToProjectManager:
        payload.status = PCRStatus.SubmittedToInnovateUK;
        break;
      default:
        payload.status = pcr.status;
        break;
    }
  }

  return payload;
};

export const useOnUpdatePcrPrepare = (
  pcrId: PcrId,
  pcr: Pick<PCRDto, "status" | "id">,
  project: Pick<ProjectDto, "monitoringLevel" | "id">,
) => {
  const routes = useRoutes();
  const navigate = useNavigate();
  const { id: projectId } = project;

  return useOnUpdate<FormValues, PCRDto>({
    req(data) {
      const payload = {
        projectId,
        id: pcrId,
        pcr: getPayload(data.button_submit === "submit", project, pcr, data),
      };

      return clientsideApiClient.pcrs.update(payload);
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
