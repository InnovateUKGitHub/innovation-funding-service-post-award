import { sss } from "@server/util/salesforce-string-helpers";
import { Connection } from "jsforce";
import { ILogger } from "@shared/developmentLogger";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { IPicklistEntry } from "@framework/types/IPicklistEntry";

export type ISalesforceMonitoringReportStatus = "New" | "Draft" | "Awaiting IUK Approval" | "Approved" | "IUK Queried";
export interface ISalesforceMonitoringReportHeader {
  Id: string;
  Acc_MonitoringReportStatus__c: ISalesforceMonitoringReportStatus;
  MonitoringReportStatusName: string;
  Acc_Project__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_PeriodStartDate__c: string;
  Acc_PeriodEndDate__c: string;
  Acc_AddComments__c: GQL.Maybe<string>;
  LastModifiedDate: string;
}

export interface IMonitoringReportHeaderRepository {
  getById(id: MonitoringReportId): Promise<ISalesforceMonitoringReportHeader>;
  get(projectId: ProjectId, periodId: number): Promise<ISalesforceMonitoringReportHeader>;
  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean>;
  create(updateDto: Partial<ISalesforceMonitoringReportHeader>): Promise<string>;
  getAllForProject(projectId: ProjectId): Promise<ISalesforceMonitoringReportHeader[]>;
  delete(reportId: string): Promise<void>;
  getMonitoringReportStatuses(): Promise<IPicklistEntry[]>;
}

/**
 * MonitoringReportHeader is the parent record of a monitoring report
 *
 * It is stored in "Acc_MonitoringAnswer__c" table with record type of "Monitoring Header"
 *
 * It also stores the status of the monitoring report.
 */
export class MonitoringReportHeaderRepository
  extends SalesforceRepositoryBase<ISalesforceMonitoringReportHeader>
  implements IMonitoringReportHeaderRepository
{
  constructor(
    private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>,
    getSalesforceConnection: () => Promise<Connection>,
    logger: ILogger,
  ) {
    super(getSalesforceConnection, logger);
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
    "Acc_AddComments__c",
    "LastModifiedDate",
  ];

  async getById(id: MonitoringReportId): Promise<ISalesforceMonitoringReportHeader> {
    return super.loadItem({ Id: id });
  }

  async get(projectId: ProjectId, periodId: number): Promise<ISalesforceMonitoringReportHeader> {
    return super.loadItem(
      `Acc_Project__c = '${sss(projectId)}' AND Acc_ProjectPeriodNumber__c = ${sss(
        periodId,
      )} AND RecordType.Name = '${sss(this.recordType)}'`,
    );
  }

  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean> {
    return super.updateItem(updateDto);
  }

  async create(item: Partial<ISalesforceMonitoringReportHeader>): Promise<string> {
    const RecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    return super.insertItem(Object.assign({}, item, { RecordTypeId }));
  }

  async getAllForProject(projectId: ProjectId): Promise<ISalesforceMonitoringReportHeader[]> {
    return super.where(`Acc_Project__c = '${sss(projectId)}' AND RecordType.Name = '${sss(this.recordType)}'`);
  }

  async delete(reportId: MonitoringReportId): Promise<void> {
    return super.deleteItem(reportId);
  }

  async getMonitoringReportStatuses() {
    return super.getPicklist("Acc_MonitoringReportStatus__c");
  }
}
