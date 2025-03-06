import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { claimForecastQuery } from "./ClaimForecast.query";
import { ClaimForecastQuery } from "./__generated__/ClaimForecastQuery.graphql";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useRoutes } from "@ui/context/routesProvider";
import { clientsideApiClient } from "@ui/apiClient";
import { z } from "zod";
import { ClaimForecastSchemaType } from "./ClaimForecast.zod";
import { FormTypes } from "@ui/zod/FormTypes";

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

export const useOnClaimForecastUpdate = ({
  projectId,
  partnerId,
  refresh,
  periodId,
  isPm,
}: {
  projectId: ProjectId;
  partnerId: PartnerId;
  refresh?: () => Promise<void>;
  periodId: PeriodId;
  isPm: boolean;
}) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<ClaimForecastSchemaType>, boolean, null>({
    async req(data) {
      return await clientsideApiClient.claims.updateForecast({
        projectId,
        partnerId,
        periodId,
        claim: data,
      });
    },
    async onSuccess(data) {
      await refresh?.();
      if (data.form === FormTypes.ClaimForecastSaveAndContinue) {
        navigate(routes.claimSummary.getLink({ projectId, partnerId, periodId: periodId ?? (0 as PeriodId) }).path);
      } else if (isPm) {
        navigate(routes.allClaimsDashboard.getLink({ projectId }).path);
      } else {
        navigate(routes.claimsDashboard.getLink({ projectId, partnerId }).path);
      }
    },
  });
};
