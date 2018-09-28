import * as Containers from "../containers";

export type RouteKeys = keyof typeof routeConfig;

export const routeConfig = {
  home: Containers.HomeRoute,
  projectDashboard: Containers.ProjectDashboardRoute,
  projectDetails: Containers.ProjectDetailsRoute,
  contacts: Containers.ContactListRoute,
  claimsDashboard: Containers.ClaimsDashboardRoute,
  claimDetails: Containers.ClaimsDetailsRoute,
  claimCostForm: Containers.ClaimLineItemsRoute,
  prepareClaim: Containers.PrepareClaimRoute,
  claimForecast: Containers.ClaimForecastRoute,
  // error: errorRoute
};
