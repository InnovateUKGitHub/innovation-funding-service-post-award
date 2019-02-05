import SalesforceBase, { Updatable } from "./salesforceBase";
import { Connection } from "jsforce";

export interface ISalesforceProfileDetails {
  Id: string;
  Acc_CostCategory__c: string;
  Acc_LatestForecastCost__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
}

type FieldNames = keyof ISalesforceProfileDetails;

const fields: FieldNames[] = [
  "Id",
  "Acc_CostCategory__c",
  "Acc_LatestForecastCost__c",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectPeriodNumber__c",
  "Acc_ProjectPeriodStartDate__c",
  "Acc_ProjectPeriodEndDate__c",
];

export interface IProfileDetailsRepository {
  getAllByPartner(partnerId: string): Promise<ISalesforceProfileDetails[]>;
  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]>;
  getById(partnerId: string, periodId: number, costCategoryId: string): Promise<ISalesforceProfileDetails>;
  update(profileDetails: Updatable<ISalesforceProfileDetails>[]): Promise<boolean>;
}

export class ProfileDetailsRepository extends SalesforceBase<ISalesforceProfileDetails> implements IProfileDetailsRepository {
  private readonly recordType: string = "Profile Detail";

  constructor(connection: () => Promise<Connection>) {
    super(connection, "Acc_Profile__c", fields);
  }

  public async getAllByPartner(partnerId: string) {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }

  public async getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ProjectPeriodNumber__c >= ${periodId}
    `;
    return super.where(filter);
  }

  public async getById(partnerId: string, periodId: number, costCategoryId: string): Promise<ISalesforceProfileDetails> {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ProjectPeriodNumber__c >= ${periodId}
      AND Acc_CostCategory__c = '${costCategoryId}'
    `;
    return super.where(filter).then((res) => res && res[0] || null);
  }

  public async update(profileDetails: Updatable<ForecastDetailsDTO>[]) {
    return super.update(profileDetails);
  }
}
