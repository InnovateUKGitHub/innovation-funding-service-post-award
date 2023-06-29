import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useMonitoringReportPeriodStepQuery } from "./monitoringReportPeriodStep.logic";
import { ProjectRole } from "@framework/constants/project";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { MonitoringReportPeriodFormComponent } from "@ui/components/atomicDesign/organisms/monitoringReports/reportForm/reportForm";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";

export interface MonitoringReportPreparePeriodParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

interface Props {
  project: Pick<ProjectDto, "projectNumber" | "title">;
  editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (save: boolean, dto: MonitoringReportDto, submit?: boolean, link?: ILinkInfo) => void;
}

const PeriodStepComponent = (props: Props & BaseProps & MonitoringReportPreparePeriodParams) => {
  const getLink = (progress: boolean) => {
    if (!progress) {
      return props.routes.monitoringReportDashboard.getLink({
        projectId: props.projectId,
        periodId: undefined,
      });
    }
    return props.routes.monitoringReportWorkflow.getLink({
      projectId: props.projectId,
      id: props.id,
      mode: "prepare",
      step: 1,
    });
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
      pageTitle={<Title projectNumber={props.project.projectNumber} title={props.project.title} />}
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
  });
  const { project } = useMonitoringReportPeriodStepQuery(props.projectId);
  return (
    <PageLoader
      pending={combined}
      render={data => (
        <PeriodStepComponent
          project={project}
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
