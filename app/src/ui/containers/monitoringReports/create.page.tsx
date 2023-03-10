import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components/index";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { ILinkInfo, ProjectRole } from "@framework/types";

export interface MonitoringReportCreateParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (
    save: boolean,
    dto: Dtos.MonitoringReportDto,
    submit?: boolean,
    getLink?: (id: string) => ILinkInfo,
  ) => void;
}

class Component extends ContainerBase<MonitoringReportCreateParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data.project, data.editor)} />;
  }

  private renderContents(
    project: Dtos.ProjectDto,
    editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>,
  ) {
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink
            route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}
          >
            <ACC.Content value={x => x.pages.monitoringReportsCreate.backLink} />
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.MonitoringReportPeriodFormComponent
          editor={editor}
          onChange={dto => this.props.onChange(false, dto)}
          onSave={(dto, submit, progress) => this.props.onChange(true, dto, submit, this.getLink(progress))}
        />
      </ACC.Page>
    );
  }

  private getLink(progress: boolean) {
    return (id: string) => {
      if (!progress) {
        return this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId });
      }
      return this.props.routes.monitoringReportWorkflow.getLink({
        projectId: this.props.projectId,
        id,
        mode: "prepare",
        step: 1,
      });
    };
  }
}

const Container = (props: MonitoringReportCreateParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  return (
    <Component
      {...props}
      project={stores.projects.getById(props.projectId)}
      editor={stores.monitoringReports.getCreateMonitoringReportEditor(props.projectId)}
      onChange={(save, dto, submit, getLink) => {
        stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, newDto => {
          if (getLink) {
            navigate(getLink(newDto.headerId).path);
          }
        });
      }}
    />
  );
};

export const MonitoringReportCreateRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportCreate",
  routePath: "/projects/:projectId/monitoring-reports/create",
  container: Container,
  getParams: r => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsCreate.title),
});
