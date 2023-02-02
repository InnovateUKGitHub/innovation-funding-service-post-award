declare type ProjectId = Nominal<string, "ProjectId">;
declare type PartnerId = Nominal<string, "PartnerId">;
declare type LoanId = Nominal<string, "LoanId">;
declare type DocumentId = Nominal<string, "DocumentId">;
declare type MonitoringReportId = Nominal<string, "MonitoringReportId">;

interface INominalTypes {
  projectId: ProjectId;
  partnerId: PartnerId;
  loanId: LoanId;
  documentId: DocumentId;
}

declare type NominalTypes = ProjectId | PartnerId | LoanId | DocumentId | MonitoringReportId;

declare interface SfRoles {
  isPm: boolean;
  isFc: boolean;
  isMo: boolean;
}

interface SfPartnerRoles extends SfRoles {
  partnerId: string;
}
