import { mapPcrItemDto, mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMemberSummaryQuery } from "./__generated__/ManageTeamMemberSummaryQuery.graphql";
import { manageTeamMemberSummaryQuery } from "./ManageTeamMemberSummary.query";
import { mapToContactDto } from "@gql/dtoMapper/mapContactDto";

const useManageTeamMemberSummaryQuery = ({ pcrId, pcrItemId }: { pcrId: PcrId; pcrItemId: PcrItemId }) => {
  const data = useLazyLoadQuery<ManageTeamMemberSummaryQuery>(manageTeamMemberSummaryQuery, {
    pcrId,
    pcrItemId,
  });

  const { node: pcrNode } = getFirstEdge(data?.salesforce.uiapi.query.Header?.edges ?? []);
  const { node: itemNode } = getFirstEdge(data?.salesforce.uiapi.query.Item?.edges ?? []);

  const pcr = mapToPcrDto(
    {
      head: pcrNode,
      children: [],
    },
    ["requestNumber", "reasoningComments", "status"],
    [],
    {},
  );

  const pcrItem = mapPcrItemDto(
    itemNode,
    [
      "type",
      "manageTeamMemberAssociateStartDate",
      "manageTeamMemberRole",
      "manageTeamMemberEmail",
      "manageTeamMemberFirstName",
      "manageTeamMemberLastName",
      "manageTeamMemberType",
    ],
    {},
  );

  const pcl = mapToContactDto(itemNode.Acc_ProjectContactLink__r, [
    "id",
    "firstName",
    "lastName",
    "role",
    "endDate",
    "email",
  ]);

  const pcrItemCount = pcrNode?.Acc_Project_Change_Requests__r?.totalCount ?? 0;

  return {
    pcr,
    pcrItem,
    pcl,
    pcrItemCount,
  };
};

export { useManageTeamMemberSummaryQuery };
