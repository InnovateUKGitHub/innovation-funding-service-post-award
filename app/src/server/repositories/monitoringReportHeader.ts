import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";

export interface ISalesforceMonitoringReportHeader {
  Id: string;
  Acc_MonitoringReportStatus__c: string;
  Acc_ProjectId__c: string; // is this correct?
  Acc_ProjectPeriodNumber__c: number;
}

export interface IMonitoringReportHeaderRepository {
  get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader>;
}

export class MonitoringReportHeaderRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportHeader> implements IMonitoringReportHeaderRepository {

  private readonly recordType: string = "Monitoring Report Header";

  protected readonly salesforceObjectName = "Acc_MonitoringReport__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitoringReportStatus__c",
    "Acc_ProjectId__c",
    "Acc_ProjectPeriodNumber__c"
  ];

  // TODO delete me
  private record = {
    Id: "1",
    Acc_MonitoringReportID__c: "1",
    Acc_MonitoringReportStatus__c: "draft",
    Acc_ProjectId__c: "1",
    Acc_ProjectPeriodNumber__c: 1,
  };

  async get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader> {
    // TODO don't use name for record type
    // const filter = `
    //   Acc_ProjectId__c = '${projectId}'
    //   AND Acc_ProjectPeriodNumber__c = '${periodId}'
    //   AND RecordType.Name = '${this.recordType}'
    // `;
    const record = this.record;// TODO put this back await super.filterOne(filter);

    if (!record) throw new NotFoundError("Monitoring Report Header");

    return record;
  }
}
