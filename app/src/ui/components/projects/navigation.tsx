import React from "react";
import * as Dtos from "../../models";
import {routeConfig} from "../../routing";
import {TabItem, Tabs} from "../layout";

interface Props {
  project: Dtos.ProjectDto;
  partnerId?: string;
  currentRoute: string;
}

// TODO STOP using this
const tempPartnerId = "a071w000000LOXWAA4";

export const ProjectNavigation: React.SFC<Props> = ({project, currentRoute, partnerId = tempPartnerId}) => {
  const claimsLink = routeConfig.claimsDashboard.getLink({projectId: project.id, partnerId});
  const detailsLink = routeConfig.projectDetails.getLink({id: project.id});

  const navigationTabs: TabItem[] = [
    {text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute},
    {text: "Forecasts", url: "#"},
    {text: "Project change requests", url: "#"},
    {text: "Project details", route: detailsLink, selected: detailsLink.routeName === currentRoute},
  ];

  return <Tabs tabList={navigationTabs}/>;
};
