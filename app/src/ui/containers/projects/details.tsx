import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { AccessibilityText } from "@ui/components/renderers";
import { StoresConsumer } from "@ui/redux";

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

    private renderContents({ project, partners, contacts }: CombinedData) {
        const monitoringOfficer = contacts.find(x => x.role === "Monitoring officer");
        const projectManager = contacts.find(x => x.role === "Project Manager");

        // project links are not currenly required but will be added back
        // const links = [
        //     { text: "View original application", url: project.applicationUrl, qa: "application-link" },
        //     { text: "View original grant offer letter", url: project.grantOfferLetterUrl, qa: "grant-letter-link" }
        // ];

        return (
            <ACC.Page
                backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes}/>}
                pageTitle={<ACC.Projects.Title project={project} />}
                project={project}
            >
                {this.renderPartnersCosts(partners, project)}
                <ACC.Section title="Project members">
                    <ACC.ProjectMember member={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectMember member={projectManager} qa="project-manager" />
                    <ACC.Section subsection={true} title="Finance contacts">
                        <ACC.PartnersAndFinanceContacts contacts={contacts} partners={partners} />
                    </ACC.Section>
                </ACC.Section>
                <ACC.Section title="Project information" qa="project-details">
                    <ACC.SummaryList qa="project-information">
                        <ACC.SummaryListItem label="Project start date" qa="start-date" content={<ACC.Renderers.FullDate value={project.startDate} />} />
                        <ACC.SummaryListItem label="Project end date" qa="end-date" content={<ACC.Renderers.FullDate value={project.endDate} />} />
                        <ACC.SummaryListItem label="Duration" qa="duration" content={`${project.durationInMonths} ${project.durationInMonths === 1 ? "month" : "months"}`} />
                        <ACC.SummaryListItem label="Number of periods" qa="periods" content={project.numberOfPeriods} />
                        <ACC.SummaryListItem label="Project scope statement" qa="scope" content={project.summary} />
                    </ACC.SummaryList>
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
                    <PartnersTable.Currency header={<React.Fragment><span>Total eligible</span><br /><span>costs</span></React.Fragment>} qa="total-costs" value={x => x.totalParticipantGrant || 0} footer={<ACC.Renderers.Currency value={totalEligibleCosts} />} />
                    <PartnersTable.Currency header={<React.Fragment><span>Costs claimed</span><br /><span>to date</span></React.Fragment>} qa="costs-claimed" value={x => x.totalParticipantCostsClaimed || 0} footer={<ACC.Renderers.Currency value={totalClaimed} />} />
                    <PartnersTable.Percentage header={<React.Fragment><span>Percentage of eligible</span><br /><span>costs claimed to date</span></React.Fragment>} qa="percentage-claimed" value={x => x.percentageParticipantCostsClaimed || 0} footer={<ACC.Renderers.Percentage value={percentageClaimed} />} />
                    <PartnersTable.Percentage header="Claim cap" qa="cap-limit" value={x => x.capLimit} fractionDigits={0} footer={<AccessibilityText>No data</AccessibilityText>} />
                </PartnersTable.Table>
            </ACC.Section>
        );
    }
}

const ProjectDetailsContainer = (props: Params & BaseProps) => (
    <StoresConsumer>
        {
            stores => (
                <ProjectDetailsComponent
                    projectDetails={stores.projects.getById(props.id)}
                    partners={stores.partners.getPartnersForProject(props.id)}
                    contacts={stores.contacts.getAllByProjectId(props.id)}
                    {...props}
                />
            )
        }
    </StoresConsumer>
);

export const ProjectDetailsRoute = defineRoute({
    routeName: "projectDetails",
    routePath: "/projects/:id/details",
    container: ProjectDetailsContainer,
    getParams: (r) => ({ id: r.params.id }),
    getTitle: () => ({
        htmlTitle: "Project details",
        displayTitle: "Project details"
    }),
    accessControl: (auth, { id }) => auth.forProject(id).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
