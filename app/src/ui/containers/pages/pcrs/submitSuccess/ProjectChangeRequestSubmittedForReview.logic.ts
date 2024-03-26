import { useLazyLoadQuery } from "react-relay";
import { projectChangeRequestSubmittedForReviewQuery } from "./ProjectChangeRequestSubmittedForReview.query";
import { ProjectChangeRequestSubmittedForReviewQuery } from "./__generated__/ProjectChangeRequestSubmittedForReviewQuery.graphql";
import { mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";
import { getDefinedEdges, getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

interface UseProjectChangeRequestSubmittedForReviewQueryProps {
  projectId: ProjectId;
  pcrId: PcrId;
}

const useProjectChangeRequestSubmittedForReviewQuery = ({
  projectId,
  pcrId,
}: UseProjectChangeRequestSubmittedForReviewQueryProps) => {
  const data = useLazyLoadQuery<ProjectChangeRequestSubmittedForReviewQuery>(
    projectChangeRequestSubmittedForReviewQuery,
    { projectId, pcrId },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges ?? []).node, [
    "title",
    "projectNumber",
    "isActive",
  ]);

  const pcr = mapToPcrDto(
    {
      head: getFirstEdge(data.salesforce.uiapi.query.Acc_ProjectChangeRequest__c?.edges ?? []).node,
      children: getDefinedEdges(
        getFirstEdge(data.salesforce.uiapi.query.Acc_ProjectChangeRequest__c?.edges ?? []).node
          .Acc_Project_Change_Requests__r?.edges,
      ).map(x => x.node),
    },
    ["requestNumber", "status", "lastUpdated", "started"],
    ["type", "id"],
    {},
  );

  return { project, pcr };
};

export { useProjectChangeRequestSubmittedForReviewQuery };
