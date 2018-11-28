import React from "react";
import {TabItem, Tabs} from "../layout";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute, ProjectDetailsRoute, ProjectForecastRoute, ViewForecastRoute } from "../../containers";
import { ProjectDto } from "../../../types";

interface Props {
  project: ProjectDto;
  partnerId?: string;
  currentRoute: string;
  partners: PartnerDto[];
}

export const ProjectNavigation: React.SFC<Props> = ({project, currentRoute, partnerId, partners}) => {
  const projectId = project.id;
  partnerId = partnerId || partners[0].id;

  const claimsLink = ClaimsDashboardRoute.getLink({ projectId, partnerId });
  const allClaimsLink = AllClaimsDashboardRoute.getLink({ projectId });
  const detailsLink = ProjectDetailsRoute.getLink({ id: projectId });
  const viewForecastLink = ViewForecastRoute.getLink({ projectId, partnerId, periodId: project.periodId });
  const projectForecastsLink = ProjectForecastRoute.getLink({ projectId });

  const navigationTabs: TabItem[] = [
    {text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute},
    {text: "All Claims", route: allClaimsLink, selected: allClaimsLink.routeName === currentRoute},
    {text: "Forecasts", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute},
    {text: "All Forecasts", route: projectForecastsLink, selected: ProjectForecastRoute.routeName === currentRoute},
    {text: "Project change requests", url: "#"},
    {text: "Project details", route: detailsLink, selected: detailsLink.routeName === currentRoute},
  ];

  return <Tabs tabList={navigationTabs}/>;
};
