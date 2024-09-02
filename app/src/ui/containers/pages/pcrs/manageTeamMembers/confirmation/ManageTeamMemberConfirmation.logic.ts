import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMemberConfirmationQuery } from "./__generated__/ManageTeamMemberConfirmationQuery.graphql";
import { manageTeamMemberConfirmationQuery } from "./ManageTeamMemberConfirmation.query";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";

export const useManageTeamMemberConfirmationQuery = ({ projectId, pcrId }: { projectId: ProjectId; pcrId: PcrId }) => {
  const data = useLazyLoadQuery<ManageTeamMemberConfirmationQuery>(
    manageTeamMemberConfirmationQuery,
    { projectId, pcrId },
    {
      fetchPolicy: "network-only",
    },
  );

  const pcrGql = data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [];

  const pcr = mapPcrItemDto(
    pcrGql?.[0]?.node,
    ["requestNumber", "lastUpdated", "started", "status", "type", "typeName"],
    {},
  );

  return { data, fragmentRef: data.salesforce.uiapi, pcr };
};
