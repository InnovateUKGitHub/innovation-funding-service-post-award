import React from "react";
import { PartnerDto, ProjectDto } from "../../../types";
import { TabItem, Tabs } from "../layout";
import {
  AllClaimsDashboardRoute,
  ClaimsDashboardRoute,
  ProjectDetailsRoute,
  ProjectForecastRoute,
  ViewForecastRoute
} from "../../containers";

interface Props {
  project: ProjectDto;
  partnerId?: string;
  currentRoute: string;
  partners: PartnerDto[];
}

export const ProjectNavigation: React.SFC<Props> = ({project, currentRoute, partnerId, partners}) => {
  const projectId = project.id;
  // TODO get partner from current user
  partnerId = partnerId || partners[0].id;

  const claimsLink = ClaimsDashboardRoute.getLink({ projectId, partnerId });
  const allClaimsLink = AllClaimsDashboardRoute.getLink({ projectId });
  const detailsLink = ProjectDetailsRoute.getLink({ id: projectId });
  const viewForecastLink = ViewForecastRoute.getLink({ projectId, partnerId });
  const projectForecastsLink = ProjectForecastRoute.getLink({ projectId });

  const claimsTab = {text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute};
  const allClaimsTab = {text: "All Claims", route: allClaimsLink, selected: allClaimsLink.routeName === currentRoute};
  const forecastTab = {text: "Forecast", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute};
  const allForecastsTab = {text: "All Forecasts", route: projectForecastsLink, selected: ProjectForecastRoute.routeName === currentRoute};
  const changeRequestsTab = {text: "Project change requests", url: "#"};
  const projectDetailsTab = {text: "Project details", route: detailsLink, selected: detailsLink.routeName === currentRoute};

  const navigationTabs: TabItem[] = [
    claimsTab,
    allClaimsTab,
    forecastTab,
    allForecastsTab,
    changeRequestsTab,
    projectDetailsTab,
  ];

  return <Tabs tabList={navigationTabs} qa="project-navigation" />;
};
