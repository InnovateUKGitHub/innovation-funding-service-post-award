import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";
import { RecordTypeRepository } from "./recordTypeRepository";
import * as Repositories from "./index";

export interface ISalesforceMonitoringReportResponse {
  Id: string;
  Acc_MonitingReportHeader__c: string;  // ToDo respell monitoring
  Acc_Question__c: string;
  Acc_QuestionComments__c: string;
}

export interface IMonitoringReportResponseRepository {
  getAllForHeader(monitoringReportHeaderId: string): Promise<ISalesforceMonitoringReportResponse[]>;
  delete(ids: string[]): Promise<void>;
  update(update: Updatable<ISalesforceMonitoringReportResponse>[]): Promise<boolean>;
  insert(insert: Partial<ISalesforceMonitoringReportResponse>[]): Promise<string[]>;
}

export class MonitoringReportResponseRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportResponse> implements IMonitoringReportResponseRepository {

  private readonly recordType: string = "Monitoring Report Response";

  protected readonly salesforceObjectName = "Acc_MonitoringReport__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitingReportHeader__c",
    "Acc_Question__c",
    "Acc_QuestionComments__c",
  ];

  // TODO delete me
  private records = [{
    Id: "1",
    Acc_MonitingReportHeader__c: "1",
    Acc_Question__c: "a",
    Acc_QuestionComments__c: "blah",
  }];

  async getAllForHeader(monitoringReportHeaderId: string): Promise<ISalesforceMonitoringReportResponse[]> {
    // TODO don't use name for record type
    // const filter = `
    //   Acc_MonitingReportHeader__c = '${monitoringReportHeaderId}'
    //   AND RecordType.Name = '${this.recordType}'
    // `;
    const records = this.records;// TODO put this back: await super.where(filter);

    if (!records) throw new NotFoundError("Monitoring Report Response");

    return records;
  }

  // TODO delete me
  public deleteAll(ids: string[]): Promise<void> {
    ids.forEach((Id) => {
      const index = this.records.findIndex(x => x.Id === Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.records = this.records.splice(index, 1);
    });
    return Promise.resolve();
  }

  // TODO delete me
  public updateAll(records: Updatable<ISalesforceMonitoringReportResponse>[]): Promise<boolean> {
    if (!(records instanceof Array)) {
      records = [records];
    }
    records.forEach((item) => {
      const index = this.records.findIndex(x => x.Id === item.Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.records[index] = { ...this.records[index], ...item };
    });
    return Promise.resolve(true);
  }

  delete(ids: string[]): Promise<void> {
    return this.deleteAll(ids);
  }
  update(records: Updatable<ISalesforceMonitoringReportResponse>[]): Promise<boolean> {
    return this.updateAll(records);
  }
  async insert(records: Partial<ISalesforceMonitoringReportResponse>[]): Promise<string[]> {
    // const types = await new RecordTypeRepository(this.getSalesforceConnection).getAll();
    // const type = types.find(x => x.Name === this.recordType && x.SobjectType === this.salesforceObjectName);
    // if (!type) {
    //   throw new NotFoundError("Monitoring Report Response");
    // }
    // return super.insertAll(records.map(item => ({...item, RecordTypeId: type.Id})));

    // TODO delete this
    let largestId = Math.max(...this.records.map(x => parseInt(x.Id, 10)));
    const newIds: string[] = [];
    records.forEach((x) => {
      const Id = ++largestId + "";
      newIds.push(Id);
      this.records.push({ ...x, Id } as Repositories.ISalesforceMonitoringReportResponse);
    });
    return Promise.resolve(newIds);
  }
}
