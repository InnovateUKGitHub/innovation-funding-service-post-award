import React from "react";
import { Dispatch } from "redux";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import { Pending } from "../../shared/pending";
import * as Actions from "../../redux/actions/contacts";
import { routeConfig } from "../../routing";

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
    partners: Pending<Dtos.PartnerDto[]>;
    contacts: Pending<Dtos.ProjectContactDto[]>;
}

interface Callbacks {
    loadDetails: (id: string) => void;
}

class ProjectDetailsComponent extends ContainerBase<Data, Callbacks> {
    // ultimatly will come from navigation
    private tabListArray = ["Claims", "Project change requests", "Forecasts", "Project details"];
    private selectedTab = this.tabListArray[3];

    componentDidMount() {
        this.props.loadDetails(this.props.id);
    }

    render() {
        const combined = Pending.combine(this.props.projectDetails, this.props.partners, this.props.contacts, (projectDetails, partners, contacts) => ({ projectDetails, partners, contacts }));
        const Loading = ACC.Loading.forData(combined);
        return <Loading.Loader render={x => this.renderContents(x.projectDetails, x.partners, x.contacts)} />;
    }

    private renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], contacts: Dtos.ProjectContactDto[]) {
        const partnersAndContactsData = partners.map(partner => ({ partner, financeContact: contacts.find(x => x.partnerId === partner.id) }));

        const PartnersTable = ACC.Table.forData(partnersAndContactsData);
        const DetailsSection = ACC.Details.forData(project);

        const monitoringOfficer = contacts.find(x => x.role === "Monitoring officer");
        const projectManager = contacts.find(x => x.role === "Project manager");

        const links = [
            { text: "View original application", url: project.applicationUrl },
            { text: "View original grant offer letter", url: project.grantOfferLetterUrl }
        ];

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.home}>Main dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Title title="View project" caption={project.title} />

                <ACC.Tabs tabList={this.tabListArray} selected={this.selectedTab} />

                <ACC.Section title="Project Members">
                    <ACC.ProjectMember member={monitoringOfficer} />
                    <ACC.ProjectMember member={projectManager} />

                    <PartnersTable.Table>
                        <PartnersTable.String header="Partner" value={x => x.partner.isLead ? `${x.partner.name} (Lead)` : x.partner.name} />
                        <PartnersTable.String header="Partner Type" value={x => x.partner.type} />
                        <PartnersTable.String header="Finance Contact" value={x => x.financeContact && x.financeContact.name || ""} />
                        <PartnersTable.Email header="Email" value={x => x.financeContact && x.financeContact.email || ""} />
                    </PartnersTable.Table>
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
    const id = state.router.route && state.router.route.params.id; // get from url
    return {
        id,
        contacts: Pending.create(state.data.projectContacts[id]),
        partners: Pending.create(state.data.partners[id]),
        projectDetails: Pending.create(state.data.project[id]),
    };
}

function mapCallbacks(dispatch: Dispatch): Callbacks {
    return {
        loadDetails: (id: string) => {
            dispatch(Actions.loadProject(id) as any);
            dispatch(Actions.loadContactsForProject(id) as any);
            dispatch(Actions.loadPatnersForProject(id) as any);
        }
    };
}

export const ProjectDetails = ReduxContainer.for<Data, Callbacks>(ProjectDetailsComponent)
    .withData(mapData)
    .withCallbacks(mapCallbacks)
    .connect();
