import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {ProjectOverviewPage, tabListArray} from "../../components/projectOverview";
import {RootState} from "../../redux/reducers";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import {ProjectDto} from "../../models";
import {State} from "router5/create-router";

interface Data {
    projectId: string;
    partnerId: string;
    projectDetails: Pending<Dtos.ProjectDto>;
}

export class ClaimsDashboardComponent extends ContainerBase<Data, {}> {

    // ultimatly will come from navigation
    private selectedTab = tabListArray[0];

    public static getLoadDataActions(route: State) {

        const projectId = route.params && route.params.id;
        return [
            Actions.loadProject(projectId)
        ];
    }

    render() {
        const Loading = ACC.Loading.forData(this.props.projectDetails);
        return <Loading.Loader render={(x) => this.renderContents(x)}/>;
    }

    renderContents(project: ProjectDto) {
        return (
            <ProjectOverviewPage selectedTab={this.selectedTab} project={project}>
                Sections go here
            </ProjectOverviewPage>
        );
    }
}

function mapData(state: RootState): Data {
    const projectId = state.router.route && state.router.route.params.projectId; // get from url
    const partnerId = state.router.route && state.router.route.params.partnerId;
    return {
        projectId,
        partnerId,
        projectDetails: Pending.create(state.data.project[partnerId]),
    };
}

export const ClaimsDashboard = ReduxContainer.for<Data, {}>(ClaimsDashboardComponent)
    .withData(mapData)
    .connect();
