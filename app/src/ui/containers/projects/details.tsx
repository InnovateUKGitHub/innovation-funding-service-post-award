import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { routeConfig } from "../../routing";

interface Data {
    projectDetails: Pending<Dtos.ProjectDto>;
    partners: Pending<Dtos.PartnerDto[]>;
    contacts: Pending<Dtos.ProjectContactDto[]>;
}

interface Params {
    id: string;
}

interface Callbacks {
}

interface CombinedData {
    projectDetails: Dtos.ProjectDto;
    partners: Dtos.PartnerDto[];
    contacts: Dtos.ProjectContactDto[];
}

class ProjectDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
    render() {
        const combined = Pending.combine(this.props.projectDetails, this.props.partners, this.props.contacts, (projectDetails, partners, contacts) => ({ projectDetails, partners, contacts }));
        const Loader = ACC.TypedLoader<CombinedData>();
        return <Loader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners, x.contacts)} />;
    }

    private renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], contacts: Dtos.ProjectContactDto[]) {
        const DetailsSection = ACC.Details.forData(project);

        const monitoringOfficer = contacts.find(x => x.role === "Monitoring officer");
        const projectManager = contacts.find(x => x.role === "Project Manager");

        const links = [
            { text: "View original application", url: project.applicationUrl, qa: "Original_application" },
            { text: "View original grant offer letter", url: project.grantOfferLetterUrl, qa: "Original_grant_letter" }
        ];

        return (
            <ProjectOverviewPage selectedTab={routeConfig.projectDetails.routeName} project={project} partners={partners}>
                {this.renderPartnersCosts(partners)}
                <ACC.Section title="Project Members">
                    <ACC.ProjectMember member={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectMember member={projectManager} qa="project-manager" />

                    <ACC.PartnersAndFinanceContacts contacts={contacts} partners={partners} />

                </ACC.Section>

                <ACC.Section title="Project information">
                    <DetailsSection.Details labelWidth="Narrow">
                        <DetailsSection.Date label="Project start date" value={x => x.startDate} />
                        <DetailsSection.Date label="Project end date" value={x => x.endDate} />
                        <DetailsSection.MulilineString label="Project summary" value={x => x.summary} />
                    </DetailsSection.Details>
                </ACC.Section>

                <ACC.Section title="Application information">
                    <ACC.LinksList links={links} />
                </ACC.Section>
            </ProjectOverviewPage>
        );
    }

    private renderPartnersCosts(partners: Dtos.PartnerDto[]) {
        const PartnersTable = ACC.TypedTable<Dtos.PartnerDto>();
        const totalEligibleCosts = partners.reduce((val, partner) => val += partner.totalParticipantGrant, 0) || null;
        const totalClaimed = partners.reduce((val, partner) => val += partner.totalParticipantCostsClaimed, 0);
        const percentageClaimed = totalEligibleCosts ? 100 * totalClaimed / totalEligibleCosts : null;

        return (
            <ACC.Section title="Cost claimed status" qa="cost-claimed-status">
                <PartnersTable.Table qa="cost-claimed" data={partners}>
                    <PartnersTable.String header="Partner" qa="partner" value={x => x.isLead ? `${x.name} (Lead)` : x.name} footer="Total" />
                    <PartnersTable.Currency header="Total eligible costs" qa="total-costs" value={x => x.totalParticipantGrant} footer={<ACC.Renderers.Currency value={totalEligibleCosts} />} />
                    <PartnersTable.Currency header="Costs claimed to date" qa="costs-claimed" value={x => x.totalParticipantCostsClaimed} footer={<ACC.Renderers.Currency value={totalClaimed} />} />
                    <PartnersTable.Percentage header="Percentage claimed" qa="percentage-claimed" value={x => x.percentageParticipantCostsClaimed} footer={<ACC.Renderers.Percentage value={percentageClaimed} />} />
                    <PartnersTable.Percentage header="Cap limit" qa="cap-limit" value={x => x.capLimit} />
                </PartnersTable.Table>
            </ACC.Section>
        );
    }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(ProjectDetailsComponent);

export const ProjectDetails = containerDefinition.connect({
    withData: (state, props) => ({
        contacts: Selectors.findContactsByProject(props.id).getPending(state),
        partners: Selectors.findPartnersByProject(props.id).getPending(state),
        projectDetails: Selectors.getProject(props.id).getPending(state)
    }),
    withCallbacks: () => ({})
});

export const ProjectDetailsRoute = containerDefinition.route({
    routeName: "project-details",
    routePath: "/projects/:id/details",
    getParams: (r) => ({ id: r.params.id }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.id),
        Actions.loadContactsForProject(params.id),
        Actions.loadPartnersForProject(params.id),
    ],
    container: ProjectDetails
});
