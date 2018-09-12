import React from "react";
import * as ACC from "../";
import { routeConfig } from "../../routing";

interface Props {
    claimId: string;
    projectId: string;
    currentRouteName: string;
}

export const Navigation: React.SFC<Props> = (props) => {
    const detialsLink =  routeConfig.claimDetails.getLink({ claimId: props.claimId, projectId: props.projectId });
    const tabs: ACC.TabItem[] = [
        { text: "Details", route: detialsLink, selected: detialsLink.routeName === props.currentRouteName },
        { text: "Activity", url: "#" },
        { text: "Messages", url: "#" },
    ];

    return <ACC.Tabs tabList={tabs} />;
};
