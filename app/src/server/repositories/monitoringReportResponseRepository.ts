import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";
import { RecordTypeRepository } from "./recordTypeRepository";

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

export class MonitoringReportResponseRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportResponse> implements IMonitoringReportResponseRepository {

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
    const types = await new RecordTypeRepository(this.getSalesforceConnection).getAll();
    const type = types.find(x => x.Name === this.recordType && x.SobjectType === this.salesforceObjectName);
    if (!type) {
      throw new NotFoundError("Monitoring Report Response");
    }
    return super.insertAll(records.map(item => ({...item, RecordTypeId: type.Id})));
  }
}
