import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceProfileTotalPeriod {
  LastModifiedDate: string;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_PeriodInitialForecastCost__c: number;
}

type FieldNames = keyof ISalesforceProfileTotalPeriod;

const fields: FieldNames[] = [
  "LastModifiedDate",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectPeriodNumber__c",
  "Acc_PeriodInitialForecastCost__c"
];

export interface IProfileTotalPeriodRepository {
  getAllByProjectId(projectId: string): Promise<ISalesforceProfileTotalPeriod[]>;
  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalPeriod[]>;
  get(partnerId: string, periodId: number): Promise<ISalesforceProfileTotalPeriod>;
}

/**
 * Forecast Total for partner per period
 *
 * ie amount a partner expects to spend in that period calculated from the detail for that period
 *
 * Stored in "Acc_Profile__c" table with record type of "Total Project Period"
 */
export class ProfileTotalPeriodRepository extends SalesforceRepositoryBase<ISalesforceProfileTotalPeriod> implements IProfileTotalPeriodRepository {

  private readonly recordType: string = "Total Project Period";

  protected readonly salesforceObjectName = "Acc_Profile__c";

  protected readonly salesforceFieldNames = [
    "LastModifiedDate",
    "Acc_ProjectParticipant__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_PeriodInitialForecastCost__c"
  ];

  getAllByProjectId(projectId: string): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `
      Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}'
      AND RecordType.Name = '${this.recordType}'
    `;
    return super.where(filter);
  }

  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }

  get(partnerId: string, periodId: number) {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
    `;
    return super.where(filter).then(x => x[0]);
  }
}
