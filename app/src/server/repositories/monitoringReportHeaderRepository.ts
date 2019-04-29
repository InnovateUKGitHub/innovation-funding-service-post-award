import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";

export interface ISalesforceMonitoringReportHeader {
  Id: string;
  Acc_MonitoringReportStatus__c: "New" | "Draft" | "Awaiting IUK Approval" | "Approved" | "IUK Queried";
  MonitoringReportStatusName: string;
  Acc_Project__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_PeriodStartDate__c: string;
  Acc_PeriodEndDate__c: string;
  Name: string;
  LastModifiedDate: string;
}

export interface IMonitoringReportHeaderRepository {
  getById(id: string): Promise<ISalesforceMonitoringReportHeader>;
  get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader>;
  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean>;
  create(updateDto: Partial<ISalesforceMonitoringReportHeader>): Promise<string>;
  getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]>;
}

export class MonitoringReportHeaderRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportHeader> implements IMonitoringReportHeaderRepository {

  private readonly recordType: string = "Monitoring Header";

  protected readonly salesforceObjectName = "Acc_MonitoringAnswer__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitoringReportStatus__c",
    "toLabel(Acc_MonitoringReportStatus__c) MonitoringReportStatusName",
    "Acc_Project__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_PeriodStartDate__c",
    "Acc_PeriodEndDate__c",
    "Name",
    "LastModifiedDate"
  ];

  async getById(id: string): Promise<ISalesforceMonitoringReportHeader> {
    return super.loadItem({ Id: id });
  }

  async get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader> {
    return super.loadItem(`Acc_Project__c = '${projectId}' AND Acc_ProjectPeriodNumber__c = ${periodId} AND RecordType.Name = '${this.recordType}'`);
  }

  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean> {
    return super.updateItem(updateDto);
  }

  create(item: Partial<ISalesforceMonitoringReportHeader>): Promise<string> {
    return super.insertItem(item);
  }

  async getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]> {
    return super.where(`Acc_Project__c = '${projectId}' AND RecordType.Name = '${this.recordType}'`);
  }
}
