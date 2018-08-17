import React from "react";
import { Dispatch } from "redux";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux";
import { Backlink, forData, ProjectMembers, Tabs, Title } from "../../components";
import { routeConfig } from "../../routing";
import Details from "../../components/details";
import { Section } from "../../components/layout/section";
import { Page } from "../../components/layout/page";

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
    {name: "Ooba", isLead: true, type: "Industrial"},
    {name: "Gabtype", isLead: false, type: "Industrial"},
    {name: "Jabbertype", isLead: false, type: "Industrial"},
    {name: "Wordpedia", isLead: false, type: "Academic"}
];

const projectInfo = {
    title: "123: High speed rail and its effects on air quality",
    startDate: new Date("2019/12/1"),
    endDate: new Date("2019/12/2"),
    summary: "The project aims to identify, isolate and correct an issue that has hindered progress in this field for a number of years.\n" +
        "Identification will involve the university testing conditions to determine the exact circumstance of the issue.\n" +
        "Once identification has been assured we will work to isolate the issue but replicating the circumstances in which it occurs within a laboratory environment.\n" +
        "After this we will work with our prototyping partner to create a tool to correct the issue.  Once tested and certified this will be rolled out to mass production.\n"
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

interface Info {
    key: string;
    value: string;
}

class ProjectDetailsComponent extends ContainerBase<Data, Callbacks> {

    private tabListArray = ["Claims", "Project change request", "Forecasts", "Project details"];
    private selectedTab = this.tabListArray[3];

    render() {
        const tableData = partners.map(partner => ({partner, financeContact: projectMembers.find(x => x.organisation === partner.name )}));

        const Table = forData(tableData);
        const ProjectDetails = Details.forData(projectInfo);
        const monitoringOfficer = projectMembers.find(x => x.role === "Monitoring officer");
        const projectManager = projectMembers.find(x => x.role === "Project manager");

        return (
            <Page>
                <Backlink route={routeConfig.home}>Main dashboard</Backlink>
                <Title title="View project" caption={projectInfo.title} />
                
                <Tabs tabList={this.tabListArray} selected={this.selectedTab} />

                <Section title="Project Members">
                    <ProjectMember member={monitoringOfficer}/>
                    <ProjectMember member={projectManager}/>

                    <Table.Table>
                        <Table.String header="Partner" value={x => x.partner.name} />
                        <Table.String header="Partner Type" value={x => x.partner.type} />
                        <Table.String header="Finance Contact" value={x => x.financeContact && x.financeContact.name || ""} />
                        <Table.String header="Email" value={x => x.financeContact && x.financeContact.email || ""} />
                    </Table.Table>
                </Section>

                <Section title="Project information">
                    <ProjectDetails.Details data={projectInfo}>
                        <ProjectDetails.Date data={projectInfo} label="Project start date" value={x => x.startDate} />
                        <ProjectDetails.Date data={projectInfo} label="Project end date" value={x => x.endDate} />
                        <ProjectDetails.MulilineString data={projectInfo} label="Project summary" value={x => x.summary} />
                    </ProjectDetails.Details>
                </Section>

                {this.renderApplicationInfo()}
            </Page>
        );
    }

    private renderApplicationInfo() {
        return (
            <div>
                <h2 className="govuk-heading-m govuk-!-margin-bottom-8">Application information</h2>
                <div className="govuk-!-padding-bottom-4"><a href="" className="govuk-link govuk-!-font-size-19">View original application</a></div>
                <div className="govuk-!-padding-bottom-4"><a href="" className="govuk-link govuk-!-font-size-19">View original grant offer letter</a></div>
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
