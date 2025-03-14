import { FetchPolicy, useLazyLoadQuery } from "react-relay";
import { forecastTileQuery } from "./ForecastTile.query";
import { ForecastTileQuery } from "./__generated__/ForecastTileQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useRoutes } from "@ui/context/routesProvider";
import { ForecastPageSchema } from "./forecastPage.zod";
import { clientsideApiClient } from "@ui/apiClient";

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

  const projectNode = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges ?? [])?.node;
  const partnerNode = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [])?.node;

  const project = mapToProjectDto(projectNode, ["isActive"]);
  const partner = mapToPartnerDto(partnerNode, ["name", "newForecastNeeded", "isWithdrawn", "partnerStatus"], {});

  return {
    project,
    partner,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

export const useOnUpdateForecast = ({
  projectId,
  partnerId,
  refresh,
}: {
  projectId: ProjectId;
  partnerId: PartnerId;
  refresh?: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<ForecastPageSchema>, boolean, null>({
    async req(data) {
      return await clientsideApiClient.forecastDetails.updateForecast({
        projectId,
        partnerId,
        forecast: data,
      });
    },
    async onSuccess() {
      await refresh?.();
      navigate(routes.viewForecast.getLink({ projectId, partnerId }).path);
    },
  });
};
