import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { routeConfig } from "../../routing";

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
    partners: Pending<Dtos.PartnerDto[]>;
    contacts: Pending<Dtos.ProjectContactDto[]>;
}

interface Params {
    id: string;
}

interface Callbacks {
}

class ProjectDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
    render() {
        const combined = Pending.combine(this.props.projectDetails, this.props.partners, this.props.contacts, (projectDetails, partners, contacts) => ({ projectDetails, partners, contacts }));
        const Loading = ACC.Loading.forData(combined);
        return <Loading.Loader render={x => this.renderContents(x.projectDetails, x.partners, x.contacts)} />;
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
            <ProjectOverviewPage title="Project details" selectedTab={routeConfig.projectDetails.routeName} project={project}>
                <ACC.Section title="Project Members">
                    <ACC.ProjectMember member={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectMember member={projectManager} qa="project-manager" />

                    <ACC.PartnersAndFinanceContacts contacts={contacts} partners={partners} />

                </ACC.Section>

                <ACC.Section title="Project information">
                    <DetailsSection.Details>
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
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(ProjectDetailsComponent);

export const ProjectDetails = containerDefinition.connect({
    withData: (state, params) => ({
        id: params.id,
        contacts: Pending.create(state.data.projectContacts[params.id]),
        partners: Pending.create(state.data.partners[params.id]),
        projectDetails: Pending.create(state.data.project[params.id])
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
        Actions.loadPatnersForProject(params.id),
    ],
    container: ProjectDetails
});
