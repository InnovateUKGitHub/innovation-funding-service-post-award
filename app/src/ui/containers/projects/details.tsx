import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
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
        const projectManagerPartner = projectManager ? partners.find(x => x.accountId === projectManager.accountId) : null;

        // project links are not currenly required but will be added back
        // const links = [
        //     { text: "View original application", url: project.applicationUrl, qa: "application-link" },
        //     { text: "View original grant offer letter", url: project.grantOfferLetterUrl, qa: "grant-letter-link" }
        // ];

        return (
            <ACC.Page
                backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
                pageTitle={<ACC.Projects.Title project={project} />}
                project={project}
            >

                <ACC.Section
                    title={`Project period ${project.periodId} of ${project.totalPeriods}`}
                    subtitle={<ACC.Renderers.ShortDateRange start={project.startDate} end={project.endDate} />}
                />

                <ACC.Section title="Project members">
                    <ACC.ProjectContact contact={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectContact contact={projectManager} partner={projectManagerPartner} qa="project-manager" />
                    <ACC.Section title="Finance contacts">
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
