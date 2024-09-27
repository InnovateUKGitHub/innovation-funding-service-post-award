import { useLazyLoadQuery } from "react-relay";
import { projectSetupSpendProfileQuery } from "./ProjectSetupSpendProfile.query";
import { ProjectSetupSpendProfileQuery } from "./__generated__/ProjectSetupSpendProfileQuery.graphql";

const useProjectSetupSpendProfileData = ({ partnerId, projectId }: { partnerId: PartnerId; projectId: ProjectId }) => {
  const data = useLazyLoadQuery<ProjectSetupSpendProfileQuery>(
    projectSetupSpendProfileQuery,
    { partnerId, projectId },
    { fetchPolicy: "network-only" },
  );

  return {
    fragmentRef: data?.salesforce.uiapi,
  };
};

export { useProjectSetupSpendProfileData };
