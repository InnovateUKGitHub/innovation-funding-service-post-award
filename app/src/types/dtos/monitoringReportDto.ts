import { MonitoringReportStatus } from "../constants/monitoringReportStatus";

export interface OptionDto {
  id: string;
  questionText: string;
  questionScore: number;
}

export interface QuestionDto {
  responseId?: string;
  optionId?: string;
  title: string;
  comments?: string;
  options: OptionDto[];
  displayOrder: number;
}

export interface MonitoringReportDto {
  headerId: string;
  status: MonitoringReportStatus;
  startDate: Date;
  endDate: Date;
  projectId: string;
  periodId: number;
  questions: QuestionDto[];
}

export interface MonitoringReportSummaryDto {
  headerId: string;
  status: MonitoringReportStatus;
  startDate: Date;
  endDate: Date;
  periodId: number;
}
