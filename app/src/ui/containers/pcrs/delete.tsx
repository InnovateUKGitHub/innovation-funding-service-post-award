import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";

interface Params {
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

class PCRDeleteComponent extends ContainerBase<Params, Data, Callbacks> {
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
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error}
        validator={editor.validator}
      >

        <ACC.Section title="Details">
          <ACC.ValidationMessage messageType="error" message="All the information will be permanently deleted." />
          <ACC.SummaryList qa="pcr_viewItem">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="requestNumber" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.typeName)} />} qa="types" />
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

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRDeleteComponent);

export const PCRDelete = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state),
  }),
  withCallbacks: (dispatch) => ({
    onDelete: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(
      Actions.deletePCR(
        projectId,
        pcrId,
        dto,
        () => dispatch(Actions.navigateBackTo(PCRsDashboardRoute.getLink({ projectId }))),
        "Project change request has been deleted"
      )
    )
  })
});

export const PCRDeleteRoute = definition.route({
  routeName: "pcrDelete",
  routePath: "/projects/:projectId/pcrs/:pcrId/delete",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadPcrTypes(),
  ],
  getTitle: () => ({
    htmlTitle: "Delete project change request",
    displayTitle: "Delete project change request"
  }),
  container: PCRDelete,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
