import React, { ReactNode } from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { fakeDocuments } from "./fakePcrs";
import { PCRViewReasoningRoute } from "./viewReasoning";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { PCRPrepareRoute } from "./prepare";

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  files: Pending<DocumentSummaryDto[]>;
}

interface Callbacks {
}

class PCRPrepareItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, pcrItem: this.props.pcrItem, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, files: DocumentSummaryDto[]) {
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
              <dd className="govuk-summary-list__value">{pcrItem.typeName}</dd>
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

  private getLinkForItem(pcrItem: PCRItemDto, isLast: boolean) {
    if(!pcrItem && !isLast) {
      return null;
    }
    if(!pcrItem && isLast) {
      return { label: "Reasoning", route: PCRViewReasoningRoute.getLink({pcrId: this.props.pcrId, projectId: this.props.projectId})};
    }
    return {
      label: pcrItem.typeName,
      route: PCRPrepareItemRoute.getLink({pcrId: this.props.pcrId, projectId: this.props.projectId, itemId: pcrItem.id})
    };
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRPrepareItemComponent);

export const PCRPrepareItem = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    pcrItem: Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(state),
    files: Pending.done(fakeDocuments)
  }),
  withCallbacks: () => ({})
});

export const PCRPrepareItemRoute = definition.route({
  routeName: "pcrPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId)
  ],
  getTitle: () => ({
    htmlTitle: "Project change request item",
    displayTitle: "Project change request item"
  }),
  container: PCRPrepareItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
