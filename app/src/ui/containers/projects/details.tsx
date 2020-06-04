import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { StoresConsumer } from "@ui/redux";
import { PartnerName } from "../../components";

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
        const projectManagerPartner = projectManager ? partners.find(x => x.accountId === projectManager.accountId) : null;

        return (
            <ACC.Page
                backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
                pageTitle={<ACC.Projects.Title project={project} />}
                project={project}
            >

                <ACC.Section
                    qa="period-information"
                    titleContent={x => x.projectDetails.projectMessages.currentPeriodInfo(project.periodId, project.numberOfPeriods)}
                    subtitle={<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
                />

                <ACC.Section titleContent={x => x.projectDetails.projectLabels.projectMembers()}>
                    <ACC.ProjectContact contact={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectContact contact={projectManager} partner={projectManagerPartner} qa="project-manager" />
                    <ACC.Section titleContent={x => x.projectDetails.projectLabels.financeContacts()}>
                        <ACC.PartnersAndFinanceContacts contacts={contacts} partners={partners} projectContactLabels={x => x.projectDetails.contactLabels} />
                    </ACC.Section>
                </ACC.Section>
                {this.renderPartnersContactInformationSummaryList(partners)}
                <ACC.Section title="Project information" qa="project-details">
                    <ACC.SummaryList qa="project-information">
                        <ACC.SummaryListItem labelContent={x => x.projectDetails.projectLabels.startDate()} qa="start-date" content={<ACC.Renderers.FullDate value={project.startDate} />} />
                        <ACC.SummaryListItem labelContent={x => x.projectDetails.projectLabels.endDate()} qa="end-date" content={<ACC.Renderers.FullDate value={project.endDate} />} />
                        <ACC.SummaryListItem labelContent={x => x.projectDetails.projectLabels.duration()} qa="duration" content={`${project.durationInMonths} ${project.durationInMonths === 1 ? "month" : "months"}`} />
                        <ACC.SummaryListItem labelContent={x => x.projectDetails.projectLabels.numberOfPeriods()} qa="periods" content={project.numberOfPeriods} />
                        <ACC.SummaryListItem labelContent={x => x.projectDetails.projectLabels.scope()} qa="scope" content={<ACC.Renderers.SimpleString multiline={true}>{project.summary}</ACC.Renderers.SimpleString>} />
                    </ACC.SummaryList>
                </ACC.Section>
            </ACC.Page>
        );
    }

    private renderPartnersContactInformationSummaryList(partners: PartnerDto[]) {
        const PartnersTable = ACC.TypedTable<PartnerDto>();

        return (
            <ACC.Section titleContent={x => x.projectDetails.projectLabels.partners()}>
                <PartnersTable.Table qa="partner-information" data={partners}>
                    <PartnersTable.Custom headerContent={x => x.partnerDetails.contactLabels.partnerName()} value={x => this.renderPartnerName(x)} qa="partner-name" />
                    <PartnersTable.String headerContent={x => x.partnerDetails.contactLabels.partnerType()} value={x => x.type} qa="partner-type" />
                    <PartnersTable.String headerContent={x => x.partnerDetails.contactLabels.partnerPostcode()} value={x => x.postcode} qa="partner-postcode" />
                </PartnersTable.Table>
            </ACC.Section>
        );
    }

    private renderPartnerName(partner: PartnerDto) {
        if (!this.props.config.features.editPartnerPostcode) {
            return <PartnerName partner={partner} showIsLead={true} />;
        }

        return (
            <ACC.Link route={this.props.routes.partnerDetails.getLink({ id: this.props.id, partnerId: partner.id })}>
                <PartnerName partner={partner} showIsLead={true} />
            </ACC.Link >
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
    getTitle: ({ content }) => content.projectDetails.title(),
    accessControl: (auth, { id }) => auth.forProject(id).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
