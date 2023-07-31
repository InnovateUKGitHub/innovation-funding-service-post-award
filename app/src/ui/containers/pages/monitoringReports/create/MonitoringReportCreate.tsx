import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { MonitoringReportPeriodFormComponent } from "@ui/components/atomicDesign/organisms/monitoringReports/reportForm/reportForm";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps } from "@ui/containers/containerBase";
import {
  MonitoringReportCreateCallbacks,
  MonitoringReportCreateData,
  MonitoringReportCreateParams,
} from "./monitoringReportCreateDef";
import { useMonitoringReportCreateQuery } from "./monitoringReportCreate.logic";

const MonitoringReportCreate = ({
  routes,
  projectId,
  editor,
  onChange,
}: MonitoringReportCreateParams & MonitoringReportCreateData & MonitoringReportCreateCallbacks & BaseProps) => {
  const { project } = useMonitoringReportCreateQuery(projectId);
  const getLink = (progress: boolean) => {
    return (id: MonitoringReportId) => {
      if (!progress) {
        return routes.monitoringReportDashboard.getLink({ projectId, periodId: undefined });
      }
      return routes.monitoringReportWorkflow.getLink({
        projectId,
        id,
        mode: "prepare",
        step: 1,
      });
    };
  };

  return (
    <Page
      backLink={
        <BackLink route={routes.monitoringReportDashboard.getLink({ projectId, periodId: undefined })}>
          <Content value={x => x.pages.monitoringReportsCreate.backLink} />
        </BackLink>
      }
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      validator={editor.validator}
      error={editor.error}
    >
      <MonitoringReportPeriodFormComponent
        editor={editor}
        onChange={dto => onChange(false, dto)}
        onSave={(dto, submit, progress) => onChange(true, dto, submit, getLink(progress))}
      />
    </Page>
  );
};

export { MonitoringReportCreate };
