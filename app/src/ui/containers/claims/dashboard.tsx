import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/index";
import { routeConfig } from "../../routing";
import {ProjectOverviewPage} from "../../components/projectOverview";
import {PartnerDto, ProjectDto} from "../../models";
import {Details, DualDetails, Loading, Panel, Section} from "../../components";

interface Params {
    projectId: string;
    partnerId: string;
}

interface Data {
    projectDetails: Pending<ProjectDto>;
    partnerDetails: Pending<PartnerDto>;
}

class Component extends ContainerBase<Params, Data, {}> {
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
            <ProjectOverviewPage selectedTab={routeConfig.claimsDashboard.routeName} project={project} partnerId={partner.id}>
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

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const ClaimsDashboard = definition.connect({
    withData: (state, params) => ({
        projectDetails: Pending.create(state.data.project[params.projectId]),
        partnerDetails: Pending.create(state.data.partner[params.partnerId])
    }),
    withCallbacks: () => ({})
});

export const ClaimsDashboardRoute = definition.route({
    routeName: "claimDetails",
    routePath: "/project/:projectId/claims/?partnerId",
    getParams: (route) => ({
        projectId: route.params.projectId,
        partnerId: route.params.partnerId,
    }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPartner(params.partnerId)
    ],
    container: ClaimsDashboard
});
