import { IStepProps, ISummaryProps, IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import { MonitoringReportQuestionStep } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportQuestionStep";
import { MonitoringReportSummary } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportSummary";
import { IRoutes } from "@ui/routing/routeConfig";
import { MonitoringReportDto, MonitoringReportStatusChangeDto } from "@framework/dtos/monitoringReportDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { numberComparator } from "@framework/util/comparator";
import { BaseProps } from "@ui/containers/containerBase";

export interface MonitoringReportReportStepProps extends IStepProps {
  report: MonitoringReportDto;
  mode: "prepare" | "view";
}

export interface MonitoringReportReportSummaryProps extends ISummaryProps {
  projectId: ProjectId;
  id: MonitoringReportId;
  mode: "prepare" | "view";
  report: Pick<MonitoringReportDto, "startDate" | "endDate" | "questions" | "periodId">;
  getEditLink: (stepName: string) => ILinkInfo;
  statusChanges: Pick<MonitoringReportStatusChangeDto, "newStatusLabel" | "createdBy" | "createdDate" | "comments">[];
}

export type IMonitoringReportWorkflow = IWorkflow<
  string,
  MonitoringReportReportStepProps,
  MonitoringReportReportSummaryProps & BaseProps,
  undefined
>;

const getQuestionSteps = (dto: MonitoringReportDto, startingStepNumber: number) => {
  return dto.questions
    .sort((a, b) => numberComparator(a.displayOrder, b.displayOrder))
    .map((x, i) => ({
      stepName: `question-${x.displayOrder}`,
      displayName: x.title,
      stepNumber: i + startingStepNumber,
      stepRender: function QuestionStepWrapper(props: MonitoringReportReportStepProps) {
        return <MonitoringReportQuestionStep questionNumber={x.displayOrder} {...props} />;
      },
    }));
};

const monitoringReportWorkflowDef = (dto: MonitoringReportDto): IMonitoringReportWorkflow => {
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

export class MonitoringReportWorkflowDef extends WorkflowBase<
  string,
  MonitoringReportReportStepProps,
  MonitoringReportReportSummaryProps & BaseProps,
  undefined
> {
  public constructor(definition: IMonitoringReportWorkflow, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  public static getWorkflow(dto: MonitoringReportDto, step: number | undefined): MonitoringReportWorkflowDef {
    return new MonitoringReportWorkflowDef(monitoringReportWorkflowDef(dto), step);
  }
}
