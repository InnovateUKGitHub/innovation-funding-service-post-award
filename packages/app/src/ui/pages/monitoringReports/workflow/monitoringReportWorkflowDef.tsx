import { IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import { MonitoringReportQuestionStep } from "@ui/pages/monitoringReports/workflow/monitoringReportQuestionStep";
import { MonitoringReportSummary } from "@ui/pages/monitoringReports/workflow/monitoringReportSummary";
import { IRoutes } from "@ui/routing/routeConfig";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { numberComparator } from "@framework/util/comparator";

export type IMonitoringReportWorkflow = IWorkflow<string>;

const getQuestionSteps = (dto: MonitoringReportDto, startingStepNumber: number) => {
  return dto.questions
    .sort((a, b) => numberComparator(a.displayOrder, b.displayOrder))
    .map((x, i) => ({
      stepName: `question-${x.displayOrder}`,
      displayName: x.title,
      stepNumber: i + startingStepNumber,
      stepRender: function QuestionStepWrapper() {
        return <MonitoringReportQuestionStep questionNumber={x.displayOrder} />;
      },
    }));
};

const monitoringReportWorkflowDef = (dto: MonitoringReportDto) => {
  const questions = dto.questions;
  questions.sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));
  return {
    steps: getQuestionSteps(dto, 1),
    summary: {
      summaryRender: MonitoringReportSummary,
    },
  };
};

export const getForwardLink = ({
  mode,
  routes,
  projectId,
  workflow,
  id,
  progress,
}: {
  mode: "prepare" | "view";
  routes: IRoutes;
  projectId: ProjectId;
  id: MonitoringReportId;
  workflow: MonitoringReportWorkflowDef;
  progress: boolean;
}) => {
  if (progress) {
    const nextStep = workflow.getNextStepInfo();
    return routes.monitoringReportWorkflow.getLink({
      projectId,
      id,
      mode,
      step: nextStep && nextStep.stepNumber,
    });
  }
  if (workflow.isOnSummary()) {
    return routes.monitoringReportDashboard.getLink({ projectId, periodId: undefined });
  }
  return routes.monitoringReportWorkflow.getLink({
    projectId,
    id,
    mode,
    step: undefined,
  });
};

export class MonitoringReportWorkflowDef extends WorkflowBase<string> {
  public constructor(definition: IMonitoringReportWorkflow, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  public static getWorkflow(dto: MonitoringReportDto, step: number | undefined): MonitoringReportWorkflowDef {
    return new MonitoringReportWorkflowDef(monitoringReportWorkflowDef(dto), step);
  }
}
