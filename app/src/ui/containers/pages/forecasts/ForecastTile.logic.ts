import { FetchPolicy, useLazyLoadQuery } from "react-relay";
import { forecastTileQuery } from "./ForecastTile.query";
import { ForecastTileQuery } from "./__generated__/ForecastTileQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";

export const useUpdateForecastData = ({
  projectId,
  partnerId,
  refreshedQueryOptions = {},
}: {
  projectId: ProjectId;
  partnerId: PartnerId;
  refreshedQueryOptions?: { fetchKey?: number; fetchPolicy?: FetchPolicy };
}) => {
  const data = useLazyLoadQuery<ForecastTileQuery>(
    forecastTileQuery,
    {
      projectId,
      partnerId,
    },
    refreshedQueryOptions,
  );

  const partnerNode = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [])?.node;

  const partner = mapToPartnerDto(partnerNode, ["name"], {});

  return {
    partner,
    fragmentRef: data?.salesforce?.uiapi,
  };
};
