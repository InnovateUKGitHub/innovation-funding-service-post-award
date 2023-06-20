import { Content } from "@ui/components/content";
import { Page } from "@ui/components/layout/page";
import { BackLink } from "@ui/components/links";
import { MonitoringReportPeriodFormComponent } from "@ui/components/monitoringReports/reportForm";
import { Title } from "@ui/components/projects/title";
import { BaseProps } from "@ui/containers/containerBase";
import {
  MonitoringReportCreateCallbacks,
  MonitoringReportCreateData,
  MonitoringReportCreateParams,
} from "./monitoringReportCreateDef";

const MonitoringReportCreate = ({
  routes,
  projectId,
  project,
  editor,
  onChange,
}: MonitoringReportCreateParams & MonitoringReportCreateData & MonitoringReportCreateCallbacks & BaseProps) => {
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
      pageTitle={<Title {...project} />}
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
