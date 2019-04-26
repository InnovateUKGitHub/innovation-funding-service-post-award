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
  startDate: Date;
  endDate: Date;
  periodId: number;
  lastUpdated: Date|null;
}
