import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRViewItemRoute } from "./viewItem";
import { PCRViewReasoningRoute } from "./viewReasoning";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";

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
          <ACC.SummaryList>
            <ACC.SummaryListItem label="Number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(pcr)} action={<a className="govuk-link" href="#type">Add type</a>} qa="typesRow"/>
          </ACC.SummaryList>
        </ACC.Section>
        <ol className="app-task-list">
          {pcr.items.map((x, i) => this.renderItem(x, i+1))}
          {this.renderReasoning(pcr)}
        </ol>
      </ACC.Page>
    );
  }

  private renderTypes(pcr: PCRDto): React.ReactNode {
    return pcr.items.map(x => x.typeName).reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }

  private renderReasoning(pcr: PCRDto) {
    return this.renderListItem(pcr.items.length + 1, "View more details", "Reasoning for Innovate UK", pcr.reasoningStatusName, PCRViewReasoningRoute.getLink({projectId: this.props.projectId, pcrId: this.props.pcrId}));
  }

  private renderItem(item: PCRItemDto, step: number) {
    return this.renderListItem(step, item.typeName, "View files", item.statusName, PCRViewItemRoute.getLink({projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id}));
  }

  private renderListItem(step: number, title: string, text: string, status: string, route: ILinkInfo) {
    return (
      <li key={step}>
        <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{title}</h2>
        <ul className="app-task-list__items">
          <li className="app-task-list__item">
            <span className="app-task-list__task-name"><ACC.Link route={route}>{text}</ACC.Link></span>
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
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
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
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
  ],
  getTitle: () => ({
    htmlTitle: "Project change request details",
    displayTitle: "Project change request details"
  }),
  container: PCRDetails,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
