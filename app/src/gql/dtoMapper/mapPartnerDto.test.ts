import { mapToPartnerDtoArray } from "./mapPartnerDto";

describe("mapPartnerDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_ProjectRole__c: { value: "Lead" },
        Acc_ParticipantStatus__c: { value: "Active" },
        Acc_AccountId__r: {
          Name: { value: "Swindon University" },
          Id: "123",
        },
        Acc_AccountId__c: { value: "123" },
        Acc_TotalParticipantCosts__c: { value: 10000 },
        Acc_TotalApprovedCosts__c: { value: 20000 },
        Acc_NewForecastNeeded__c: { value: true },
        Acc_TrackingClaims__c: { value: "Claims Overdue" },
        Acc_OverheadRate__c: { value: 100 },
        Acc_OrganisationType__c: { value: "Academic" },
        Acc_ForecastLastModifiedDate__c: { value: "2022-01-24" },
        Acc_TotalFutureForecastsForParticipant__c: { value: 10000 },
        Acc_TotalCostsSubmitted__c: { value: 5000 },
        Acc_TotalGrantApproved__c: { value: 100000 },
        Acc_Award_Rate__c: { value: 10 },
        Acc_RemainingParticipantGrant__c: { value: 3000 },
        Acc_TotalPrepayment__c: { value: 4000 },
        Acc_Cap_Limit__c: { value: 100 },
        Acc_AuditReportFrequency__c: { value: "monthly" },
        Acc_OpenClaimStatus__c: { value: "Draft" },
      },
    },
    {
      node: {
        Id: "1",
        Acc_ProjectRole__c: { value: "Regular" },
        Acc_ParticipantStatus__c: { value: "Voluntary Withdrawal" },
        Acc_AccountId__r: {
          Name: { value: "Kettering Nursing College" },
          Id: "124",
        },
        Acc_AccountId__c: { value: "124" },
        Acc_TotalParticipantCosts__c: { value: 10000 },
        Acc_TotalApprovedCosts__c: { value: 20000 },
        Acc_NewForecastNeeded__c: { value: true },
        Acc_TrackingClaims__c: { value: "Claims Overdue" },
        Acc_OverheadRate__c: { value: 100 },
        Acc_OrganisationType__c: { value: "Academic" },
        Acc_ForecastLastModifiedDate__c: { value: "2022-01-24" },
        Acc_TotalFutureForecastsForParticipant__c: { value: 10000 },
        Acc_TotalCostsSubmitted__c: { value: 5000 },
        Acc_TotalGrantApproved__c: { value: 100000 },
        Acc_Award_Rate__c: { value: 10 },
        Acc_RemainingParticipantGrant__c: { value: 3000 },
        Acc_TotalPrepayment__c: { value: 4000 },
        Acc_Cap_Limit__c: { value: 100 },
        Acc_AuditReportFrequency__c: { value: "monthly" },
        Acc_OpenClaimStatus__c: { value: "New" },
      },
    },
  ];
  const partnerRoles = [
    { isFc: true, isPm: true, isMo: false, partnerId: "123" },
    { isFc: true, isPm: false, isMo: false, partnerId: "124" },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToPartnerDtoArray(
        edges,
        [
          "id",
          "accountId",
          "auditReportFrequencyName",
          "awardRate",
          "capLimit",
          "claimStatus",
          "competitionName",
          "forecastLastModifiedDate",
          "forecastsAndCosts",
          "isLead",
          "isWithdrawn",
          "name",
          "newForecastNeeded",
          "organisationType",
          "overheadRate",
          "partnerStatus",
          "percentageParticipantCostsClaimed",
          "percentageParticipantCostsSubmitted",
          "remainingParticipantGrant",
          "roles",
          "totalCostsSubmitted",
          "totalGrantApproved",
          "totalParticipantCostsClaimed",
          "totalParticipantGrant",
          "totalPrepayment",
        ],
        { partnerRoles, competitionName: "bingo" },
      ),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToPartnerDtoArray(edges, ["id", "roles", "isLead"], { partnerRoles })).toMatchSnapshot();
  });
});
