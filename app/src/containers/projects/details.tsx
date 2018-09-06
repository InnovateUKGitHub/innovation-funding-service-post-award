import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import { Pending } from "../../shared/pending";
import { routeConfig } from "../../routing";
import * as Actions from "../../redux/actions/contacts";
import { State } from "router5";

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
    partners: Pending<Dtos.PartnerDto[]>;
    contacts: Pending<Dtos.ProjectContactDto[]>;
}

class ProjectDetailsComponent extends ContainerBase<Data, {}> {
    // ultimatly will come from navigation
    private tabListArray = ["Claims", "Project change requests", "Forecasts", "Project details"];
    private selectedTab = this.tabListArray[3];

    public static getLoadDataActions(route: State) {

        const projectId = route.params && route.params.id;
        return [
            Actions.loadProject(projectId),
            Actions.loadContactsForProject(projectId),
            Actions.loadPatnersForProject(projectId),
        ];
    }

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
            <ACC.Page>
                <ACC.Section qa="Project_members">
                    <ACC.BackLink route={routeConfig.projectDashboard}>Main dashboard</ACC.BackLink>
                </ACC.Section>

                <ACC.Title title="View project" caption={`${project.projectNumber}:${project.title}`} />

                <ACC.Tabs tabList={this.tabListArray} selected={this.selectedTab} />

                <ACC.Section title="Project Members">
                    <ACC.ProjectMember member={monitoringOfficer} qa="monitoring-officer" />
                    <ACC.ProjectMember member={projectManager} qa="project-manager" />

                    <ACC.PartnersTable contacts={contacts} partners={partners} />

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
            </ACC.Page>
        );
    }
}

function mapData(state: RootState): Data {
    const id = state.router.route && state.router.route.params.id;
    return {
        id,
        contacts: Pending.create(state.data.projectContacts[id]),
        partners: Pending.create(state.data.partners[id]),
        projectDetails: Pending.create(state.data.project[id])
    };
}

export const ProjectDetails = ReduxContainer.for<Data, {}>(ProjectDetailsComponent)
    .withData(mapData)
    .connect();
