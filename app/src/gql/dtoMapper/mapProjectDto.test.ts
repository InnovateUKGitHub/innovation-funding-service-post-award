import { mapToProjectDto } from "./mapProjectDto";

describe("mapToProjectDto", () => {
  const node = {
    Id: "0",
    roles: {
      isFc: true,
      isPm: false,
      isMo: false,
    },
    isActive: true,
    Acc_ProjectNumber__c: { value: "2345" },
    Acc_ProjectTitle__c: { value: "Allan's Plans" },
    Acc_ProjectStatus__c: { value: "Active" },
    Acc_CurrentPeriodNumber__c: { value: 1 },
    Acc_NumberofPeriods__c: { value: 12 },
    Acc_CompetitionType__c: { value: "CR&D" },
    Acc_CurrentPeriodStartDate__c: { value: "2022-01-24" },
    Acc_CurrentPeriodEndDate__c: { value: "2022-03-24" },
    Acc_EndDate__c: { value: "2024-03-24" },
    Acc_GOLTotalCostAwarded__c: { value: 100000 },
    Acc_TotalProjectCosts__c: { value: 90000 },
    Acc_PCRsForReview__c: { value: 1 },
    Acc_PCRsUnderQuery__c: { value: 2 },
    Acc_ClaimsForReview__c: { value: 3 },
  };

  it("should map the node to the projectDto structure", () => {
    expect(
      mapToProjectDto(node, [
        "id",
        "claimedPercentage",
        "claimsToReview",
        "competitionType",
        "costsClaimedToDate",
        "isActive",
        "isPastEndDate",
        "grantOfferLetterCosts",
        "numberOfPeriods",
        "pcrsQueried",
        "pcrsToReview",
        "periodEndDate",
        "periodId",
        "periodStartDate",
        "projectNumber",
        "roles",
        "status",
        "title",
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
