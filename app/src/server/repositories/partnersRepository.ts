import { SalesforceRepositoryBaseWithMapping, Updatable } from "./salesforceRepositoryBase";
import { Partner } from "@framework/entities/partner";
import { SalesforcePartnerMapper } from "./mappers/partnerMapper";

export enum SalesforceProjectRole {
  ProjectLead = "Lead"
}

export interface ISalesforcePartner {
  Id: string;
  Acc_AccountId__r: {
    Id: string;
    Name: string;
  } | null;
  Acc_OrganisationType__c: string;
  Acc_ParticipantType__c: string;
  Acc_ParticipantSize__c: string;
  Acc_ProjectRole__c: string;
  ProjectRoleName: string;
  Acc_ProjectId__r: {
    Id: string,
    Acc_CompetitionType__c: string,
  };
  Acc_TotalParticipantCosts__c: number;
  Acc_TotalApprovedCosts__c: number;
  Acc_Cap_Limit__c: number;
  Acc_Award_Rate__c: number;
  Acc_TotalPaidCosts__c: number;
  Acc_TotalFutureForecastsForParticipant__c: number;
  Acc_ForecastLastModifiedDate__c: string;
  Acc_ClaimsForReview__c: number;
  Acc_ClaimsOverdue__c: number;
  Acc_ClaimsUnderQuery__c: number;
  Acc_TrackingClaims__c: string;
  Acc_OverheadRate__c: number;
  Acc_ParticipantStatus__c: string;
  Acc_TotalCostsSubmitted__c: number;
  Acc_TotalCostsAwarded__c: number;
  Acc_AuditReportFrequency__c: string;
  AuditReportFrequencyName: string;
  Acc_TotalPrepayment__c: number;
  Acc_Postcode__c: string;
  Acc_NewForecastNeeded__c: boolean;
  Acc_SpendProfileCompleted__c: string;
  Acc_BankCheckCompleted__c: string;
  SpendProfileStatusLabel: string;
  Acc_BankCheckState__c: string;
  BankCheckStatusLabel: string;
  Acc_ValidationCheckPassed__c: boolean;
  Acc_Iban__c: string;
  Acc_ValidationConditionsSeverity__c: string;
  Acc_ValidationConditionsCode__c: number;
  Acc_ValidationConditionsDesc__c: string;
  Acc_CompanyName__c: string;
  Acc_RegistrationNumber__c: string;
  // Acc_SortCode__c: string;
  // Acc_AccountNumber__c: string;
  Acc_FirstName__c: string;
  Acc_LastName__c: string;
  Acc_AddressStreet__c: string;
  Acc_AddressBuildingName__c: string;
  Acc_AddressLocality__c: string;
  Acc_AddressTown__c: string;
  Acc_AddressPostcode__c: string;
}

export interface IPartnerRepository {
  getAllByProjectId(projectId: string): Promise<Partner[]>;
  getById(partnerId: string): Promise<Partner>;
  update(updatedPartner: Updatable<ISalesforcePartner>): Promise<boolean>;
  getAll(): Promise<Partner[]>;
}

/**
 * Partners stored in the "Acc_ProjectParticipant__c" table
 *
 * There is 1 lead partner (Acc_ProjectRole__c = "Lead") per project
 *
 * The status of the partner is stored (Withdrawn etc)
 * Total grant and approved costs etc are rolled up to this level
 * A Sum of the number of outstanding claims etc are also de-normalised at this level
 */
export class PartnerRepository extends SalesforceRepositoryBaseWithMapping<ISalesforcePartner, Partner> implements IPartnerRepository {

  protected readonly salesforceObjectName = "Acc_ProjectParticipant__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_AccountId__r.Id",
    "Acc_AccountId__r.Name",
    "Acc_OrganisationType__c",
    "Acc_ParticipantType__c",
    "Acc_ParticipantSize__c",
    "Acc_TotalParticipantCosts__c",
    "Acc_TotalApprovedCosts__c",
    "Acc_Cap_Limit__c",
    "Acc_Award_Rate__c",
    "Acc_ProjectRole__c",
    "toLabel(Acc_ProjectRole__c) ProjectRoleName",
    "Acc_ProjectId__r.Id",
    "Acc_ProjectId__r.Acc_CompetitionType__c",
    "Acc_TotalPaidCosts__c",
    "Acc_TotalFutureForecastsForParticipant__c",
    "Acc_ForecastLastModifiedDate__c",
    "Acc_ClaimsForReview__c",
    "Acc_ClaimsOverdue__c",
    "Acc_ClaimsUnderQuery__c",
    "Acc_TrackingClaims__c",
    "Acc_OverheadRate__c",
    "Acc_ParticipantStatus__c",
    "Acc_TotalCostsSubmitted__c",
    "Acc_TotalCostsAwarded__c",
    "Acc_AuditReportFrequency__c",
    "toLabel(Acc_AuditReportFrequency__c) AuditReportFrequencyName",
    "Acc_TotalPrepayment__c",
    "Acc_Postcode__c",
    "Acc_NewForecastNeeded__c",
    "Acc_SpendProfileCompleted__c",
    "toLabel(Acc_SpendProfileCompleted__c) SpendProfileStatusLabel",
    "Acc_BankCheckState__c",
    "toLabel(Acc_BankCheckState__c) BankCheckStatusLabel",
    "Acc_BankCheckCompleted__c",
    "Acc_ValidationCheckPassed__c",
    "Acc_Iban__c",
    "Acc_ValidationConditionsSeverity__c",
    "Acc_ValidationConditionsCode__c",
    "Acc_ValidationConditionsDesc__c",
    "Acc_RegistrationNumber__c",
    // TODO: put back in
    // "Acc_SortCode__c",
    // "Acc_AccountNumber__c",
    "Acc_FirstName__c",
    "Acc_LastName__c",
    "Acc_AddressStreet__c",
    "Acc_AddressBuildingName__c",
    "Acc_AddressLocality__c",
    "Acc_AddressTown__c",
    "Acc_AddressPostcode__c",
  ];

  mapper = new SalesforcePartnerMapper();

  getAllByProjectId(projectId: string) {
    return super.where(`Acc_ProjectId__c = '${projectId}'`);
  }

  getById(partnerId: string) {
    return super.loadItem({ Id: partnerId });
  }

  update(updatedPartner: Updatable<ISalesforcePartner>) {
    return super.updateItem(updatedPartner);
  }

  getAll() {
    return super.where("Acc_ProjectId__r.Acc_ProjectStatus__c != 'Not set' AND Acc_ProjectId__r.Acc_ProjectStatus__c != 'PCL Creation Complete'");
  }
}
