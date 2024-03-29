import { Partner } from "@framework/entities/partner";
import { ISalesforcePartner } from "../partnersRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class SalesforcePartnerMapper extends SalesforceBaseMapper<ISalesforcePartner, Partner> {
  public map(item: ISalesforcePartner): Partner {
    const competitionType = item.Acc_ProjectId__r?.Acc_CompetitionType__c || "";
    const competitionName = item.Acc_ProjectId__r?.Acc_CompetitionId__r?.Name ?? undefined;

    return {
      id: item.Id as PartnerId,
      accountId: (item.Acc_AccountId__r && item.Acc_AccountId__r.Id) || "",
      name: (item.Acc_AccountId__r && item.Acc_AccountId__r.Name) || "",
      projectId: ((item.Acc_ProjectId__r && item.Acc_ProjectId__r.Id) || "") as ProjectId,
      competitionType,
      competitionName,
      organisationType: item.Acc_OrganisationType__c,
      participantType: item.Acc_ParticipantType__c,
      participantSize: item.Acc_ParticipantType__c,
      projectRole: item.Acc_ProjectRole__c,
      projectRoleName: item.ProjectRoleName,
      totalParticipantCosts: item.Acc_TotalParticipantCosts__c,
      totalApprovedCosts: item.Acc_TotalApprovedCosts__c,
      capLimit: item.Acc_Cap_Limit__c,
      capLimitDeferredAmount: item.Acc_CapLimitDeferredAmount__c,
      capLimitDeferredGrant: item.Acc_CapLimitDeferredGrant__c,
      awardRate: item.Acc_Award_Rate__c,
      totalPaidCosts: item.Acc_TotalPaidCosts__c,
      totalFutureForecastsForParticipant: item.Acc_TotalFutureForecastsForParticipant__c,
      forecastLastModifiedDate: this.clock.parseOptionalSalesforceDateTime(item.Acc_ForecastLastModifiedDate__c),
      claimsForReview: item.Acc_ClaimsForReview__c,
      overdueProject: parseSalesForceWarningFlagUI(item.Acc_Overdue_Project__c),
      claimsOverdue: item.Acc_ClaimsOverdue__c,
      claimsUnderQuery: item.Acc_ClaimsUnderQuery__c,
      trackingClaims: item.Acc_TrackingClaims__c,
      overheadRate: item.Acc_OverheadRate__c,
      participantStatus: item.Acc_ParticipantStatus__c,
      participantStatusLabel: item.ParticipantStatusLabel,
      totalCostsSubmitted: item.Acc_TotalCostsSubmitted__c,
      totalCostsAwarded: item.Acc_TotalCostsAwarded__c,
      auditReportFrequency: item.Acc_AuditReportFrequency__c,
      auditReportFrequencyName: item.AuditReportFrequencyName,
      totalPrepayment: item.Acc_TotalPrepayment__c,
      postcode: item.Acc_Postcode__c,
      postcodeStatusLabel: item.Acc_Postcode__c, // TODO: need this label adding on the backend
      postcodeStatus: item.Acc_Postcode__c, // TODO: need this status adding on the backend
      newForecastNeeded: item.Acc_NewForecastNeeded__c,
      spendProfileStatus: item.Acc_SpendProfileCompleted__c,
      spendProfileStatusLabel: item.SpendProfileStatusLabel,
      bankDetailsTaskStatus: item.Acc_BankCheckCompleted__c,
      bankDetailsTaskStatusLabel: item.BankCheckCompletedLabel,
      bankCheckStatus: item.Acc_BankCheckState__c,
      firstName: item.Acc_FirstName__c,
      lastName: item.Acc_LastName__c,
      accountPostcode: item.Acc_AddressPostcode__c,
      accountStreet: item.Acc_AddressStreet__c,
      accountBuilding: item.Acc_AddressBuildingName__c,
      accountLocality: item.Acc_AddressLocality__c,
      accountTownOrCity: item.Acc_AddressTown__c,
      accountNumber: item.Acc_AccountNumber__c,
      sortCode: item.Acc_SortCode__c,
      companyNumber: item.Acc_RegistrationNumber__c,
      validationCheckPassed: item.Acc_ValidationCheckPassed__c,
      iban: item.Acc_Iban__c,
      validationConditionsSeverity: item.Acc_ValidationConditionsSeverity__c,
      validationConditionsCode: item.Acc_ValidationConditionsCode__c,
      validationConditionsDesc: item.Acc_ValidationConditionsDesc__c,
      addressScore: item.Acc_AddressScore__c,
      companyNameScore: item.Acc_CompanyNameScore__c,
      personalDetailsScore: item.Acc_PersonalDetailsScore__c,
      regNumberScore: item.Acc_RegNumberScore__c,
      verificationConditionsSeverity: item.Acc_VerificationConditionsSeverity__c,
      verificationConditionsCode: item.Acc_VerificationConditionsCode__c,
      verificationConditionsDesc: item.Acc_VerificationConditionsDesc__c,
      totalGrantApproved: item.Acc_TotalGrantApproved__c,
      remainingParticipantGrant: item.Acc_RemainingParticipantGrant__c,
      isNonFunded: item.Acc_NonfundedParticipant__c,
    };
  }
}

/**
 * Note: This field returns a string with an html img element :(
 *
 * We have to parse and validate based on 2 types of src values.
 */
export function parseSalesForceWarningFlagUI(flagAsImageString: string): boolean {
  const validFlagsRegex = /\w*ACC_Red_Flag|Acc_ClearImage/;

  const selectedFlag = flagAsImageString.match(validFlagsRegex);

  if (!selectedFlag) {
    throw Error(
      "Could not parse HTML Img src value! The image does not contain the expected flags in validFlagsRegex.",
    );
  }

  const flagImageOptions = new Set(selectedFlag);

  return flagImageOptions.has("ACC_Red_Flag");
}
