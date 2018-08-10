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

class ProjectDetailsComponent extends ContainerBase<Data, Callbacks> {
    render() {
        return (
            <div>
                {this.renderBackLink()}
                {this.renderTitle()}
                {this.renderTabs(tabListArray)}
                <h2 className="govuk-heading-m govuk-!-margin-bottom-7">Project members</h2>
                {projectMembers.map(member => this.renderProjectMember(member))}
                <div className="govuk-!-margin-top-9 govuk-!-margin-bottom-9">{this.renderTable()}</div>
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
                <h1 className="govuk-heading-xl">
                    View project
                </h1>
            </div>
        );
    }

    private renderTabs(tabList: string[]) {
        return (
            <div id="uniqueTabId" className="govuk-tabs" data-module="tabs">
                <ul className="govuk-tabs__list">
                    {tabList.map(tab => this.renderTab(tab))}
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

    private renderProjectMember(member: Members) {
        return (
            <div className="govuk-!-margin-bottom-4">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{member.role}</h3>
                <p className="govuk-body govuk-!-margin-bottom-0">{member.name}</p>
                <a href="" className="govuk-link">{member.email}</a>
            </div>
        );
    }

    private renderTable() {
        return (
            <table className="govuk-table">
                <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    <th className="govuk-table__header" scope="col">Partner</th>
                    <th className="govuk-table__header" scope="col">Partner type</th>
                    <th className="govuk-table__header" scope="col">Finance contact</th>
                    <th className="govuk-table__header" scope="col">Email</th>
                </tr>
                </thead>
                <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                    <th className="govuk-table__cell" scope="row">First 6 weeks</th>
                    <td className="govuk-table__cell ">£109.80 per week</td>
                </tr>
                <tr className="govuk-table__row">
                    <th className="govuk-table__cell" scope="row">Next 33 weeks</th>
                    <td className="govuk-table__cell ">£109.80 per week</td>
                </tr>
                <tr className="govuk-table__row">
                    <th className="govuk-table__cell" scope="row">Total estimated pay</th>
                    <td className="govuk-table__cell ">£4,282.20</td>
                </tr>
                </tbody>
            </table>
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
