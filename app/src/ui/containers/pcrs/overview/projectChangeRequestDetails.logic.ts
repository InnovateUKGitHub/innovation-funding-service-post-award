import { useLazyLoadQuery } from "react-relay";
import { ProjectChangeRequestDetailsQuery } from "./__generated__/ProjectChangeRequestDetailsQuery.graphql";
import { pcrDetailsQuery } from "./ProjectChangeRequestDetails.query";
import { mapToProjectDto } from "@gql/dtoMapper";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { PCRItemType } from "@framework/types";
import { mapToPcrStatusDtoArray } from "@gql/dtoMapper/mapPcrStatus";

export const usePCRDetailsQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<ProjectChangeRequestDetailsQuery>(pcrDetailsQuery, { projectId, pcrId });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["id", "title", "status", "projectNumber", "typeOfAid", "roles"]);

  const pcr = mapToPcrDtoArray(
    projectNode?.Project_Change_Requests__r?.edges ?? [],
    ["id", "status", "reasoningStatus", "requestNumber"],
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

  const statusChanges = mapToPcrStatusDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
    ["id", "pcrId", "createdBy", "createdDate", "newStatus", "previousStatus", "newStatusLabel", "comments"],
    { roles: project.roles },
  );
  const nonEditableTypes: PCRItemType[] = [PCRItemType.ProjectTermination];

  const editableItemTypes = pcr.items.map(x => x.type).filter(x => !nonEditableTypes.includes(x));

  return { project, pcr, editableItemTypes, statusChanges };
};
