import { MonitoringReportStatus } from "../constants/monitoringReportStatus";

export interface OptionDto {
  id: string;
  questionText: string;
  questionScore: number;
}

export interface QuestionDto {
  responseId: string|null;
  optionId: string|null;
  title: string;
  comments: string|null;
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
  lastUpdated: Date|null;
}
