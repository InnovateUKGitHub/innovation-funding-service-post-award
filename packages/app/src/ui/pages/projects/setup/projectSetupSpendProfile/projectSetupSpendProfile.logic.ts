import { useLazyLoadQuery } from "react-relay";
import { projectSetupSpendProfileQuery } from "./ProjectSetupSpendProfile.query";
import { ProjectSetupSpendProfileQuery } from "./__generated__/ProjectSetupSpendProfileQuery.graphql";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { head } from "lodash";

const useProjectSetupSpendProfileData = ({ partnerId, projectId }: { partnerId: PartnerId; projectId: ProjectId }) => {
  const data = useLazyLoadQuery<ProjectSetupSpendProfileQuery>(
    projectSetupSpendProfileQuery,
    { partnerId, projectId },
    { fetchPolicy: "network-only" },
  );

  const partnerPage = head(
    mapToPartnerDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
      ["spendProfileStatus"],
      {},
    ),
  );

  return {
    partnerPage,
    fragmentRef: data?.salesforce.uiapi,
  };
};

export { useProjectSetupSpendProfileData };
