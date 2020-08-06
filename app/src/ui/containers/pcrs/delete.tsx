import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";

export interface PCRDeleteParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onDelete: (projectId: string, pcrId: string, dto: PCRDto) => void;
}

class PCRDeleteComponent extends ContainerBase<PCRDeleteParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const DeleteForm = ACC.TypedForm<PCRDto>();
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error}
        validator={editor.validator}
      >

        <ACC.Section>
          <ACC.ValidationMessage messageType="alert" message="All the information will be permanently deleted." />
          <ACC.SummaryList qa="pcr_viewItem">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="requestNumber" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.shortName)} />} qa="types" />
            <ACC.SummaryListItem label="Started" content={<ACC.Renderers.ShortDate value={pcr.started} />} qa="started" />
            <ACC.SummaryListItem label="Last updated" content={<ACC.Renderers.ShortDate value={pcr.lastUpdated} />} qa="lastUpdaed" />
          </ACC.SummaryList>
        </ACC.Section>

        <ACC.Section>
          <DeleteForm.Form editor={editor} qa="pcrDelete">
            <DeleteForm.Button name="delete" styling="Warning" onClick={() => this.props.onDelete(this.props.projectId, this.props.pcrId, editor.data)}>Delete request</DeleteForm.Button>
          </DeleteForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const PCRDeleteContainer = (props: PCRDeleteParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRDeleteComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        onDelete={(projectId, pcrId, dto) => stores.projectChangeRequests.deletePcr(projectId, pcrId, dto, "The project change request has been deleted.", () => stores.navigation.navigateTo(props.routes.pcrsDashboard.getLink({ projectId })))}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRDeleteRoute = defineRoute({
  routeName: "pcrDelete",
  routePath: "/projects/:projectId/pcrs/:pcrId/delete",
  container: PCRDeleteContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Delete draft request",
    displayTitle: "Delete draft request"
  }),
  accessControl: (auth, { projectId }, config) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
