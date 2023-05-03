import { useNavigate } from "react-router-dom";
import { PageLoader, BackLink, Page, Content, Projects, MonitoringReportPeriodFormComponent } from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { ILinkInfo, ProjectRole } from "@framework/types";

export interface MonitoringReportPreparePeriodParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

interface Props {
  project: Dtos.ProjectDto;
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean, link?: ILinkInfo) => void;
}

const PeriodStepComponent = (props: Props & BaseProps & MonitoringReportPreparePeriodParams) => {
  const getLink = (progress: boolean) => {
    if (!progress) {
      return props.routes.monitoringReportDashboard.getLink({
        projectId: props.projectId,
        periodId: undefined,
      });
    }
  };
  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.monitoringReportWorkflow.getLink({
            projectId: props.projectId,
            id: props.id,
            mode: "prepare",
            step: undefined,
          })}
        >
          <Content value={x => x.pages.monitoringReportsPeriodStep.backLink} />
        </BackLink>
      }
      pageTitle={<Projects.Title projectNumber={props.project.projectNumber} title={props.project.title} />}
      validator={props.editor.validator}
      error={props.editor.error}
    >
      <MonitoringReportPeriodFormComponent
        editor={props.editor}
        onChange={dto => props.onChange(false, dto)}
        onSave={(dto, submit, progress) => props.onChange(true, dto, submit, getLink(progress))}
      />
    </Page>
  );
};

const Container = (props: MonitoringReportPreparePeriodParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const combined = Pending.combine({
    editor: stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id),
    project: stores.projects.getById(props.projectId),
  });
  return (
    <PageLoader
      pending={combined}
      render={data => (
        <PeriodStepComponent
          onChange={(save, dto, submit, link) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              if (link) {
                navigate(link.path);
              }
            });
          }}
          {...data}
          {...props}
        />
      )}
    />
  );
};

export const MonitoringReportPreparePeriodRoute = defineRoute({
  routeName: "monitoringReportPreparePeriod",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare-period",
  container: Container,
  getParams: r => ({ projectId: r.params.projectId as ProjectId, id: r.params.id as MonitoringReportId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsPeriodStep.title),
});
