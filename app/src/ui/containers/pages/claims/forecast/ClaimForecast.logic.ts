import { useLazyLoadQuery } from "react-relay";
import { claimForecastQuery } from "./ClaimForecast.query";
import { ClaimForecastQuery } from "./__generated__/ClaimForecastQuery.graphql";

const useClaimForecastData = ({
  projectParticipantId,
  projectId,
}: {
  projectParticipantId: PartnerId;
  projectId: ProjectId;
}) => {
  const data = useLazyLoadQuery<ClaimForecastQuery>(
    claimForecastQuery,
    { projectParticipantId, projectId },
    { fetchPolicy: "network-only" },
  );

  return {
    fragmentRef: data.salesforce.uiapi,
  };
};

export { useClaimForecastData };
