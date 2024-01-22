import { useLazyLoadQuery } from "react-relay";
import { approveNewSubcontractorQuery } from "./ApproveNewSubcontractor.query";
import { ApproveNewSubcontractorQuery } from "./__generated__/ApproveNewSubcontractorQuery.graphql";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { getFirstEdge } from "@gql/selectors/edges";

interface UseApproveNewSubcontractorQueryProps {
  projectId: ProjectId;
  itemId: PcrItemId;
  fetchKey: number;
}

const useApproveNewSubcontractorQuery = ({ itemId, fetchKey }: UseApproveNewSubcontractorQueryProps) => {
  const data = useLazyLoadQuery<ApproveNewSubcontractorQuery>(
    approveNewSubcontractorQuery,
    { pcrItemId: itemId },
    { fetchPolicy: "network-only", fetchKey },
  );

  const pcrItem = mapPcrItemDto(
    getFirstEdge(data.salesforce.uiapi.query.Acc_ProjectChangeRequest__c?.edges ?? []).node,
    [
      "subcontractorName",
      "subcontractorRegistrationNumber",
      "subcontractorRelationship",
      "subcontractorRelationshipJustification",
      "subcontractorLocation",
      "subcontractorDescription",
      "subcontractorCost",
      "subcontractorJustification",
      "status",
      "type",
    ],
    {},
  );

  return { pcrItem };
};

export { useApproveNewSubcontractorQuery };
