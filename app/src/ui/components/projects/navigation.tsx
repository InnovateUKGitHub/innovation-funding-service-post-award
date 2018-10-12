import React from "react";
import * as Dtos from "../../models";
import {routeConfig} from "../../routing";
import {TabItem, Tabs} from "../layout";

interface Props {
  project: Dtos.ProjectDto;
  partnerId?: string;
  currentRoute: string;
  partners: Dtos.PartnerDto[];
}

export const ProjectNavigation: React.SFC<Props> = ({project, currentRoute, partnerId, partners}) => {
  const claimsLink = routeConfig.claimsDashboard.getLink({projectId: project.id, partnerId: partnerId || partners.map(x => x.id)[0]});
  const detailsLink = routeConfig.projectDetails.getLink({id: project.id});
  const viewForecastLink = routeConfig.viewForecast.getLink({projectId: project.id, partnerId: partnerId || partners.map(x => x.id)[0], periodId: project.periodId});

  const navigationTabs: TabItem[] = [
    {text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute},
    {text: "Forecasts", route: viewForecastLink, selected: viewForecastLink.routeName === currentRoute},
    {text: "Project change requests", url: "#"},
    {text: "Project details", route: detailsLink, selected: detailsLink.routeName === currentRoute},
  ];

  return <Tabs tabList={navigationTabs}/>;
};
