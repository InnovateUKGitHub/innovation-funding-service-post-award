import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";

export interface ISalesforceMonitoringReportHeader {
  Id: string;
  Acc_MonitoringReportStatus__c: string;
  Acc_ProjectId__c: string; // is this correct?
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectStartDate__c: string;
  Acc_ProjectEndDate__c: string;
}

export interface IMonitoringReportHeaderRepository {
  get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader>;
  getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]>;
}

export class MonitoringReportHeaderRepository extends SalesforceRepositoryBase<ISalesforceMonitoringReportHeader> implements IMonitoringReportHeaderRepository {

  private readonly recordType: string = "Monitoring Report Header";

  protected readonly salesforceObjectName = "Acc_MonitoringReport__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_MonitoringReportStatus__c",
    "Acc_ProjectId__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectStartDate__c",
    "Acc_ProjectEndDate__c"
  ];

  // TODO delete me
  private record = {
    Id: "1",
    Acc_MonitoringReportID__c: "1",
    Acc_MonitoringReportStatus__c: "draft",
    Acc_ProjectId__c: "1",
    Acc_ProjectPeriodNumber__c: 1,
    Acc_ProjectStartDate__c: "2018-02-04",
    Acc_ProjectEndDate__c: "2018-03-04",
  };

  private record1 = {
    Id: "1",
    Acc_MonitoringReportID__c: "1",
    Acc_MonitoringReportStatus__c: "draft",
    Acc_ProjectId__c: "2",
    Acc_ProjectPeriodNumber__c: 2,
    Acc_ProjectStartDate__c: "2018-03-04",
    Acc_ProjectEndDate__c: "2018-04-04",
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

  async getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]> {
    return [this.record, this.record1];
  }
}
