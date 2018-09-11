import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {ProjectOverviewPage, tabListArray} from "../../components/projectOverview";
import {RootState} from "../../redux/reducers";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import {ProjectDto} from "../../models";
import {State} from "router5/create-router";
import {Details, Loading, Panel, Section} from "../../components";

interface Data {
    projectId: string;
    projectDetails: Pending<Dtos.ProjectDto>;
}

export class ClaimsDashboardComponent extends ContainerBase<Data, {}> {

    // ultimatly will come from navigation
    private selectedTab = tabListArray[0];

    public static getLoadDataActions(route: State) {

        const projectId = route.params && route.params.projectId;
        return [
            Actions.loadProject(projectId)
        ];
    }

    render() {
        const ProjectDetails = Loading.forData(this.props.projectDetails);
        return <ProjectDetails.Loader render={(x) => this.renderContents(x)}/>;
    }

    renderContents(project: ProjectDto) {
        return (
            <ProjectOverviewPage selectedTab={this.selectedTab} project={project}>
                <Section>
                    <ProjectClaimsHistory/>
                </Section>
            </ProjectOverviewPage>
        );
    }
}

const ProjectClaimsHistory = () => {
    const ItemDetails = Details.forData({ id: "Example 1", name: "The Example", created: new Date() });
    return (
        <Panel title="Project claims history">
            <ItemDetails.Details layout="Double" displayDensity="Compact">
                <ItemDetails.String label="Grant offer letter costs" value={x => x.id}/>
                <ItemDetails.String label="Percentage claimed to date" value={x => x.id}/>

                <ItemDetails.String label="Costs claimed to date" value={x => x.id}/>
                <ItemDetails.String label="Cap limit" value={x => x.id}/>

                <ItemDetails.String label="Award offer rate" value={x => x.id}/>
                <ItemDetails.Empty />

                <ItemDetails.String label="Costs paid to date" value={x => x.id}/>
                <ItemDetails.Empty />
            </ItemDetails.Details>
        </Panel>
    );
};

function mapData(state: RootState): Data {
    const projectId = state.router.route && state.router.route.params.projectId; // get from url
    return {
        projectId,
        projectDetails: Pending.create(state.data.project[projectId]),
    };
}

export const ClaimsDashboard = ReduxContainer.for<Data, {}>(ClaimsDashboardComponent)
    .withData(mapData)
    .connect();
