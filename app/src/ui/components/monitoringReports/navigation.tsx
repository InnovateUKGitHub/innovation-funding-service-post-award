import React from "react";
import * as ACC from "../";
import { MonitoringReportLogRoute, MonitoringReportViewRoute } from "@ui/containers";

interface Props {
  projectId: string;
  id: string;
  currentRouteName: string;
}

export const Navigation: React.FunctionComponent<Props> = (props) => {
  const questionLink = MonitoringReportViewRoute.getLink({ projectId: props.projectId, id: props.id});
  const logLink = MonitoringReportLogRoute.getLink({ projectId: props.projectId, id: props.id});

  const tabs: ACC.TabItem[] = [
    { text: "Questions", route: questionLink, selected: questionLink.routeName === props.currentRouteName },
    { text: "Log", route: logLink, selected: logLink.routeName === props.currentRouteName }
  ];
  return <ACC.Tabs tabList={tabs} />;
};
