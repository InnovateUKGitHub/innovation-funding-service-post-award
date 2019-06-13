import SalesforceRepositoryBase from "@server/repositories/salesforceRepositoryBase";

export interface ISalesforceMonitoringReportStatusChange {
  Id: string;
  Acc_MonitoringReport__c: string;
  Acc_PreviousMonitoringReportStatus__c: string;
  Acc_NewMonitoringReportStatus__c: string;
  CreatedBy: {
    CommunityNickname: string;
  };
  CreatedDate: string;
}

export interface IMonitoringReportStatusChangeRepository {
  getStatusChanges(monitoringReportId: string): Promise<ISalesforceMonitoringReportStatusChange[]>;
  createStatusChange(statusChange: Partial<ISalesforceMonitoringReportStatusChange>): Promise<string>;
}

export class MonitoringReportStatusChangeRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportStatusChange> implements IMonitoringReportStatusChangeRepository {
  protected readonly salesforceObjectName = "Acc_StatusChange__c";
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitoringReport__c",
    "Acc_PreviousMonitoringReportStatus__c",
    "Acc_NewMonitoringReportStatus__c",
    "CreatedBy.CommunityNickname",
    "CreatedDate"
  ];

  public createStatusChange(statusChange: Partial<ISalesforceMonitoringReportStatusChange>) {
    return super.insertItem(statusChange);
  }

  public getStatusChanges(monitoringReportId: string): Promise<ISalesforceMonitoringReportStatusChange[]> {
    return super.where({Acc_MonitoringReport__c: monitoringReportId});
  }
}
