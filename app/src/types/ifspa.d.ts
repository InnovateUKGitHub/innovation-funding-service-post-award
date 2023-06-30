declare type ProjectId = Nominal<string, "ProjectId">;
declare type PartnerId = Nominal<string, "PartnerId">; // Project Participant ID
declare type AccountId = Nominal<string, "AccountId">;
declare type LoanId = Nominal<string, "LoanId">;
declare type DocumentId = Nominal<string, "DocumentId">;
declare type MonitoringReportId = Nominal<string, "MonitoringReportId">;
declare type BroadcastId = Nominal<string, "BroadcastId">;
declare type PcrId = Nominal<string, "PcrId">;
declare type PcrItemId = Nominal<string, "PcrItemId">;
declare type LinkedEntityId = Nominal<string, "LinkedEntityId">;
declare type PeriodId = Nominal<number, "PeriodId">;

interface INominalTypes {
  projectId: ProjectId;
  partnerId: PartnerId;
  loanId: LoanId;
  reportId: MonitoringReportId;
  documentId: DocumentId;
  pcrId: PcrId;
  projectChangeRequestId: PcrId;
  pcrItemId: PcrItemId;
}

declare type NominalTypes = ProjectId | PartnerId | LoanId | DocumentId | MonitoringReportId | PcrId | PcrItemId;

declare interface SfRoles {
  isPm: boolean;
  isFc: boolean;
  isMo: boolean;
}

interface SfPartnerRoles extends SfRoles {
  partnerId: string;
}
