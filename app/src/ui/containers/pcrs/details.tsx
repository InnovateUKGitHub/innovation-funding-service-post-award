import React, { ReactNode } from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/entities";
import { PCRsDashboardRoute } from "./dashboard";

interface PCRItemDto {
  id: string;
  type: PCRItemType;
  typeName: string;
  status: PCRItemStatus;
  statusName: string;
}

interface PCRDto {
  id: string;
  requestNumber: number;
  items: PCRItemDto[];
  started: Date;
  lastUpdated: Date;
  status: PCRStatus;
  statusName: string;
  comments: string;
  reasoningStatus: PCRItemStatus;
  reasoningStatusName: string;
}

const fakeItemTypes = ["Scope", "Duration", "Cost", "Partner"];
const fakeStatus = ["Approved", "Draft", "Submitted to MO", "Queried", "Submitted to IUK"];

const fakePcr: PCRDto = {
  comments: "Some comments",
  id: "PCR-ID",
  lastUpdated: new Date(),
  reasoningStatus: PCRItemStatus.Unknown,
  reasoningStatusName: "To do",
  requestNumber: 1,
  started: new Date(),
  status: PCRStatus.Unknown,
  statusName: "PCR Status",
  items: fakeItemTypes.map((x, i) => ({
    id: `PCR-Item-${i + 1}`,
    status: PCRItemStatus.Unknown,
    statusName: "To do",
    type: PCRItemType.Unknown,
    typeName: x,
  }))
};

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
}

interface Callbacks {
}

class PCRDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section title="Details">
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Number</dt>
              <dd className="govuk-summary-list__value">{pcr.requestNumber}</dd>
              <dd className="govuk-summary-list__actions"/>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Types</dt>
              <dd className="govuk-summary-list__value">{this.renderTypes(pcr)}</dd>
              <dd className="govuk-summary-list__actions">
                <a className="govuk-link" href="#type">Add type</a>
              </dd>
            </div>
          </dl>
        </ACC.Section>
        <ol className="app-task-list">
          {this.renderItem(1, "Give more details", "Reasoning for Innovate UK", pcr.reasoningStatusName)}
          {pcr.items.map((x, i) => this.renderItem(i + 2, x.typeName, "Provide your files", x.statusName))}
        </ol>
      </ACC.Page>
    );
  }

  private renderTypes(pcr: PCRDto): React.ReactNode {
    return pcr.items.map(x => x.typeName).reduce<ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }

  private renderItem(step: number, title: string, text: string, status: string) {
    return (
      <li>
        <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{title}</h2>
        <ul className="app-task-list__items">
          <li className="app-task-list__item">
            <span className="app-task-list__task-name"><a href={`#${step}`} className="govuk-link">{text}</a></span>
            <span className="app-task-list__task-completed">{status}</span>
          </li>
        </ul>
      </li>
    );
  }

}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRDetailsComponent);

export const PCRDetails = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Pending.done(fakePcr)
  }),
  withCallbacks: () => ({})
});

export const PCRDetailsRoute = definition.route({
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId)
  ],
  getTitle: () => ({
    htmlTitle: "Project change request",
    displayTitle: "Project change request"
  }),
  container: PCRDetails,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
