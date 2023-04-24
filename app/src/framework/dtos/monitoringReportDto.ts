import { MonitoringReportStatus } from "../constants/monitoringReportStatus";

export interface MonitoringReportSummaryDto {
  endDate: Date | null;
  headerId: MonitoringReportId;
  lastUpdated: Date | null;
  periodId: number;
  projectId: ProjectId;
  startDate: Date | null;
  status: MonitoringReportStatus;
  statusName: string;
}

export interface MonitoringReportQuestionDto {
  comments: string | null;
  description: string | null;
  displayOrder: number;
  isScored: boolean;
  optionId: string | null;
  options: MonitoringReportOptionDto[];
  responseId: string | null;
  title: string;
}

export interface MonitoringReportQuestionGqlDto extends MonitoringReportQuestionDto {
  isActive: boolean | null | undefined;
  id: string | null | undefined;
}

export interface MonitoringReportDto extends MonitoringReportSummaryDto {
  addComments: string | null;
  questions: MonitoringReportQuestionDto[];
}

export interface MonitoringReportOptionDto {
  id: string;
  questionScore: number;
  questionText: string;
}

export interface MonitoringReportStatusChangeDto {
  comments: string | null;
  createdBy: string;
  createdDate: Date;
  id: string;
  monitoringReport: string;
  newStatus: MonitoringReportStatus;
  newStatusLabel: string;
  previousStatus: MonitoringReportStatus;
  previousStatusLabel: string;
}
