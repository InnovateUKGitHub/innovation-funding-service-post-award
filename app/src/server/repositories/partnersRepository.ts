import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

export interface ISalesforcePartner {
  Id: string;
  Acc_AccountId__r: {
    Id: string;
    Name: string;
  };
  Acc_OrganisationType__c: string;
  Acc_ParticipantType__c: string;
  Acc_ParticipantSize__c: string;
  Acc_ProjectRole__c: string;
  Acc_ProjectId__c: string;
  Acc_TotalParticipantGrant__c: number;
  Acc_TotalParticipantCosts__c: number;
  Acc_TotalParticipantCostsPaid__c: number;
  Acc_Cap_Limit__c: number;
  Acc_Award_Rate__c: number;
  Acc_TotalFutureForecastsforParticipant__c: number;
  Acc_ForecastLastModifiedDate__c: string;
}

export interface IPartnerRepository {
  getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]>;
  getById(partnerId: string): Promise<ISalesforcePartner>;
  update(updatedPartner: Updatable<ISalesforcePartner>): Promise<boolean>;
  getAll(): Promise<ISalesforcePartner[]>;
}

export class PartnerRepository extends SalesforceRepositoryBase<ISalesforcePartner> implements IPartnerRepository {

  protected readonly salesforceObjectName = "Acc_ProjectParticipant__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_AccountId__r.Id",
    "Acc_AccountId__r.Name",
    "Acc_OrganisationType__c",
    "Acc_ParticipantType__c",
    "Acc_ParticipantSize__c",
    "Acc_TotalParticipantGrant__c",
    "Acc_TotalParticipantCosts__c",
    "Acc_Cap_Limit__c",
    "Acc_Award_Rate__c",
    "Acc_ProjectRole__c",
    "Acc_ProjectId__c",
    "Acc_TotalFutureForecastsforParticipant__c",
    "Acc_ForecastLastModifiedDate__c",
  ];

  getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
    return super.where({ Acc_ProjectId__c: projectId });
  }

  getById(partnerId: string): Promise<ISalesforcePartner> {
    return super.loadItem({ Id: partnerId });
  }

  update(updatedPartner: Updatable<ISalesforcePartner>) {
    return super.update(updatedPartner);
  }

  getAll() {
    return super.all();
  }
}

export const PROJECT_LEAD_IDENTIFIER = "Project Lead";
