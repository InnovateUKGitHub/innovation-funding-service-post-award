import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRPrepareRoute } from "./prepare";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { fakeDocuments } from "./fakePcrs";

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
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
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
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewReasoningComponent);

export const PCRPrepareReasoning = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    files: Pending.done(fakeDocuments)
  }),
  withCallbacks: () => ({})
});

export const PCRPrepareReasoningRoute = definition.route({
  routeName: "pcrPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId)
  ],
  getTitle: () => ({
    htmlTitle: "Prepare project change request reasoning",
    displayTitle: "Project change request reasoning"
  }),
  container: PCRPrepareReasoning,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
