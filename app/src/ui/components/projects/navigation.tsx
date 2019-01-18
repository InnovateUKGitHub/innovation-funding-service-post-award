import React from "react";
import { PartnerDto, ProjectDto, ProjectRole } from "../../../types";
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
  currentRoute: string;
  partners: PartnerDto[];
}

export const ProjectNavigation: React.SFC<Props> = ({ project, currentRoute, partners }) => {

  const projectId = project.id;
  const partnerId = partners.filter(x => x.roles & ProjectRole.FinancialContact).map(x => x.id)[0];

  // potential links
  const claimsLink = ClaimsDashboardRoute.getLink({ projectId, partnerId });
  const allClaimsLink = AllClaimsDashboardRoute.getLink({ projectId });
  const detailsLink = ProjectDetailsRoute.getLink({ id: projectId });
  const viewForecastLink = ViewForecastRoute.getLink({ projectId, partnerId });
  const projectForecastsLink = ProjectForecastRoute.getLink({ projectId });

  // roles
  const isFC = !!(project.roles & ProjectRole.FinancialContact);
  const isMOorPM = !!(project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager));

  // add tabs conditionally
  const navigationTabs: TabItem[] = [];

  if(isFC && !isMOorPM) {
    navigationTabs.push({ text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute });
    navigationTabs.push({ text: "Forecast", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute });
  }
  else if (isMOorPM) {
    navigationTabs.push({ text: "All Claims", route: allClaimsLink, selected: allClaimsLink.routeName === currentRoute });
    navigationTabs.push({ text: "All Forecasts", route: projectForecastsLink, selected: projectForecastsLink.routeName === currentRoute });
  }

  navigationTabs.push({ text: "Project change requests", url: "#" });
  navigationTabs.push({ text: "Project details", route: detailsLink, selected: detailsLink.routeName === currentRoute });

  return <Tabs tabList={navigationTabs} qa="project-navigation" />;
};
