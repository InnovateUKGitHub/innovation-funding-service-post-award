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
  isScored: boolean;
  options: MonitoringReportOptionDto[];
  displayOrder: number;
}

export interface MonitoringReportDto extends MonitoringReportSummaryDto {
  questions: MonitoringReportQuestionDto[];
}

export interface MonitoringReportSummaryDto {
  projectId: string;
  headerId: string;
  title: string;
  status: MonitoringReportStatus;
  statusName: string;
  startDate: Date|null;
  endDate: Date|null;
  periodId: number;
  lastUpdated: Date|null;
}

export interface MonitoringReportActivityDto {
  id: string;
  monitoringReport: string;
  previousStatus: string;
  newStatus: string;
  createdBy: string;
  createdDate: Date;
}
