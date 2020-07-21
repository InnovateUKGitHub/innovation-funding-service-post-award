import SalesforceRepositoryBase from "@server/repositories/salesforceRepositoryBase";

export interface ISalesforceMonitoringReportStatusChange {
  Id: string;
  Acc_MonitoringReport__c: string;
  Acc_PreviousMonitoringReportStatus__c: string;
  Acc_NewMonitoringReportStatus__c: string;
  Acc_CreatedByAlias__c: string;
  CreatedDate: string;
  Acc_ExternalComment__c: string | null;
}

export interface IMonitoringReportStatusChangeRepository {
  getStatusChanges(monitoringReportId: string): Promise<ISalesforceMonitoringReportStatusChange[]>;
  createStatusChange(statusChange: Partial<ISalesforceMonitoringReportStatusChange>): Promise<string>;
}

/**
 * MonitoringReportStatusChanges are stored in the Acc_StatusChange__c
 *
 * Holds all status changes for Monitoring Report Header records ("Acc_MonitoringAnswer__c" of type "Monitoring Header")
 *
 */
export class MonitoringReportStatusChangeRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportStatusChange> implements IMonitoringReportStatusChangeRepository {
  protected readonly salesforceObjectName = "Acc_StatusChange__c";
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitoringReport__c",
    "Acc_PreviousMonitoringReportStatus__c",
    "Acc_NewMonitoringReportStatus__c",
    "Acc_CreatedByAlias__c",
    "CreatedDate",
    "Acc_ExternalComment__c"
  ];

  public createStatusChange(statusChange: Partial<ISalesforceMonitoringReportStatusChange>) {
    return super.insertItem(statusChange);
  }

  public getStatusChanges(monitoringReportId: string): Promise<ISalesforceMonitoringReportStatusChange[]> {
    return super.where({Acc_MonitoringReport__c: monitoringReportId});
  }
}
