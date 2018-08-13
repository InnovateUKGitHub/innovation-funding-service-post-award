import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux/reducers/rootReducer";
import { Dispatch } from "redux";
import { Backlink, Table, Tabs, Title } from "../../components/layout";
import { ProjectMember } from "../../components";

const projectMembers = [
    {
        role: "Monitoring officer",
        name: "Thomas Filton",
        email: "thomas.filton@isee.example.com",
    },
    {
        role: "Project manager - Ooba",
        name: "Steve Smith",
        email: "steve.smith@isee.example.com",
    }
];

const tabListArray = ["Claims", "Project change request", "Forecasts", "Project details"];

const tableHeadings = ["Partner", "Partner type", "Finance contact", "Email"];

const tableBody = [
    [
        <span key="partner" className="govuk-body">Ooba (Lead)</span>,
        <span key="partnerType" className="govuk-body">Industrial</span>,
        <span key="financeContact" className="govuk-body">Ralph Young</span>,
        <a key="email" href="" className="govuk-link">ralph.young@ooba.example.com</a>
    ],
    [
        <span key="partner" className="govuk-body">Gabtype</span>,
        <span key="partnerType" className="govuk-body">Industrial</span>,
        <span key="financeContact" className="govuk-body">Marian Stokes</span>,
        <a key="email" href="" className="govuk-link">worth.email.test+marian@gmail.com</a>
    ],
    [
        <span key="partner" className="govuk-body">Jabbertype</span>,
        <span key="partnerType" className="govuk-body">Industrial</span>,
        <span key="financeContact" className="govuk-body">Antonio Jenkins</span>,
        <a key="email" href="" className="govuk-link">antonio.jenkins@jabbertype.example.com</a>
    ],
    [
        <span key="partner" className="govuk-body">Wordpedia</span>,
        <span key="partnerType" className="govuk-body">Academic</span>,
        <span key="financeContact" className="govuk-body">Ralph Young</span>,
        <a key="email" href="" className="govuk-link">tina.taylor@wordpedia.example.com</a>
    ]
];

const projectInfo = [
    {
        key: "Project start date",
        value: "1 February 2017",
    },
    {
        key: "Project end date",
        value: "28 February 2019"
    },
    {
        key: "Project summary",
        value: "The project aims to identify, isolate and correct an issue that has hindered progress in this field for a number of years.\n" +
        "Identification will involve the university testing conditions to determine the exact circumstance of the issue.\n" +
        "Once identification has been assured we will work to isolate the issue but replicating the circumstances in which it occurs within a laboratory environment.\n" +
        "After this we will work with our prototyping partner to create a tool to correct the issue.  Once tested and certified this will be rolled out to mass production.\n"
    }
];

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
    render() {
        return (
            <div>
                {this.renderBackLink()}
                {this.renderTitle()}
                {this.renderTabs(tabListArray)}
                {this.renderProjectMembers()}
                {this.renderTable()}
                {this.renderProjectInfo()}
                {this.renderApplicationInfo()}
            </div>
        );
    }

    private renderBackLink() {
        return (
            <Backlink path="/">Main dashboard</Backlink>
        );
    }

    private renderTitle() {
        const title = "View project";
        const caption = "123: High speed rail and its effects on air quality";

        return (
            <Title caption={caption} title={title} />
        );
    }

    private renderTabs(tabList: string[]) {
        return (
            <Tabs tabList={tabList} id="projectDetailsTabs" spacing="govuk-!-margin-bottom-9"/>
        );
    }
    private renderProjectMembers() {
        return (
            <ProjectMember projectMembers={projectMembers} spacing="govuk-!-margin-bottom-9" heading="Project members" />
        );
    }

    private renderTable() {
        return (
            <Table tableBody={tableBody} tableHeadings={tableHeadings} spacing="govuk-!-margin-bottom-9" />
        );
    }

    private renderProjectInfo() {
        return (
            <div className="govuk-!-margin-bottom-9">
                <h2 className="govuk-heading-m govuk-!-margin-bottom-9">Project information</h2>
                {projectInfo.map(this.renderInfoContent)}
            </div>
        );
    }

    private renderInfoContent(info: Info) {
        const lineSplits = info.key === "Project summary" ? info.value.split("\n") : info.value;
        return (
            <div className="govuk-grid-row govuk-!-margin-top-4">
                <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">{info.key}</h4>
                </div>
                <div className="govuk-grid-column-two-thirds">
                    <p className="govuk-body">{Array.isArray(lineSplits) ? lineSplits.map((text) => (<p className="govuk-body">{text}</p>)) : info.value}</p>
                </div>
            </div>
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

function mapCallbacks(dispach: Dispatch) {
    return {
        loadDetails: (id: string) => dispach({type : "TEST LOAD", payload: id})
    };
}

export const ProjectDetails = ReduxContainer.for<Data, Callbacks>(ProjectDetailsComponent)
    .withData(mapData)
    .withCallbacks(mapCallbacks)
    .connect();
