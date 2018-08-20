import React from "react";
import { Dispatch } from "redux";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux";
import { Backlink, forData, ProjectMembers, Tabs, Title } from "../../components";
import { routeConfig } from "../../routing";

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
    const tableData = [
      { partner: "123", partnerType: 233, financeContact: "233", email: 233 },
      { partner: "1", partnerType: 233, financeContact: "ASD", email: 233 },
      { partner: "3", partnerType: 233, financeContact: "233", email: 233 },
    ];

    const Table = forData(tableData);

    return (
      <div>
        <Backlink route={routeConfig.home}>Main dashboard</Backlink>
        <Title title="View project" caption="123: High speed rail and its effects on air quality" />
        <Tabs tabList={tabListArray} selected="Project details" className="govuk-!-margin-bottom-9"/>
        <ProjectMembers projectMembers={projectMembers} className="govuk-!-margin-bottom-9" />

        <Table.Table>
          <Table.String header="Partner" value={x => x.partner} />
          <Table.Number header="Partner Type" value={x => x.partnerType} />
          <Table.String header="Finance Contact" value={x => x.financeContact} />
          <Table.Number header="Email" value={x => x.email} />
        </Table.Table>

        {this.renderProjectInfo()}
        {this.renderApplicationInfo()}
      </div>
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

function mapCallbacks(dispatch: Dispatch) {
    return {
        loadDetails: (id: string) => dispatch({type : "TEST LOAD", payload: id})
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
