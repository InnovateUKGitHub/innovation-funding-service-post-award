import React, { ReactNode } from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCR, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/entities";
import { PCRDetailsRoute } from "./details";
import { range } from "@shared/range";

interface PCRItemDto {
  id: string;
  type: PCRItemType;
  typeName: string;
  status: PCRItemStatus;
  statusName: string;
}

const fakeItemTypes = ["Scope", "Duration", "Cost", "Partner"];

const fakePcrItem: PCRItemDto = {
  id: `PCR-Item-Id`,
  status: PCRItemStatus.Unknown,
  statusName: "To do",
  type: PCRItemType.Unknown,
  typeName: "Scope",
};

const fakeDocuments: DocumentSummaryDto[] = range(3).map<DocumentSummaryDto>(x => ({
  id: `Doc${x}`,
  fileName: `doc${x}.txt`,
  fileSize: 0,
  link: "#",
  dateCreated: new  Date(),
}));

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcrItem: Pending<PCRItemDto>;
  files: Pending<DocumentSummaryDto[]>;
}

interface Callbacks {
}

class PCRViewItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcrItem: this.props.pcrItem, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcrItem, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcrItem: PCRItemDto, files: DocumentSummaryDto[]) {
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
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewItemComponent);

export const PCRViewItem = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcrItem: Pending.done(fakePcrItem),
    files: Pending.done(fakeDocuments)
  }),
  withCallbacks: () => ({})
});

export const PCRViewItemRoute = definition.route({
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.pcrId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId)
  ],
  getTitle: () => ({
    htmlTitle: "Project change request item",
    displayTitle: "Project change request item"
  }),
  container: PCRViewItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
