import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux/reducers/rootReducer";
import { Dispatch } from "redux";

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
        "Ooba (Lead)",
        "Industrial",
        "Ralph Young",
        "ralph.young@ooba.example.com"
    ],
    [
        "Jabbertype",
        "Industrial",
        "Antonio Jenkins",
        "antonio.jenkins@jabbertype.example.com"
    ],
    [
        "Wordpedia",
        "Academic",
        "Tina Taylor",
        "tina.taylor@wordpedia.example.com"
    ],
    [
        "Gabtype",
        "Industrial",
        "Marian Stokes",
        "worth.email.test+marian@gmail.com"
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

interface Members {
    role: string;
    name: string;
    email: string;
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
                <div className="govuk-!-margin-top-9 govuk-!-margin-bottom-9">{this.renderTable()}</div>
                {this.renderProjectInfo()}
                {this.renderApplicationInfo()}
            </div>
        );
    }

    private renderBackLink() {
        return (
            <a href="/" className="govuk-back-link">Main dashboard</a>
        );
    }

    private renderTitle() {
        return (
            <div className="app-content_header">
                <span className="govuk-caption-xl">
                    123: High speed rail and its effects on air quality
                </span>
                <h1 className="govuk-heading-xl govuk-!-margin-bottom-9">
                    View project
                </h1>
            </div>
        );
    }

    private renderTabs(tabList: string[]) {
        return (
            <div id="uniqueTabId" className="govuk-tabs govuk-!-margin-bottom-9" data-module="tabs">
                <ul className="govuk-tabs__list">
                    {tabList.map(this.renderTab)}
                </ul>
            </div>
        );
    }

    private renderTab(tab: string) {
        return (
            <li className="govuk-tabs__list-item">
                <a href="" className="govuk-tabs__tab">{tab}</a>
            </li>
        );
    }

    private renderProjectMembers() {
        return (
            <div className="govuk-!-margin-bottom-9">
                <h2 className="govuk-heading-m govuk-!-margin-bottom-9">Project members</h2>
                {projectMembers.map(this.renderProjectMember)}
            </div>
        );
    }

    private renderProjectMember(member: Members) {
        return (
            <div className="govuk-!-margin-bottom-9">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{member.role}</h3>
                <p className="govuk-body govuk-!-margin-bottom-0">{member.name}</p>
                <a href="" className="govuk-link govuk-!-font-size-19">{member.email}</a>
            </div>
        );
    }

    private renderTable() {
        return (
            <table className="govuk-table">
                <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    {tableHeadings.map(this.renderTableHeadings)}
                </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {tableBody.map(this.renderRow)}
                </tbody>
            </table>
        );
    }

    // Called by renderTable
    private renderTableHeadings(heading: string) {
        return (
            <th className="govuk-table__header" scope="col">{heading}</th>
        );
    }

    // Called by renderTableHeadings
    private renderRow(entries: string[]) {
        return (
            <tr className="govuk-table__row">
                {entries.map(entry => (
                    <td className="govuk-table__cell" scope="row">{entry}</td>
                ))}
            </tr>
        );
    }

    private renderProjectInfo() {
        return (
            <div className="govuk-!-margin-bottom-9 govuk-!-margin-top-9">
                <h2 className="govuk-heading-m govuk-!-margin-bottom-9">Project information</h2>
                {projectInfo.map(this.renderInfoContent)}
            </div>
        );
    }

    private renderInfoContent(info: Info) {
        return (
            <div className="govuk-grid-row govuk-!-margin-top-4">
                <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">{info.key}</h4>
                </div>
                <div className="govuk-grid-column-two-thirds">
                    <span className="govuk-body">{info.value}</span>
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

function mapCallbacks(dispach: Dispatch){
    return {
        loadDetails: (id: string) => dispach({type : "TEST LOAD", payload: id})
    };
}

export const ProjectDetails = ReduxContainer.for<Data, Callbacks>(ProjectDetailsComponent)
    .withData(mapData)
    .withCallbacks(mapCallbacks)
    .connect();
