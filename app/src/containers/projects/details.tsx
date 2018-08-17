import React from "react";
import { Dispatch } from "redux";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux";
import * as ACC from "../../components";

const projectMembers = [
    {
        role: "Monitoring officer",
        name: "Thomas Filton",
        email: "thomas.filton@isee.example.com",
    },
    {
        role: "Project manager",
        name: "Steve Smith",
        email: "steve.smith@isee.example.com",
        organisation: "Ooba"
    },
    {
        role: "Finance contact",
        name: "Ralph Young",
        email: "ralph.young@ooba.example.com",
        organisation: "Ooba"
    },
    {
        role: "Finance contact",
        name: "Marian Stokes",
        email: "worth.email.test+marian@gmail.com",
        organisation: "Gabtype"
    },
    {
        role: "Finance contact",
        name: "Antonio Jenkins",
        email: "antonio.jenkins@jabbertype.example.com",
        organisation: "Jabbertype"
    },
    {
        role: "Finance contact",
        name: "Tina Taylor",
        email: "tina.taylor@wordpedia.example.com",
        organisation: "Wordpedia"
    }
];

const partners = [
    { name: "Ooba", isLead: true, type: "Industrial" },
    { name: "Gabtype", isLead: false, type: "Industrial" },
    { name: "Jabbertype", isLead: false, type: "Industrial" },
    { name: "Wordpedia", isLead: false, type: "Academic" }
];

const projectInfo = {
    title: "123: High speed rail and its effects on air quality",
    startDate: new Date("2019/12/1"),
    endDate: new Date("2019/12/2"),
    summary: "The project aims to identify, isolate and correct an issue that has hindered progress in this field for a number of years.\n" +
        "Identification will involve the university testing conditions to determine the exact circumstance of the issue.\n" +
        "Once identification has been assured we will work to isolate the issue but replicating the circumstances in which it occurs within a laboratory environment.\n" +
        "After this we will work with our prototyping partner to create a tool to correct the issue.  Once tested and certified this will be rolled out to mass production.\n",
    applicationUrl: "#",
    grantOfferLetterUrl: "#"

};

export interface ProjectDetailsDto {
    id: string;
    name: string;
}

export interface Data {
    projectDetails: ProjectDetailsDto;
}

export interface Callbacks {
    loadDetails: (id: string) => void;
}

class ProjectDetailsComponent extends ContainerBase<Data, Callbacks> {

    //ultimatly will come from navigation
    private tabListArray = ["Claims", "Project change requests", "Forecasts", "Project details"];
    private selectedTab = this.tabListArray[3];

    render() {
        const partnersAndContactsData = partners.map(partner => ({ partner, financeContact: projectMembers.find(x => x.organisation === partner.name) }));

        const PartnersTable = ACC.Table.forData(partnersAndContactsData);
        const ProjectDetails = ACC.Details.forData(projectInfo);
        const monitoringOfficer = projectMembers.find(x => x.role === "Monitoring officer");
        const projectManager = projectMembers.find(x => x.role === "Project manager");

        const links = [
            { text: "View original application", url: projectInfo.applicationUrl },
            { text: "View original grant offer letter", url: projectInfo.grantOfferLetterUrl }
        ];

        return (
            <ACC.Page>
                <ACC.Backlink path="/">Main dashboard</ACC.Backlink>
                <ACC.Title title="View project" caption={projectInfo.title} />

                <ACC.Tabs tabList={this.tabListArray} selected={this.selectedTab} />

                <ACC.Section title="Project Members">
                    <ACC.ProjectMember member={monitoringOfficer} />
                    <ACC.ProjectMember member={projectManager} />

                    <PartnersTable.Table>
                        <PartnersTable.String header="Partner" value={x => x.partner.name} />
                        <PartnersTable.String header="Partner Type" value={x => x.partner.type} />
                        <PartnersTable.String header="Finance Contact" value={x => x.financeContact && x.financeContact.name || ""} />
                        <PartnersTable.String header="Email" value={x => x.financeContact && x.financeContact.email || ""} />
                    </PartnersTable.Table>
                </ACC.Section>

                <ACC.Section title="Project information">
                    <ProjectDetails.Details>
                        <ProjectDetails.Date label="Project start date" value={x => x.startDate} />
                        <ProjectDetails.Date label="Project end date" value={x => x.endDate} />
                        <ProjectDetails.MulilineString label="Project summary" value={x => x.summary} />
                    </ProjectDetails.Details>
                </ACC.Section>

                <ACC.Section title="Application information">
                    <ACC.LinksList links={links}/>
                </ACC.Section>
            </ACC.Page>
        );
    }

    private renderApplicationInfo() {
        return (
            <div>
                <h2 className="govuk-heading-m govuk-!-margin-bottom-8">Application information</h2>
            </div>
        );
    }
}

function mapData(store: RootState) {
    return {
        projectDetails: {
            id: "test id",
            name: "test name"
        }
    };
}

function mapCallbacks(dispatch: Dispatch) {
    return {
        loadDetails: (id: string) => dispatch({ type: "TEST LOAD", payload: id })
    };
}

export const ProjectDetails = ReduxContainer.for<Data, Callbacks>(ProjectDetailsComponent)
    .withData(state => ({
        projectDetails: {
            id: "123",
            name: "test123"
        }
    }))
    .withCallbacks(mapCallbacks)
    .connect();
