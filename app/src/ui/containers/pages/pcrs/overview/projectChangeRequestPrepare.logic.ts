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
  ]);

  const pcr = mapToPcrDtoArray(
    projectNode?.Project_Change_Requests__r?.edges ?? [],
    ["id", "status", "reasoningStatus", "requestNumber", "projectId", "comments"],
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

  const isMultipleParticipants = (projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? []).length > 0;

  const statusChanges = mapToPcrStatusDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
    ["id", "pcrId", "createdBy", "createdDate", "newStatus", "previousStatus", "newStatusLabel", "comments"],
    { roles: project.roles },
  );

  const editableItemTypes = getEditableItemTypes(pcr);

  return { project, pcr, editableItemTypes, statusChanges, isMultipleParticipants };
};

export type FormValues = {
  comments: string;
  items: { [k: string]: string }[];
  reasoningStatus: string;
  button_submit: string;
};

const getPayload = (
  saveAndContinue: boolean,
  project: Pick<ProjectDto, "monitoringLevel">,
  pcr: Pick<PCRDto, "status" | "projectId" | "id">,
  data: Pick<FormValues, "comments">,
) => {
  const payload = { ...pcr, comments: data.comments };
  if (saveAndContinue) {
    switch (pcr.status) {
      case PCRStatus.Draft:
      case PCRStatus.QueriedByMonitoringOfficer:
        if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          payload.status = PCRStatus.SubmittedToInnovateUK;
        } else {
          payload.status = PCRStatus.SubmittedToMonitoringOfficer;
        }
        break;
      case PCRStatus.QueriedByInnovateUK:
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
  projectId: ProjectId,
  pcrId: PcrId,
  pcr: Pick<PCRDto, "status" | "id" | "projectId">,
  project: Pick<ProjectDto, "monitoringLevel">,
) => {
  const routes = useRoutes();
  const navigate = useNavigate();

  return useOnUpdate<FormValues, PCRDto>({
    req(data) {
      const payload = {
        projectId,
        id: pcrId,
        pcr: getPayload(data["button_submit"] === "submit", project, pcr, data),
      };

      return clientsideApiClient.pcrs.update(payload);
    },
    onSuccess() {
      navigate(routes.pcrsDashboard.getLink({ projectId }).path);
    },
  });
};
