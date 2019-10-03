import React from "react";

import { BaseProps, ContainerBase, defineRoute, ReduxContainer } from "../containerBase";
import { ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDetailsRoute } from "./details";
import { PCRReviewItemRoute, PCRViewItemRoute } from "./viewItem";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { StoresConsumer } from "@ui/redux";
import { PCRReviewRoute } from "./review";
import { NavigationArrowsForPCRs } from "./navigationArrows";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  files: Pending<DocumentSummaryDto[]>;
  isReviewing: boolean;
}

interface Callbacks {
}

class PCRViewReasoningComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, files: DocumentSummaryDto[]) {
    const backLink = this.props.isReviewing ?
      <ACC.BackLink route={PCRReviewRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to review project change request</ACC.BackLink> :
      <ACC.BackLink route={PCRDetailsRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to project change request details</ACC.BackLink>
      ;
    return (
      <ACC.Page
        backLink={backLink}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr_reasoning">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.typeName)}/>} qa="typesRow" />
            <ACC.SummaryListItem label="Comments" content={pcr.reasoningComments} qa="comments" />
            <ACC.SummaryListItem
              label="Files"
              content={files.length ? <ACC.DocumentList documents={files} qa="docs" /> : "No documents attached"}
              qa="files"
            />
          </ACC.SummaryList>
        </ACC.Section>
        <NavigationArrowsForPCRs pcr={pcr} currentItem={null} isReviewing={this.props.isReviewing}/>
      </ACC.Page>
    );
  }
}

const PCRViewReasoningContainer = (props: Params & BaseProps & { isReviewing: boolean }) => (
  <StoresConsumer>
    {
      stores => (
        <PCRViewReasoningComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          files={stores.documents.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
          isReviewing={false}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const PCRViewReasoningRoute = defineRoute<Params>({
  routeName: "pcrViewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/reasoning",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  container: (params) => <PCRViewReasoningContainer isReviewing={false} {...params} />,
  getTitle: () => ({
    htmlTitle: "Project change request reasoning",
    displayTitle: "Project change request reasoning"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});

export const PCRReviewReasoningRoute = defineRoute<Params>({
  routeName: "pcrReviewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/reasoning",
  container: (params) => <PCRViewReasoningContainer isReviewing={true} {...params} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getTitle: () => ({
    htmlTitle: "Review project change request reasoning",
    displayTitle: "Review project change request reasoning"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});
