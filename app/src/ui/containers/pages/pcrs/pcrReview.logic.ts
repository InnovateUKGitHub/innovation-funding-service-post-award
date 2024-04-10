import { useLazyLoadQuery } from "react-relay";
import { PcrReviewQuery } from "./__generated__/PcrReviewQuery.graphql";
import { pcrReviewQuery } from "./PcrReview.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToPcrStatusDtoArray } from "@gql/dtoMapper/mapPcrStatus";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";
import { clientsideApiClient } from "@ui/apiClient";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { useRoutes } from "@ui/redux/routesProvider";
import { PcrReviewSchemaType } from "./pcrReview.zod";
import { PCRStatus } from "@framework/constants/pcrConstants";

export const usePcrReviewQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<PcrReviewQuery>(pcrReviewQuery, { projectId, pcrId }, { fetchPolicy: "network-only" });
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["status", "typeOfAid", "projectNumber", "title", "roles"]);

  const pcr = mapToPcrDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [],
    ["id", "status", "reasoningStatus", "requestNumber", "comments"],
    ["id", "status", "type", "typeOfAid", "shortName", "typeName"],
    { typeOfAid: project.typeOfAid },
  ).find(x => x.id === pcrId);

  if (!pcr) throw new Error("Failed to find a matching PCR");

  const editableItemTypes = getEditableItemTypes(pcr);
  const statusChanges = mapToPcrStatusDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
    [
      "id",
      "pcrId",
      "createdBy",
      "createdDate",
      "newStatus",
      "previousStatus",
      "newStatusLabel",
      "comments",
      "participantVisibility",
    ],
    { roles: project.roles },
  );

  return { project, pcr, statusChanges, fragmentRef: data?.salesforce?.uiapi, editableItemTypes };
};

export const useOnUpdatePcrReview = (
  pcrId: PcrId,
  projectId: ProjectId,
  pcr: Pick<PCRDto, "status" | "id"> & { items: Pick<FullPCRItemDto, "id" | "shortName" | "status" | "type">[] },
) => {
  const routes = useRoutes();
  const navigate = useNavigate();

  return useOnUpdate<PcrReviewSchemaType, PCRDto>({
    req(data) {
      const payload = {
        projectId,
        id: pcrId,
        pcr: {
          ...pcr,
          ...data,
          projectId,
          pcrId,
          items: pcr.items.map(x => ({ ...x, projectId })),
          status: parseInt(data.status, 10) as PCRStatus,
        },
      };

      console.log("updating", data);
      return clientsideApiClient.pcrs.update(payload);
    },
    onSuccess() {
      navigate(routes?.pcrsDashboard?.getLink({ projectId }).path);
    },
  });
};
