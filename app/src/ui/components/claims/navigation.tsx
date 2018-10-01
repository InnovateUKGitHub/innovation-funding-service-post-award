import React from "react";
import * as ACC from "../";
import { routeConfig } from "../../routing";

interface Props {
    projectId: string;
    partnerId: string;
    periodId: number;
    currentRouteName: string;
}

export const Navigation: React.SFC<Props> = (props) => {
    const detialsLink =  routeConfig.claimDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId });
    const tabs: ACC.TabItem[] = [
        { text: "Details", route: detialsLink, selected: detialsLink.routeName === props.currentRouteName },
        { text: "Activity", url: "#" },
        { text: "Messages", url: "#" },
    ];

    return <ACC.Tabs tabList={tabs} />;
};
