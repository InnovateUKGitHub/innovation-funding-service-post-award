import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { ILogger } from "../features/common";
import { IRecordTypeRepository } from "./recordTypeRepository";
import { Connection } from "jsforce";

export interface ISalesforceMonitoringReportResponse {
  Id: string;
  Acc_MonitoringHeader__c: string;
  Acc_Question__c: string;
  Acc_QuestionComments__c: string | null;
}

export interface IMonitoringReportResponseRepository {
  getAllForHeader(monitoringReportHeaderId: string): Promise<ISalesforceMonitoringReportResponse[]>;
  delete(ids: string[]): Promise<void>;
  update(update: Updatable<ISalesforceMonitoringReportResponse>[]): Promise<boolean>;
  insert(insert: Partial<ISalesforceMonitoringReportResponse>[]): Promise<string[]>;
}

/**
 * Answers for the monitoring report
 *
 * Stored in "Acc_MonitoringAnswer__c" table with record type "Monitoring Answer"
 *
 * Links to the Header record and the question
 */
export class MonitoringReportResponseRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportResponse> implements IMonitoringReportResponseRepository {

  constructor(private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  private readonly recordType: string = "Monitoring Answer";

  protected readonly salesforceObjectName = "Acc_MonitoringAnswer__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitoringHeader__c",
    "Acc_Question__c",
    "Acc_QuestionComments__c",
  ];

  async getAllForHeader(monitoringReportHeaderId: string): Promise<ISalesforceMonitoringReportResponse[]> {
    const filter = `Acc_MonitoringHeader__c = '${monitoringReportHeaderId}' AND RecordType.Name = '${this.recordType}'`;
    return this.where(filter);
  }

  delete(ids: string[]): Promise<void> {
    return this.deleteAll(ids);
  }

  update(records: Updatable<ISalesforceMonitoringReportResponse>[]): Promise<boolean> {
    return this.updateAll(records);
  }

  async insert(records: Partial<ISalesforceMonitoringReportResponse>[]): Promise<string[]> {
    const RecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    return super.insertAll(records.map(item => Object.assign({}, item, { RecordTypeId })));
  }
}
