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

// const x = {
//   form: "claimForecastSaveAndContinue",
//   profile: {
//     a0AAd00000OPNzEMAX: "20000",
//     a0AAd00000OPNzFMAX: "300000",
//     a0AAd00000OPNzGMAX: "400000",
//     a0AAd00000OPNzHMAX: "500000",
//     a0AAd00000OPNzIMAX: "600000",
//     a0AAd00000OPNzJMAX: "700000",
//     a0AAd00000OPNzKMAX: "800000",
//     a0AAd00000OPNzLMAX: "900000",
//     a0AAd00000OPNzMMAX: "1000000",
//     a0AAd00000OPNzNMAX: "110000",
//     a0AAd00000OPNzOMAX: "120000",
//     a0AAd00000OPNzcMAH: "200000",
//     a0AAd00000OPNzdMAH: "300000",
//     a0AAd00000OPNzeMAH: "400000",
//     a0AAd00000OPNzfMAH: "500000",
//     a0AAd00000OPNzgMAH: "600000",
//     a0AAd00000OPNzhMAH: "700000",
//     a0AAd00000OPNziMAH: "800000",
//     a0AAd00000OPNzjMAH: "900000",
//     a0AAd00000OPNzkMAH: "1000000",
//     a0AAd00000OPNzlMAH: "110000",
//     a0AAd00000OPNzmMAH: "120000",
//     a0AAd00000OPNzoMAH: "200000",
//     a0AAd00000OPNzpMAH: "300000",
//     a0AAd00000OPNzqMAH: "400000",
//     a0AAd00000OPNzrMAH: "500000",
//     a0AAd00000OPNzsMAH: "600000",
//     a0AAd00000OPNztMAH: "700000",
//     a0AAd00000OPNzuMAH: "800000",
//     a0AAd00000OPNzvMAH: "900000",
//     a0AAd00000OPNzwMAH: "1000000",
//     a0AAd00000OPNzxMAH: "110000",
//     a0AAd00000OPNzyMAH: "120000",
//     a0AAd00000OPNz2MAH: "200000",
//     a0AAd00000OPNz3MAH: "300000",
//     a0AAd00000OPNz4MAH: "400000",
//     a0AAd00000OPNz5MAH: "500000",
//     a0AAd00000OPNz6MAH: "600000",
//     a0AAd00000OPNz7MAH: "700000",
//     a0AAd00000OPNz8MAH: "800000",
//     a0AAd00000OPNz9MAH: "900000",
//     a0AAd00000OPNzAMAX: "1000000",
//     a0AAd00000OPNzBMAX: "110000",
//     a0AAd00000OPNzCMAX: "120000",
//     a0AAd00000OPO00MAH: "200000",
//     a0AAd00000OPO01MAH: "300000",
//     a0AAd00000OPO02MAH: "400000",
//     a0AAd00000OPO03MAH: "500000",
//     a0AAd00000OPO04MAH: "600000",
//     a0AAd00000OPO05MAH: "700000",
//     a0AAd00000OPO06MAH: "800000",
//     a0AAd00000OPO07MAH: "900000",
//     a0AAd00000OPO08MAH: "1000000",
//     a0AAd00000OPO09MAH: "110000",
//     a0AAd00000OPO0AMAX: "120000",
//     a0AAd00000OPO0CMAX: "200000",
//     a0AAd00000OPO0DMAX: "300000",
//     a0AAd00000OPO0EMAX: "400000",
//     a0AAd00000OPO0FMAX: "500000",
//     a0AAd00000OPO0GMAX: "600000",
//     a0AAd00000OPO0HMAX: "700000",
//     a0AAd00000OPO0IMAX: "800000",
//     a0AAd00000OPO0JMAX: "900000",
//     a0AAd00000OPO0KMAX: "1000000",
//     a0AAd00000OPO0LMAX: "1100000",
//     a0AAd00000OPO0MMAX: "120000",
//     a0AAd00000OPO0OMAX: "200000",
//     a0AAd00000OPO0PMAX: "300000",
//     a0AAd00000OPO0QMAX: "400000",
//     a0AAd00000OPO0RMAX: "500000",
//     a0AAd00000OPO0SMAX: "600000",
//     a0AAd00000OPO0TMAX: "700000",
//     a0AAd00000OPO0UMAX: "800000",
//     a0AAd00000OPO0VMAX: "900000",
//     a0AAd00000OPO0WMAX: "1000000",
//     a0AAd00000OPO0XMAX: "1100000",
//     a0AAd00000OPO0YMAX: "120000",
//     a0AAd00000OPO0aMAH: "200000",
//     a0AAd00000OPO0bMAH: "300000",
//     a0AAd00000OPO0cMAH: "400000",
//     a0AAd00000OPO0dMAH: "500000",
//     a0AAd00000OPO0eMAH: "600000",
//     a0AAd00000OPO0fMAH: "700000",
//     a0AAd00000OPO0gMAH: "800000",
//     a0AAd00000OPO0hMAH: "900000",
//     a0AAd00000OPO0iMAH: "1000000",
//     a0AAd00000OPO0jMAH: "1100000",
//     a0AAd00000OPO0kMAH: "120000",
//     a0AAd00000OPO0mMAH: "200000",
//     a0AAd00000OPO0nMAH: "300000",
//     a0AAd00000OPO0oMAH: "400000",
//     a0AAd00000OPO0pMAH: "500000",
//     a0AAd00000OPO0qMAH: "600000",
//     a0AAd00000OPO0rMAH: "700000",
//     a0AAd00000OPO0sMAH: "800000",
//     a0AAd00000OPO0tMAH: "900000",
//     a0AAd00000OPO0uMAH: "1000000",
//     a0AAd00000OPO0vMAH: "1100000",
//     a0AAd00000OPO0wMAH: "120000",
//     a0AAd00000OPO0yMAH: "200000",
//     a0AAd00000OPO0zMAH: "300000",
//     a0AAd00000OPO10MAH: "400000",
//     a0AAd00000OPO11MAH: "500000",
//     a0AAd00000OPO12MAH: "600000",
//     a0AAd00000OPO13MAH: "700000",
//     a0AAd00000OPO14MAH: "800000",
//     a0AAd00000OPO15MAH: "900000",
//     a0AAd00000OPO16MAH: "1000000",
//     a0AAd00000OPO17MAH: "1100000",
//     a0AAd00000OPO18MAH: "120000",
//   },
//   submit: false,
//   total: 77236937.27,
//   totalGolCost: 79560000,
// };
