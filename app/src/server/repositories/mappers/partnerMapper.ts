import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePartner } from "../partnersRepository";
import { Partner } from "@framework/entities";

export class SalesforcePartnerMapper extends SalesforceBaseMapper<ISalesforcePartner, Partner> {
  public map(item: ISalesforcePartner): Partner {
    return {
      id: item.Id,
      accountId: item.Acc_AccountId__r && item.Acc_AccountId__r.Id || "",
      name: item.Acc_AccountId__r && item.Acc_AccountId__r.Name || "",
      projectId: item.Acc_ProjectId__r && item.Acc_ProjectId__r.Id || "",
      competitionType: item.Acc_ProjectId__r && item.Acc_ProjectId__r.Acc_CompetitionType__c || "",
      organisationType: item.Acc_OrganisationType__c,
      participantType: item.Acc_ParticipantType__c,
      participantSize: item.Acc_ParticipantType__c,
      projectRole: item.Acc_ProjectRole__c,
      projectRoleName: item.ProjectRoleName,
      totalParticipantCosts: item.Acc_TotalParticipantCosts__c,
      totalApprovedCosts: item.Acc_TotalApprovedCosts__c,
      capLimit: item.Acc_Cap_Limit__c,
      awardRate: item.Acc_Award_Rate__c,
      totalPaidCosts: item.Acc_TotalPaidCosts__c,
      totalFutureForecastsForParticipant: item.Acc_TotalFutureForecastsForParticipant__c,
      forecastLastModifiedDate: super.clock.parseOptionalSalesforceDateTime(item.Acc_ForecastLastModifiedDate__c),
      claimsForReview: item.Acc_ClaimsForReview__c,
      claimsOverdue: item.Acc_ClaimsOverdue__c,
      claimsUnderQuery: item.Acc_ClaimsUnderQuery__c,
      trackingClaims: item.Acc_TrackingClaims__c,
      overheadRate: item.Acc_OverheadRate__c,
      participantStatus:item.Acc_ParticipantStatus__c,
      totalCostsSubmitted: item.Acc_TotalCostsSubmitted__c,
      totalCostsAwarded: item.Acc_TotalCostsAwarded__c,
      auditReportFrequency: item.Acc_AuditReportFrequency__c,
      auditReportFrequencyName: item.AuditReportFrequencyName,
      totalPrepayment: item.Acc_TotalPrepayment__c,
      postcode: item.Acc_Postcode__c,
    };
  }
}
