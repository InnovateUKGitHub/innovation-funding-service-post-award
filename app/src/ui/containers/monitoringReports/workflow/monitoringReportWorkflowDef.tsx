import { IStepProps, ISummaryProps, IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator, QuestionValidator } from "@ui/validators";
import { numberComparator } from "@framework/util";
import { MonitoringReportQuestionStep } from "@ui/containers/monitoringReports/workflow/questionStep";
import { IEditorStore } from "@ui/redux";
import { MonitoringReportSummary } from "@ui/containers/monitoringReports/workflow/monitoringReportSummary";
import { IRoutes } from "@ui/routing";
import { ILinkInfo } from "@framework/types";
import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowParams, MonitoringReportWorkflowWorkflow } from "./MonitoringReportWorkflowProps";

export interface MonitoringReportReportStepProps extends IStepProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, progress: boolean) => void;
}

export interface MonitoringReportReportSummaryProps extends ISummaryProps {
  projectId: ProjectId;
  id: MonitoringReportId;
  mode: "prepare" | "view";
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit?: boolean) => void;
  routes: IRoutes;
  // TODO type step name
  getEditLink: (stepName: string) => ILinkInfo;
}

export type IMonitoringReportWorkflow = IWorkflow<
  string,
  MonitoringReportReportStepProps,
  MonitoringReportReportSummaryProps,
  MonitoringReportDtoValidator
>;

const getQuestionSteps = (dto: Dtos.MonitoringReportDto, startingStepNumber: number) => {
  return dto.questions
    .sort((a, b) => numberComparator(a.displayOrder, b.displayOrder))
    .map((x, i) => ({
      stepName: `question-${x.displayOrder}`,
      displayName: x.title,
      stepNumber: i + startingStepNumber,
      validation: (val: MonitoringReportDtoValidator) =>
        val.responses.results.find(response => response.question.displayOrder === x.displayOrder) as QuestionValidator,
      stepRender: function QuestionStepWrapper(props: MonitoringReportReportStepProps) {
        return <MonitoringReportQuestionStep questionNumber={x.displayOrder} {...props} />;
      },
    }));
};

const monitoringReportWorkflowDef = (dto: Dtos.MonitoringReportDto): IMonitoringReportWorkflow => {
  const questions = dto.questions;
  questions.sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));
  return {
    steps: getQuestionSteps(dto, 1),
    summary: {
      validation: val => val,
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
}: MonitoringReportWorkflowParams & MonitoringReportWorkflowWorkflow & BaseProps & { progress: boolean }) => {
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
  MonitoringReportReportSummaryProps,
  MonitoringReportDtoValidator
> {
  public constructor(definition: IMonitoringReportWorkflow, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  public static getWorkflow(dto: Dtos.MonitoringReportDto, step: number | undefined): MonitoringReportWorkflowDef {
    return new MonitoringReportWorkflowDef(monitoringReportWorkflowDef(dto), step);
  }
}
