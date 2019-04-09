import { MonitoringReportStatus } from "../constants/monitoringReportStatus";

export interface MonitoringReportOptionDto {
  id: string;
  questionText: string;
  questionScore: number;
}

export interface MonitoringReportQuestionDto {
  responseId: string|null;
  optionId: string|null;
  title: string;
  comments: string|null;
  options: MonitoringReportOptionDto[];
  displayOrder: number;
}

export interface MonitoringReportDto {
  headerId: string;
  status: MonitoringReportStatus;
  startDate: Date;
  endDate: Date;
  projectId: string;
  periodId: number;
  questions: MonitoringReportQuestionDto[];
}

export interface MonitoringReportSummaryDto {
  headerId: string;
  status: MonitoringReportStatus;
  startDate: Date;
  endDate: Date;
  periodId: number;
  lastUpdated: Date|null;
}
