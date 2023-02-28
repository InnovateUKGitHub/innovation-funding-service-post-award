import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceProfileTotalPeriod {
  LastModifiedDate: string;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_PeriodLatestForecastCost__c: number;
  Acc_OverrideAwardRate__c: number;
  Acc_ProfileOverrideAwardRate__c: number;
}

export interface IProfileTotalPeriodRepository {
  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProfileTotalPeriod[]>;
  getAllByPartnerId(partnerId: PartnerId): Promise<ISalesforceProfileTotalPeriod[]>;
  getByProjectIdAndPeriodId(projectId: ProjectId, periodId: number): Promise<ISalesforceProfileTotalPeriod[]>;
  get(partnerId: PartnerId, periodId: number): Promise<ISalesforceProfileTotalPeriod>;
}

/**
 * Forecast Total for partner per period
 *
 * ie amount a partner expects to spend in that period calculated from the detail for that period
 *
 * Stored in "Acc_Profile__c" table with record type of "Total Project Period"
 */
export class ProfileTotalPeriodRepository
  extends SalesforceRepositoryBase<ISalesforceProfileTotalPeriod>
  implements IProfileTotalPeriodRepository
{
  private readonly recordType: string = "Total Project Period";

  protected readonly salesforceObjectName = "Acc_Profile__c";

  protected readonly salesforceFieldNames = [
    "LastModifiedDate",
    "Acc_ProjectParticipant__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectPeriodStartDate__c",
    "Acc_ProjectPeriodEndDate__c",
    "Acc_PeriodLatestForecastCost__c",
    "Acc_OverrideAwardRate__c",
    "Acc_ProfileOverrideAwardRate__c",
  ];

  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `
      Acc_ProjectParticipant__r.Acc_ProjectId__c = '${sss(projectId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
    `;
    return super.where(filter);
  }

  getAllByPartnerId(partnerId: PartnerId): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `Acc_ProjectParticipant__c = '${sss(partnerId)}' AND RecordType.Name = '${sss(this.recordType)}'`;
    return super.where(filter);
  }

  getByProjectIdAndPeriodId(projectId: ProjectId, periodId: number): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `
      Acc_ProjectParticipant__r.Acc_ProjectId__c = '${sss(projectId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
      AND Acc_ProjectPeriodNumber__c = ${sss(periodId)}
    `;
    return super.where(filter);
  }

  get(partnerId: PartnerId, periodId: number) {
    const filter = `
      Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
      AND Acc_ProjectPeriodNumber__c = ${sss(periodId)}
    `;
    return super.where(filter).then(x => x[0]);
  }
}
