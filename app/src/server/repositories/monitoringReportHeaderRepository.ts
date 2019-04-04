import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { NotFoundError } from "../features/common";
import { object } from "prop-types";

// todo remove
const __DRAFT__ = "Draft";
const __SUBMITTED__ = "Submitted for approval";

export interface ISalesforceMonitoringReportHeader {
  Id: string;
  Acc_MonitoringReportStatus__c: "Draft" | "Submitted for approval";
  Acc_ProjectId__c: string; // is this correct?
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectStartDate__c: string;
  Acc_ProjectEndDate__c: string;
}

export interface IMonitoringReportHeaderRepository {
  get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader>;
  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean>;
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
  private record1: ISalesforceMonitoringReportHeader = {
    Id: "1",
    Acc_MonitoringReportStatus__c: __SUBMITTED__,
    Acc_ProjectId__c: "xxxx",
    Acc_ProjectPeriodNumber__c: 1,
    Acc_ProjectStartDate__c: "2018-02-01",
    Acc_ProjectEndDate__c: "2018-02-28",
  };

  private record2: ISalesforceMonitoringReportHeader = {
    Id: "2",
    Acc_MonitoringReportStatus__c: __SUBMITTED__,
    Acc_ProjectId__c: "xxxx",
    Acc_ProjectPeriodNumber__c: 2,
    Acc_ProjectStartDate__c: "2018-03-01",
    Acc_ProjectEndDate__c: "2018-03-31",
  };

  private record3: ISalesforceMonitoringReportHeader = {
    Id: "3",
    Acc_MonitoringReportStatus__c: __DRAFT__,
    Acc_ProjectId__c: "xxxx",
    Acc_ProjectPeriodNumber__c: 3,
    Acc_ProjectStartDate__c: "2018-04-01",
    Acc_ProjectEndDate__c: "2018-04-30",
  };

  async get(projectId: string, periodId: number): Promise<ISalesforceMonitoringReportHeader> {
    // TODO don't use name for record type
    // const filter = `
    //   Acc_ProjectId__c = '${projectId}'
    //   AND Acc_ProjectPeriodNumber__c = '${periodId}'
    //   AND RecordType.Name = '${this.recordType}'
    // `;

    const record = [this.record1, this.record2, this.record3].find(x => x.Acc_ProjectPeriodNumber__c === periodId);

    if (!record) throw new NotFoundError("Monitoring Report Header");

    return Object.assign({}, record, {Acc_ProjectId__c: projectId});// this.record1;// TODO put this back await super.filterOne(filter);
  }

  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean> {
    // return super.updateItem(updateDto);
    // TODO remove this
    this.record3 = { ...this.record3, ...updateDto };
    return Promise.resolve(true);
  }

  async getAllForProject(projectId: string): Promise<ISalesforceMonitoringReportHeader[]> {
    return [this.record1, this.record2, this.record3].map(x => {
      x.Acc_ProjectId__c = projectId;
      return x;
    });
  }
}
