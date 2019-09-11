import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRDetailsRoute } from "./details";
import { PCRViewReasoningRoute } from "./viewReasoning";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";

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

class PCRViewItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, pcrItem: this.props.pcrItem, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, files: DocumentSummaryDto[]) {
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
        {this.renderArrows(pcr, pcrItem)}
      </ACC.Page>
    );
  }

  private  renderArrows(pcr: PCRDto, pcrItem: PCRItemDto): React.ReactNode {
    const index = pcr.items.findIndex(x => x.id === pcrItem.id);
    const prev = this.getLinkForItem(pcr.items[index - 1], false);
    const next = this.getLinkForItem(pcr.items[index + 1], true);
    return <ACC.NavigationArrows previousLink={prev} nextLink={next}/>;
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
      route: PCRViewItemRoute.getLink({pcrId: this.props.pcrId, projectId: this.props.projectId, itemId: pcrItem.id})
    };
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewItemComponent);

export const PCRViewItem = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    pcrItem: Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(state),
    files: Selectors.getProjectChangeRequestDocumentsOrItemDocuments(params.itemId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const PCRViewItemRoute = definition.route({
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadProjectChangeRequestDocumentsOrItemDocuments(params.projectId, params.itemId)
  ],
  getTitle: () => ({
    htmlTitle: "Project change request item",
    displayTitle: "Project change request item"
  }),
  container: PCRViewItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
