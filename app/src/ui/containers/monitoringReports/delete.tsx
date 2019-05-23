import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import * as Dtos from "@framework/dtos";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { MonitoringReportDashboardRoute, MonitoringReportPrepareRoute } from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { IEditorStore } from "@ui/redux";
import { Pending } from "@shared/pending";

interface Callbacks {
  deleteDocument: (dto: Dtos.MonitoringReportDto) => void;
}

interface Params {
  projectId: string;
  id: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

class DeleteVerificationComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data.project, data.editor)} />;
  }

  renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const DeleteForm = ACC.TypedForm<Dtos.MonitoringReportDto>();
    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project} />}
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
      >
        <ACC.Section>
          <ACC.Renderers.SimpleString>All the information in the report will be permanently removed.</ACC.Renderers.SimpleString>
          <DeleteForm.Form editor={editor}>
            <DeleteForm.Fieldset>
              <DeleteForm.Button
                name="delete"
                styling="Warning"
                className="govuk-!-font-size-19"
                onClick={() => this.props.deleteDocument(editor.data)}
                value={editor.data.headerId}
              >
                Delete report
              </DeleteForm.Button>
            </DeleteForm.Fieldset>
          </DeleteForm.Form>
          <ACC.Link
            route={MonitoringReportPrepareRoute.getLink({projectId: editor.data.projectId, id: editor.data.headerId})}
            className="govuk-body"
          >
            Return to draft report
          </ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(DeleteVerificationComponent);

export const MonitoringReportDelete = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    editor: Selectors.getMonitoringReportEditor(props.projectId, props.id).get(state),
  }),
  withCallbacks: (dispatch) => ({
    deleteDocument: (dto) => {
      dispatch(Actions.deleteMonitoringReport(
        dto,
        () => dispatch(Actions.navigateTo(MonitoringReportDashboardRoute.getLink({ projectId: dto.projectId }))),
        "You have deleted the monitoring report.")
      );
    }
  })
});

export const MonitoringReportDeleteRoute = containerDefinition.route({
  routeName: "monitoringReportDeleteVerification",
  routePath: "/projects/:projectId/monitoring-reports/:id/delete",
  getParams: (route) => ({
    projectId: route.params.projectId,
    id: route.params.id
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReport(params.projectId, params.id)
  ],
  container: MonitoringReportDelete,
  getTitle: () => ({
    htmlTitle: "Delete monitoring report",
    displayTitle: "Monitoring report"
  }),
  accessControl: (auth, { projectId }, features) => features.monitoringReports && auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
});
