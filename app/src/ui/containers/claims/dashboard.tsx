import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {ProjectOverviewPage, tabListArray} from "../../components/projectOverview";
import {RootState} from "../../redux/reducers";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import {PartnerDto, ProjectDto} from "../../models";
import {State} from "router5/create-router";
import {FieldComponent, Loading, Panel, Section} from "../../components";
import {Currency, Percentage} from "../../components/renderers";

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

    const renderCurrency = (val: any) => (<p className="govuk-body"><Currency value={val}/></p>);
    const renderPercentage = (val: any) => (<p className="govuk-body"><Percentage value={val}/></p>);
    const fieldClasses = { labelClass:"govuk-grid-column-one-half", valueClass:"govuk-grid-column-one-half" };

    // TODO Generalise this
    return (
        <Panel title="Project claims history">
            <div className="govuk-grid-row" >
                <div className="govuk-grid-column-one-half">
                    <div className="govuk-grid-row" >
                        <FieldComponent {...fieldClasses} label="Grant offer letter costs" data={partner.totalParticipantGrant} render={renderCurrency}/>
                    </div>
                    <div className="govuk-grid-row" >
                        <FieldComponent {...fieldClasses} label="Costs claimed to date" data={partner.totalParticipantCostsClaimed} render={renderCurrency}/>
                    </div>
                    <div className="govuk-grid-row" >
                        <FieldComponent {...fieldClasses} label="Award offer rate" data={partner.awardRate} render={renderPercentage}/>
                    </div>
                </div>
                <div className="govuk-grid-column-one-half" >
                    <div className="govuk-grid-row" >
                        <FieldComponent {...fieldClasses} label="Percentage claimed to date" data={partner.percentageParticipantCostsClaimed} render={renderPercentage}/>
                    </div>
                    <div className="govuk-grid-row" >
                        <FieldComponent {...fieldClasses} label="Cap limit" data={partner.capLimit} render={renderPercentage}/>
                    </div>
                </div>
            </div>
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
