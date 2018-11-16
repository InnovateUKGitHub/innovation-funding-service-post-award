import React from "react";
import {TabItem, Tabs} from "../layout";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute, ProjectDetailsRoute, ViewForecastRoute } from "../../containers";
import { ProjectDto } from "../../../types";

interface Props {
  project: ProjectDto;
  partnerId?: string;
  currentRoute: string;
  partners: PartnerDto[];
}

export const ProjectNavigation: React.SFC<Props> = ({project, currentRoute, partnerId, partners}) => {
  const claimsLink = ClaimsDashboardRoute.getLink({projectId: project.id, partnerId: partnerId || partners.map(x => x.id)[0]});
  const allClaimsLink = AllClaimsDashboardRoute.getLink({projectId: project.id});
  const detailsLink = ProjectDetailsRoute.getLink({id: project.id});
  const viewForecastLink = ViewForecastRoute.getLink({projectId: project.id, partnerId: partnerId || partners.map(x => x.id)[0], periodId: project.periodId});

  const navigationTabs: TabItem[] = [
    {text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute},
    {text: "All Claims", route: allClaimsLink, selected: allClaimsLink.routeName === currentRoute},
    {text: "Forecasts", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute},
    {text: "Project change requests", url: "#"},
    {text: "Project details", route: detailsLink, selected: detailsLink.routeName === currentRoute},
  ];

  return <Tabs tabList={navigationTabs}/>;
};
