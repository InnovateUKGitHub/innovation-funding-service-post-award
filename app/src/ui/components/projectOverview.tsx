import React, {ReactNode} from "react";
import * as ACC from "./index";
import { routeConfig } from "../routing/index";
import {ProjectDto} from "../models/index";

interface Props {
    project: ProjectDto;
    selectedTab: string;
    children: ReactNode;
}

export const tabListArray = ["Claims", "Project change requests", "Forecasts", "Project details"];

export const ProjectOverviewPage: React.SFC<Props> = ({project, selectedTab, children}) => (
            <ACC.Page>
                <ACC.Section qa="Project_members">
                    <ACC.BackLink route={routeConfig.projectDashboard}>Main dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Title title="View project" caption={`${project.projectNumber}:${project.title}`} />
                <ACC.Tabs tabList={tabListArray} selected={selectedTab} />
                {children}
            </ACC.Page>
        );
