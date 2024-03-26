import { mapToProjectDto } from "./mapProjectDto";

describe("mapToProjectDto", () => {
  const node = {
    Id: "0",
    Acc_ClaimsForReview__c: { value: 3 },
    Acc_ClaimsOverdue__c: { value: 1 },
    Acc_CompetitionType__c: { value: "CR&D" },
    Acc_CurrentPeriodEndDate__c: { value: "2022-03-24" },
    Acc_CurrentPeriodNumber__c: { value: 1 },
    Acc_CurrentPeriodStartDate__c: { value: "2022-01-24" },
    Acc_StartDate__c: { value: "2022-01-22" },
    Acc_EndDate__c: { value: "2034-03-24" },
    Acc_GOLTotalCostAwarded__c: { value: 100000 },
    Acc_NumberOfOpenClaims__c: { value: 1 },
    Acc_NumberofPeriods__c: { value: 12 },
    Acc_PCRsForReview__c: { value: 1 },
    Acc_PCRsUnderQuery__c: { value: 2 },
    Acc_ProjectNumber__c: { value: "2345" },
    Acc_ProjectStatus__c: { value: "Active", label: "Live" },
    Acc_ProjectTitle__c: { value: "Allan's Plans" },
    Acc_TotalProjectCosts__c: { value: 90000 },
    Impact_Management_Participation__c: { value: "Yes" },
    isActive: true,
    roles: {
      isFc: true,
      isPm: false,
      isMo: false,
      isAssociate: false,
      partnerRoles: [
        {
          partnerId: "1",
          isFc: true,
          isPm: false,
          isMo: false,
          isAssociate: false,
        },
      ],
    },
  };

  it("should map the node to the projectDto structure", () => {
    expect(
      mapToProjectDto(node, [
        "id",
        "claimedPercentage",
        "claimsOverdue",
        "claimsToReview",
        "competitionType",
        "costsClaimedToDate",
        "endDate",
        "isActive",
        "isPastEndDate",
        "grantOfferLetterCosts",
        "leadPartnerName",
        "numberOfOpenClaims",
        "numberOfPeriods",
        "pcrsQueried",
        "pcrsToReview",
        "periodEndDate",
        "periodId",
        "periodStartDate",
        "projectNumber",
        "roles",
        "startDate",
        "status",
        "statusName",
        "title",
        "partnerRoles",
        "impactManagementParticipation",
      ]),
    ).toMatchSnapshot();
  });

  it("should map the node to a subset of the project dto", () => {
    expect(
      mapToProjectDto(node, [
        "id",
        "claimedPercentage",
        "claimsToReview",
        "competitionType",
        "projectNumber",
        "roles",
        "status",
        "title",
      ]),
    ).toMatchSnapshot();
  });
});
