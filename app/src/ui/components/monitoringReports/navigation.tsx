import React from "react";
import * as ACC from "../";
import { MonitoringReportLogRoute, MonitoringReportPrepareRoute, MonitoringReportViewRoute } from "@ui/containers";
import { State } from "router5";
import { connect } from "react-redux";
import { RootState } from "@framework/ui/redux";

interface Props {
  projectId: string;
  id: string;
}

interface Data {
  currentRoute: State;
}

export const NavigationComponent: React.FunctionComponent<Props & Data> = (props) => {
  const detailsTabText = "Questions";
  const logTabText = "Log";

  const { id, projectId } = props;
  const action: "details" | "prepare" = props.currentRoute.params.action;

  const tabs: ACC.TabItem[] = [];

  if (props.currentRoute.name === MonitoringReportViewRoute.routeName || (props.currentRoute.name === MonitoringReportLogRoute.routeName && action === "details")) {
    tabs.push({
      text: detailsTabText,
      selected: props.currentRoute.name === MonitoringReportViewRoute.routeName,
      route: MonitoringReportViewRoute.getLink({ id, projectId })
    });

    tabs.push({
      text: logTabText,
      selected: props.currentRoute.name === MonitoringReportLogRoute.routeName,
      route: MonitoringReportLogRoute.getLink({ id, projectId, action: "details" })
    });
  }
  else if (props.currentRoute.name === MonitoringReportPrepareRoute.routeName || (props.currentRoute.name === MonitoringReportLogRoute.routeName && action === "prepare")) {
    tabs.push({
      text: detailsTabText,
      selected: props.currentRoute.name === MonitoringReportPrepareRoute.routeName,
      route: MonitoringReportPrepareRoute.getLink({ id, projectId })
    });

    tabs.push({
      text: logTabText,
      selected: props.currentRoute.name === MonitoringReportLogRoute.routeName,
      route: MonitoringReportLogRoute.getLink({ id, projectId, action: "prepare" })
    });
  }

  return <ACC.Tabs tabList={tabs} />;
};

export const Navigation = connect<Data, {}, Props, RootState>(state => {
  return {
    currentRoute: state.router.route!
  };
})(NavigationComponent);
