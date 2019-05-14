import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { AllClaimsDashboardRoute } from "../claims/allClaimsDashboard";
import { ClaimsDashboardRoute } from "../claims/dashboard";
import { AccessibilityText } from "@ui/components/renderers";

interface Data {
    projectDetails: Pending<ProjectDto>;
    partners: Pending<PartnerDto[]>;
    contacts: Pending<ProjectContactDto[]>;
}

interface Params {
    id: string;
}

interface Callbacks {
}

interface CombinedData {
    project: ProjectDto;
    partners: PartnerDto[];
    contacts: ProjectContactDto[];
}

class ProjectDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
    render() {
        const combined = Pending.combine({
          project: this.props.projectDetails,
          partners: this.props.partners,
          contacts: this.props.contacts,
        });

        return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
    }

    private renderContents({project, partners, contacts}: CombinedData) {
        const DetailsSection = ACC.TypedDetails<ProjectDto>();

        const monitoringOfficer = contacts.find(x => x.role === "Monitoring officer");
        const projectManager = contacts.find(x => x.role === "Project Manager");

        // project links are not currenly required but will be added back
        // const links = [
        //     { text: "View original application", url: project.applicationUrl, qa: "application-link" },
        //     { text: "View original grant offer letter", url: project.grantOfferLetterUrl, qa: "grant-letter-link" }
        // ];

        return (
            <ACC.Page
              backLink={this.renderBackLink(project, partners)}
              pageTitle={<ACC.Projects.Title project={project} />}
            >
                {this.renderPartnersCosts(partners, project)}
                <ACC.Section title="Project members">
                    <ACC.ProjectMember member={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectMember member={projectManager} qa="project-manager" />

                    <ACC.PartnersAndFinanceContacts contacts={contacts} partners={partners} />

                </ACC.Section>

                <ACC.Section title="Project information" qa="project-details">
                    <DetailsSection.Details labelWidth="Narrow" data={project} qa="project-details">
                        <DetailsSection.Date label="Project start date" qa="start-date" value={x => x.startDate} />
                        <DetailsSection.Date label="Project end date" qa="end-date" value={x => x.endDate} />
                        <DetailsSection.MultilineString label="Project summary" qa="summary" value={x => x.summary} />
                    </DetailsSection.Details>
                </ACC.Section>

                {/*
                // project links are not currently required but will be added back
                <ACC.Section title="Application information" qa="application-details">
                    <ACC.LinksList links={links} />
                </ACC.Section>
                */}
            </ACC.Page>
        );
    }

    private renderPartnersCosts(partners: PartnerDto[], project: ProjectDto) {
        const requiredRoles = ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer;

        if ((requiredRoles & project.roles) === ProjectRole.Unknown) {
            return null;
        }

        const PartnersTable = ACC.TypedTable<PartnerDto>();
        const totalEligibleCosts = partners.reduce((val, partner) => val += partner.totalParticipantGrant || 0, 0) || null;
        const totalClaimed = partners.reduce((val, partner) => val += partner.totalParticipantCostsClaimed || 0, 0);
        const percentageClaimed = totalEligibleCosts ? 100 * totalClaimed / totalEligibleCosts : 0;

        return (
            <ACC.Section title="Cost claimed status" qa="cost-claimed-status">
                <PartnersTable.Table qa="cost-claimed" data={partners} caption="Cost claimed status">
                    <PartnersTable.String header="Partner" qa="partner-name" value={x => x.isLead ? `${x.name} (Lead)` : x.name} footer="Total" />
                    <PartnersTable.Currency header={<React.Fragment><span>Total eligible</span><br/><span>costs</span></React.Fragment>} qa="total-costs" value={x => x.totalParticipantGrant || 0} footer={<ACC.Renderers.Currency value={totalEligibleCosts} />} />
                    <PartnersTable.Currency header={<React.Fragment><span>Costs claimed</span><br/><span>to date</span></React.Fragment>} qa="costs-claimed" value={x => x.totalParticipantCostsClaimed || 0} footer={<ACC.Renderers.Currency value={totalClaimed} />} />
                    <PartnersTable.Percentage header={<React.Fragment><span>Percentage of eligible</span><br/><span>costs claimed to date</span></React.Fragment>} qa="percentage-claimed" value={x => x.percentageParticipantCostsClaimed || 0} footer={<ACC.Renderers.Percentage value={percentageClaimed} />} />
                    <PartnersTable.Percentage header="Cap limit" qa="cap-limit" value={x => x.capLimit} fractionDigits={0} footer={<AccessibilityText>No data</AccessibilityText>}/>
                </PartnersTable.Table>
            </ACC.Section>
        );
    }

    private renderBackLink(project: ProjectDto, partners: PartnerDto[]) {
        const partnerId = partners.filter(x => x.roles & ProjectRole.FinancialContact).map(x => x.id)[0];
        const isMOorPM = !!(project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager));
        const isFC = !!(project.roles & ProjectRole.FinancialContact);

        if(isMOorPM) {
            return <ACC.BackLink route={AllClaimsDashboardRoute.getLink({ projectId: project.id })}>Back to project</ACC.BackLink>;
        }
        else if (isFC) {
            return <ACC.BackLink route={ClaimsDashboardRoute.getLink({ projectId: project.id, partnerId})}>Back to project</ACC.BackLink>;
        }
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
    routeName: "projectDetails",
    routePath: "/projects/:id/details",
    getParams: (r) => ({ id: r.params.id }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.id),
        Actions.loadContactsForProject(params.id),
        Actions.loadPartnersForProject(params.id),
    ],
    container: ProjectDetails,
    getTitle: () => ({
        htmlTitle: "Project details - View project",
        displayTitle: "View project"
    }),
    accessControl: (auth, { id }) => auth.forProject(id).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
