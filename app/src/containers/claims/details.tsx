import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {ProjectOverviewPage, tabListArray} from "../../components/projectOverview";
import {RootState} from "../../redux/reducers";
import {Pending} from "../../shared/pending";
import {Dispatch} from "redux";
import * as Actions from "../../redux/actions/contacts";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import {ProjectDto} from "../../models";

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
}

interface Callbacks {
    loadDetails: (id: string) => void;
}

export class ClaimsDashboardComponent extends ContainerBase<Data, Callbacks> {

    // ultimatly will come from navigation
    private selectedTab = tabListArray[0];

    componentDidMount() {
        this.props.loadDetails(this.props.id);
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
    const id = state.router.route && state.router.route.params.id; // get from url
    return {
        id,
        projectDetails: Pending.create(state.data.project[id]),
    };
}

function mapCallbacks(dispatch: Dispatch): Callbacks {
    return {
        loadDetails: (id: string) => {
            dispatch(Actions.loadProject(id) as any);
        }
    };
}

export const ClaimsDashboard = ReduxContainer.for<Data, Callbacks>(ClaimsDashboardComponent)
    .withData(mapData)
    .withCallbacks(mapCallbacks)
    .connect();
