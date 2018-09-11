import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectOverviewPage, tabListArray } from "../../components/projectOverview";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import { ProjectDto } from "../../models";

interface Params {
    projectId: string;
}

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
}

export class ClaimsDashboardComponent extends ContainerBase<Params, Data, {}> {

    // ultimatly will come from navigation
    private selectedTab = tabListArray[0];

    render() {
        const Loading = ACC.Loading.forData(this.props.projectDetails);
        return <Loading.Loader render={(x) => this.renderContents(x)} />;
    }

    renderContents(project: ProjectDto) {
        return (
            <ProjectOverviewPage selectedTab={this.selectedTab} project={project}>
                Sections go here
            </ProjectOverviewPage>
        );
    }
}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDashboardComponent);

export const ClaimsDashboard = definition.connect({
    withData: (store, params) => ({
        id: params.projectId,
        projectDetails: Pending.create(store.data.project[params.projectId])
    }),
    withCallbacks: () => ({})
});

export const ClaimsDashboardRoute = definition.route({
    routeName: "claimDashboard",
    routePath: "/project/claims/:id",
    getParams: (route) => ({projectId: route.params.projectId}),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId)
    ],
    container: ClaimsDashboard
});
