import { useLazyLoadQuery } from "react-relay";
import { ProjectChangeRequestDetailsQuery } from "./__generated__/ProjectChangeRequestDetailsQuery.graphql";
import { pcrDetailsQuery } from "./ProjectChangeRequestDetails.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToPcrStatusDtoArray } from "@gql/dtoMapper/mapPcrStatus";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";

export const usePCRDetailsQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<ProjectChangeRequestDetailsQuery>(
    pcrDetailsQuery,
    { projectId, pcrId },
    { fetchPolicy: "store-and-network" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["id", "title", "status", "projectNumber", "typeOfAid", "roles"]);

  const pcr = mapToPcrDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [],
    ["id", "status", "reasoningStatus", "requestNumber"],
    [
      "id",
      "accountName",
      "hasOtherFunding",
      "isCommercialWork",
      "organisationName",
      "organisationType",
      "partnerNameSnapshot",
      "partnerType",
      "projectRole",
      "status",
      "type",
      "typeOfAid",
    ],
    { typeOfAid: project.typeOfAid },
  ).find(x => x.id === pcrId);

  if (!pcr) throw new Error("Failed to find a matching PCR");

  const statusChanges = mapToPcrStatusDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
    ["id", "pcrId", "createdBy", "createdDate", "newStatus", "previousStatus", "newStatusLabel", "comments"],
    { roles: project.roles },
  );

  const editableItemTypes = getEditableItemTypes(pcr);

  return { project, pcr, editableItemTypes, statusChanges };
};
