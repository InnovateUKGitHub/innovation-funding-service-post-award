import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { claimForecastQuery } from "./ClaimForecast.query";
import { ClaimForecastQuery } from "./__generated__/ClaimForecastQuery.graphql";

const useClaimForecastData = ({ partnerId, projectId }: { partnerId: PartnerId; projectId: ProjectId }) => {
  const data = useLazyLoadQuery<ClaimForecastQuery>(
    claimForecastQuery,
    { partnerId, projectId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "numberOfPeriods", "roles"]);

  return {
    data,
    project,
    fragmentRef: data.salesforce.uiapi,
  };
};

export { useClaimForecastData };
