import { mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMemberSummaryQuery } from "./__generated__/ManageTeamMemberSummaryQuery.graphql";
import { manageTeamMemberSummaryQuery } from "./ManageTeamMemberSummary.query";

const useManageTeamMemberSummaryQuery = ({ pcrId }: { pcrId: PcrId }) => {
  const data = useLazyLoadQuery<ManageTeamMemberSummaryQuery>(manageTeamMemberSummaryQuery, {
    pcrId,
  });

  const { node: pcrNode } = getFirstEdge(data?.salesforce.uiapi.query.Header?.edges ?? []);

  const pcr = mapToPcrDto(
    {
      head: pcrNode,
      children: [],
    },
    ["requestNumber", "reasoningComments"],
    [],
    {},
  );
  const pcrItemCount = pcrNode?.Acc_Project_Change_Requests__r?.totalCount ?? 0;

  return {
    pcr,
    pcrItemCount,
  };
};

export { useManageTeamMemberSummaryQuery };
