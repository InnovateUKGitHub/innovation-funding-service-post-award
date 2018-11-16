import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

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

export class ProfileTotalPeriodRepository extends SalesforceBase<ISalesforceProfileTotalPeriod> implements IProfileTotalPeriodRepository {
  private recordType: string = "Total Project Period";

  constructor(connection: () => Promise<Connection>) {
    super(connection, "Acc_Profile__c", fields);
  }

  getAllByProjectId(projectId: string): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `Acc_ProjectParticipant__r.Acc_Project__c = '${projectId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }

  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalPeriod[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }

  get(partnerId: string, periodId: number) {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c = ${periodId}`;
    return super.where(filter).then(x => x[0]);
  }
}
