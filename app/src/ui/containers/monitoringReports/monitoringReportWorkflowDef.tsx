import React from "react";
import { IStepProps, ISummaryProps, IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { numberComparator } from "@framework/util";
import { MonitoringReportQuestionStep } from "@ui/containers/monitoringReports/questionStep";
import { IEditorStore } from "@ui/redux";
import { MonitoringReportSummary } from "@ui/containers";
import { IRoutes } from "@ui/routing";
import { ILinkInfo } from "@framework/types";

export interface MonitoringReportReportStepProps extends IStepProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, progress: boolean) => void;
}

export interface MonitoringReportReportSummaryProps extends ISummaryProps {
  projectId: string;
  id: string;
  mode: "prepare" | "view";
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit?: boolean) => void;
  routes: IRoutes;
  // TODO type step name
  getEditLink: (stepName: string) => ILinkInfo;
}

export type IMonitoringReportWorkflow = IWorkflow<string, MonitoringReportReportStepProps, MonitoringReportReportSummaryProps>;

const getQuestionSteps = (dto: Dtos.MonitoringReportDto, startingStepNumber: number) => {
  return dto.questions
    .sort((a, b) => (numberComparator(a.displayOrder, b.displayOrder)))
    .map((x, i) => ({
    stepName: `question-${x.displayOrder}`,
    displayName: x.title,
    stepNumber: i + startingStepNumber,
    stepRender: (props: MonitoringReportReportStepProps) =>
      <MonitoringReportQuestionStep questionNumber={x.displayOrder} {...props}/>
  }));
};

const monitoringReportWorkflowDef = (dto: Dtos.MonitoringReportDto): IMonitoringReportWorkflow => {
  const questions = dto.questions;
  questions.sort((a, b) => (numberComparator(a.displayOrder, b.displayOrder)));
  return {
    steps: getQuestionSteps(dto, 1),
    summary: {
      summaryRender: MonitoringReportSummary
    }
  };
};

export class MonitoringReportWorkflowDef extends WorkflowBase<string, MonitoringReportReportStepProps, MonitoringReportReportSummaryProps> {
  public constructor(definition: IMonitoringReportWorkflow, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  public static getWorkflow(dto: Dtos.MonitoringReportDto, step: number | undefined): MonitoringReportWorkflowDef {
    return new MonitoringReportWorkflowDef(monitoringReportWorkflowDef(dto), step);
  }
}
