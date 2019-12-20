import React from "react";
import { BaseProps } from "../containerBase";
import { IStepProps, ISummaryProps, IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { numberComparator } from "@framework/util";
import { MonitoringReportQuestionStep } from "@ui/containers/monitoringReports/questionStep";
import { IEditorStore } from "@ui/redux";

export interface MonitoringReportReportStepProps extends IStepProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, progress: boolean) => void;
}

export interface MonitoringReportReportSummaryProps extends ISummaryProps, BaseProps {

}

export type IMonitoringReportWorkflow = IWorkflow<string, MonitoringReportReportStepProps, MonitoringReportReportSummaryProps>;

export const monitoringReportWorkflowDef = (dto: Dtos.MonitoringReportDto): IMonitoringReportWorkflow => {
  const questions = dto.questions;
  questions.sort((a, b) => (numberComparator(a.displayOrder, b.displayOrder)));
  return {
    steps: questions.map((x, i) => ({
      stepName: `question-${x.displayOrder}`,
      displayName: x.title,
      stepNumber: i + 1,
      stepRender: (props: MonitoringReportReportStepProps) =>
        <MonitoringReportQuestionStep questionNumber={x.displayOrder} {...props}/>
    })),
    summary: {
      summaryRender: () => null
    }
  };
};
export class MonitoringReportWorkflow extends WorkflowBase<string, MonitoringReportReportStepProps, MonitoringReportReportSummaryProps> {
  public constructor(definition: IMonitoringReportWorkflow, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  public static getWorkflow(dto: Dtos.MonitoringReportDto, step: number | undefined): MonitoringReportWorkflow {
    return new MonitoringReportWorkflow(monitoringReportWorkflowDef(dto), step);
  }
}
