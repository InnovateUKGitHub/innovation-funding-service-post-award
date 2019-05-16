import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";
import { IRecordTypeRepository, RecordTypeRepository } from ".";
import { Connection } from "jsforce";

export type ISalesforceMonitoringReportStatus = "New" | "Draft" | "Awaiting IUK Approval" | "Approved" | "IUK Queried";
export interface ISalesforceMonitoringReportHeader {
  Id: string;
  Acc_MonitoringReportStatus__c: ISalesforceMonitoringReportStatus;
  MonitoringReportStatusName: string;
  Acc_Project__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_PeriodStartDate__c: string;
  Acc_PeriodEndDate__c: string;
  LastModifiedDate: string;
}

export interface IMonitoringReportHeaderRepository {
  getById(id: string): Promise<ISalesforceMonitoringReportHeader>;
  get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader>;
  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean>;
  create(updateDto: Partial<ISalesforceMonitoringReportHeader>): Promise<string>;
  getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]>;
  delete(reportId: string): Promise<void>;
}

export class MonitoringReportHeaderRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportHeader> implements IMonitoringReportHeaderRepository {

  constructor(private recordTypes: IRecordTypeRepository, getSalesforceConnection: () => Promise<Connection>) {
    super(getSalesforceConnection);
  }

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

  async create(item: Partial<ISalesforceMonitoringReportHeader>): Promise<string> {
    const RecordTypeId = await this.recordTypes.get(this.salesforceObjectName, this.recordType).then(x => x.Id);
    return super.insertItem(Object.assign({}, item, { RecordTypeId }));
  }

  async getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]> {
    return super.where(`Acc_Project__c = '${projectId}' AND RecordType.Name = '${this.recordType}'`);
  }

  async delete(reportId: string): Promise<void> {
    return super.deleteItem(reportId);
  }
}
