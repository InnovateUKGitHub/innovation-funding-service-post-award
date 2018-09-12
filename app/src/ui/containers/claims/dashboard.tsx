import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {ProjectOverviewPage, tabListArray} from "../../components/projectOverview";
import {RootState} from "../../redux/reducers";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import {PartnerDto, ProjectDto} from "../../models";
import {State} from "router5/create-router";
import {Details, DualDetails, Loading, Panel, Section} from "../../components";

interface Data {
    projectId: string;
    projectDetails: Pending<ProjectDto>;
    partnerDetails: Pending<PartnerDto>;
}

export class ClaimsDashboardComponent extends ContainerBase<Data, {}> {

    // ultimatly will come from navigation
    private selectedTab = tabListArray[0];

    public static getLoadDataActions(route: State) {

        const projectId = route.params && route.params.projectId;
        const partnerId = route.params && route.params.partnerId;
        return [
            Actions.loadProject(projectId),
            Actions.loadPartner(partnerId)
        ];
    }

    render() {
        const combined = Pending.combine(
            this.props.projectDetails,
            this.props.partnerDetails,
            (projectDetails, partnerDetails) => ({ projectDetails, partnerDetails })
        );
        const Loader = Loading.forData(combined).Loader;
        return <Loader render={(x) => this.renderContents(x.projectDetails, x.partnerDetails)}/>;
    }

    renderContents = (project: ProjectDto, partner: PartnerDto) => {
        return (
            <ProjectOverviewPage selectedTab={this.selectedTab} project={project}>
                <Section>
                    <ProjectClaimsHistory partner={partner}/>
                </Section>
            </ProjectOverviewPage>
        );
    }
}

interface ClaimsHistoryProps {
    partner: PartnerDto;
}

const ProjectClaimsHistory: React.SFC<ClaimsHistoryProps> = ({partner}) => {
    const { Details: Column, Currency, Percentage } = Details.forData(partner);
    return (
        <Panel title="Project claims history">
            <DualDetails>
                <Column qa="claims-history-col-0">
                    <Currency label="Grant offer letter costs" value={x => x.totalParticipantGrant}/>
                    <Currency label="Costs claimed to date" value={x => x.totalParticipantCostsClaimed}/>
                    <Percentage label="Award offer rate" value={x => x.awardRate}/>
                </Column>
                <Column qa="claims-history-col-1">
                    <Percentage label="Percentage claimed to date" value={x => x.percentageParticipantCostsClaimed}/>
                    <Percentage label="Cap limit" value={x => x.capLimit}/>
                </Column>
            </DualDetails>
        </Panel>
    );
};

function mapData(state: RootState): Data {
    const projectId = state.router.route && state.router.route.params.projectId; // get from url
    const partnerId = state.router.route && state.router.route.params.partnerId; // get from url
    return {
        projectId,
        projectDetails: Pending.create(state.data.project[projectId]),
        partnerDetails: Pending.create(state.data.partner[partnerId]),
    };
}

export const ClaimsDashboard = ReduxContainer.for<Data, {}>(ClaimsDashboardComponent)
    .withData(mapData)
    .connect();
