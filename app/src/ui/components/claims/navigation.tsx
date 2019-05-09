import React from "react";
import * as ACC from "../";
import { ClaimsDetailsRoute } from "../../containers";
import { ProjectDto, ProjectRole } from "@framework/types";
import { ClaimLogRoute } from "@ui/containers/claims/logs";

interface Props {
  project: ProjectDto;
  partnerId: string;
  periodId: number;
  currentRouteName: string;
}

export const Navigation: React.SFC<Props> = ({ project, partnerId, periodId, currentRouteName }) => {
  const detialsLink = ClaimsDetailsRoute.getLink({ projectId: project.id, partnerId, periodId });
  const tabs: ACC.TabItem[] = [
    { text: "Details", route: detialsLink, selected: detialsLink.routeName === currentRouteName }
  ];

  const isMO = !!(project.roles & ProjectRole.MonitoringOfficer);
  if (isMO) {
    const logLink = ClaimLogRoute.getLink({ projectId: project.id, partnerId, periodId });
    tabs.push({ text: "Log", route: logLink, selected: logLink.routeName === currentRouteName });
  }

  return <ACC.Tabs tabList={tabs}/>;
};
