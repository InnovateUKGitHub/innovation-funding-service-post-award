import { MonitoringReportStatus } from "../constants/monitoringReportStatus";

export interface MonitoringReportSummaryDto {
  projectId: string;
  headerId: string;
  status: MonitoringReportStatus;
  statusName: string;
  startDate: Date|null;
  endDate: Date|null;
  periodId: number;
  lastUpdated: Date|null;
}

export interface MonitoringReportQuestionDto {
  responseId: string|null;
  optionId: string|null;
  title: string;
  comments: string|null;
  description: string;
  isScored: boolean;
  options: MonitoringReportOptionDto[];
  displayOrder: number;
}

export interface MonitoringReportDto extends MonitoringReportSummaryDto {
  questions: MonitoringReportQuestionDto[];
  addComments: string;
}

export interface MonitoringReportOptionDto {
  id: string;
  questionText: string;
  questionScore: number;
}

export interface MonitoringReportStatusChangeDto {
  id: string;
  monitoringReport: string;
  previousStatus: MonitoringReportStatus;
  previousStatusLabel: string;
  newStatus: MonitoringReportStatus;
  newStatusLabel: string;
  createdBy: string;
  createdDate: Date;
  comments: string | null;
}
