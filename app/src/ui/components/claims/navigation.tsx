import React from "react";
import * as ACC from "../";
import { ClaimLogRoute, ClaimsDetailsRoute, PrepareClaimRoute, ReviewClaimRoute } from "../../containers";
import { ProjectDto } from "@framework/types";
import { connect } from "react-redux";
import { RootState } from "@framework/ui/redux";
import { State } from "router5";

interface Props {
  project: ProjectDto;
  partnerId: string;
  periodId: number;
}

interface Data {
  currentRoute: State;
}

const NavigationComponent: React.SFC<Props & Data> = (props: Props & Data) => {

  const projectId = props.project.id;
  const partnerId = props.partnerId;
  const periodId = props.periodId;

  const detailsTabText = "Details";
  const logTabText = "Log";

  const action: "details" | "prepare" | "review" | undefined = props.currentRoute.params.action;

  const tabs: ACC.TabItem[] = [];

  if(props.currentRoute.name === ClaimsDetailsRoute.routeName || (props.currentRoute.name === ClaimLogRoute.routeName && action === "details")) {

    tabs.push({
      text: detailsTabText,
      selected: props.currentRoute.name === ClaimsDetailsRoute.routeName,
      route: ClaimsDetailsRoute.getLink({ projectId, partnerId, periodId })
    });

    tabs.push({
      text:logTabText,
      selected: props.currentRoute.name === ClaimLogRoute.routeName,
      route: ClaimLogRoute.getLink({ projectId, partnerId, periodId , action: "details" })
    });
  }
  else if(props.currentRoute.name === PrepareClaimRoute.routeName|| (props.currentRoute.name === ClaimLogRoute.routeName && action === "prepare")) {
    tabs.push({
      text: detailsTabText,
      selected: props.currentRoute.name === PrepareClaimRoute.routeName,
      route: PrepareClaimRoute.getLink({ projectId, partnerId, periodId })
    });

    tabs.push({
      text: logTabText,
      selected: props.currentRoute.name === ClaimLogRoute.routeName,
      route: ClaimLogRoute.getLink({ projectId, partnerId, periodId , action: "prepare" })
    });
  }
  else if(props.currentRoute.name === ReviewClaimRoute.routeName|| (props.currentRoute.name === ClaimLogRoute.routeName && action === "review")) {
    tabs.push({
      text: detailsTabText,
      selected: props.currentRoute.name === ReviewClaimRoute.routeName,
      route: ReviewClaimRoute.getLink({ projectId, partnerId, periodId })
    });

    tabs.push({
      text: logTabText,
      selected: props.currentRoute.name === ClaimLogRoute.routeName,
      route: ClaimLogRoute.getLink({ projectId, partnerId, periodId , action: "review" })
    });
  }

  return <ACC.Tabs tabList={tabs}/>;
};

export const Navigation = connect<Data, {}, Props, RootState>(state => {
 return {
  currentRoute: state.router.route!
 };
})(NavigationComponent);
