import React from "react";
import * as ACC from "..";
import * as Dtos from "../../models";
import { routeConfig } from "../../routing";
import { Tabs, TabItem } from "../layout";

interface Props {
    project: Dtos.ProjectDto;
    currentRoute: string;
}

const renderItem = (item: { text: string, link: ILinkInfo|null }, isCurrent: boolean) => {
    if (item.link) {
        return <ACC.Link route={item.link} className="govuk-tabs__tab" selected={isCurrent}>{item.text}</ACC.Link>;
    }
    return <a href="#" className="govuk-tabs__tab">{item.text}</a>;
}

export const ProjectNavigation: React.SFC<Props> = ({ project, currentRoute }) => {
    const claimsLink = routeConfig.claimsDashboard.getLink({ projectId: project.id });
    const detailsLink = routeConfig.projectDetails.getLink({ id: project.id });

    const navigationTabs : TabItem[] = [
        { text: "Claims", route: claimsLink, selected: claimsLink.routeName === currentRoute },
        { text: "Project change requests", url: "#" },
        { text: "Forecasts", url: "#" },
        { text: "Project details", route:detailsLink, selected: detailsLink.routeName === currentRoute },
    ];

    return (
        <Tabs tabList={navigationTabs}/>
    );
};
