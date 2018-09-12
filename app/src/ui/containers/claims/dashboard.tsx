import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Dtos from "../../models";
import * as Actions from "../../redux/actions/index";
import { routeConfig } from "../../routing";
import { ProjectOverviewPage } from "../../components/projectOverview";

interface Params {
    projectId: string;
}

interface Data {
    projectDetails: Pending<Dtos.ProjectDto>;
}

class Component extends ContainerBase<Params, Data, {}> {

    public render() {
        const Loading = ACC.Loading.forData(this.props.projectDetails);
        return <Loading.Loader render={(x) => this.renderContents(x)} />;
    }

    public renderContents(project: Dtos.ProjectDto) {
        return (
            <ProjectOverviewPage title="Claims" selectedTab={routeConfig.claimsDashboard.routeName} project={project}>
                Sections go here
            </ProjectOverviewPage>
        );
    }
}

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const ClaimsDashboard = definition.connect({
    withData: (state, params) => ({ projectDetails: Pending.create(state.data.project[params.projectId]) }),
    withCallbacks: () => ({})
});

export const ClaimsDashboardRoute = definition.route({
    routeName: "claimDetails",
    routePath: "/project/:projectId/claims",
    getParams: (route) => ({
        projectId: route.params.projectId,
    }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId)
    ],
    container: ClaimsDashboard
});
