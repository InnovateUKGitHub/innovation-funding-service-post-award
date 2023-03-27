import { BackLink, Content } from "@ui/components";
import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowParams, MonitoringReportWorkflowWorkflow } from "./MonitoringReportWorkflowProps";

const MonitoringReportWorkflowBackLink = ({
  mode,
  routes,
  projectId,
  workflow,
  id,
}: MonitoringReportWorkflowParams & MonitoringReportWorkflowWorkflow & BaseProps) => {
  if (mode === "view") {
    return (
      <BackLink route={routes.monitoringReportDashboard.getLink({ projectId: projectId })}>
        <Content value={x => x.pages.monitoringReportsWorkflow.backLink} />
      </BackLink>
    );
  }
  const prevStep = workflow.getPrevStepInfo();
  if (!prevStep) {
    return (
      <BackLink
        route={routes.monitoringReportPreparePeriod.getLink({
          projectId,
          id,
        })}
      >
        <Content value={x => x.pages.monitoringReportsWorkflow.backLink} />
      </BackLink>
    );
  }
  return (
    <BackLink
      route={routes.monitoringReportWorkflow.getLink({
        projectId,
        id,
        mode,
        step: prevStep.stepNumber,
      })}
    >
      <Content
        value={x =>
          x.pages.monitoringReportsWorkflow.linkBackToStep({
            step: prevStep.displayName.toLocaleLowerCase(),
          })
        }
      />
    </BackLink>
  );
};

export { MonitoringReportWorkflowBackLink };
