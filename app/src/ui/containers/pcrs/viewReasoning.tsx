import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRDetailsRoute } from "./details";
import { PCRViewItemRoute } from "./viewItem";
import { PCRDto } from "@framework/dtos/pcrDtos";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  files: Pending<DocumentSummaryDto[]>;
}

interface Callbacks {
}

class PCRViewReasoningComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, files: DocumentSummaryDto[]) {
    const lastItem = pcr.items[pcr.items.length - 1];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRDetailsRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to project change request details</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section title="Details">
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Type</dt>
              <dd className="govuk-summary-list__value">Reasoning for Innovate UK</dd>
              <dd className="govuk-summary-list__actions"/>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Comments</dt>
              <dd className="govuk-summary-list__value">{pcr.reasoningComments}</dd>
              <dd className="govuk-summary-list__actions"/>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Files</dt>
              <dd className="govuk-summary-list__value"><ACC.DocumentList documents={files} qa="docs" /></dd>
              <dd className="govuk-summary-list__actions"/>
            </div>
          </dl>
        </ACC.Section>
        <ACC.NavigationArrows previousLink={{label: lastItem.typeName, route: PCRViewItemRoute.getLink({projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: lastItem.id })}}/>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewReasoningComponent);

export const PCRViewReasoning = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    files: Selectors.getProjectChangeRequestDocumentsOrItemDocuments(params.pcrId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const PCRViewReasoningRoute = definition.route({
  routeName: "pcrViewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/reasoning",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadProjectChangeRequestDocumentsOrItemDocuments(params.projectId, params.pcrId),
  ],
  getTitle: () => ({
    htmlTitle: "Project change request reasoning",
    displayTitle: "Project change request reasoning"
  }),
  container: PCRViewReasoning,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
