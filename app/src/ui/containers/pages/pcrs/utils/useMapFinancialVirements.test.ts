import { MapVirements, mapVirements } from "./useMapFinancialVirements";

describe("mapFinancialVirements", () => {
  const data: MapVirements = {
    financialVirementsForParticipants: [
      {
        id: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        newEligibleCosts: 1555001,
        newFundingLevel: 48.560418932206474,
        newRemainingGrant: 755115,
        originalFundingLevel: 90,
        partnerId: "a0D2600000zYOlCEAW" as PartnerId,
      },
      {
        id: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        newEligibleCosts: 850000,
        newFundingLevel: 80.66094370860927,
        newRemainingGrant: 682068.94,
        originalFundingLevel: 65,
        partnerId: "a0D2600000zYOlDEAW" as PartnerId,
      },
      {
        id: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        newEligibleCosts: 345000,
        newFundingLevel: 58.47953216374269,
        newRemainingGrant: 200000,
        originalFundingLevel: 100,
        partnerId: "a0D2600000zYOlEEAW" as PartnerId,
      },
    ],
    financialVirementsForCosts: [
      {
        id: "a0RAd000000jGAKMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZdEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQkAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 1000000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 1000000,
      },
      {
        id: "a0RAd000000jGALMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZeEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQlAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 50001,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 50000,
      },
      {
        id: "a0RAd000000jGAMMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZfEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQmAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 5000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 5000,
      },
      {
        id: "a0RAd000000jGANMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZgEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQnAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 500000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 500000,
      },
      {
        id: "a0RAd000000jGAOMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZhEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQoAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAPMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZiEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSvAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAQMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZjEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSwAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGARMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZkEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSxAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGASMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZlEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSyAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGATMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZmEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSzAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAUMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZnEAI",
        parentId: "a0RAd000000jGAHMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoT0AAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAVMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZoEAI",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQkAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 500000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 500000,
      },
      {
        id: "a0RAd000000jGAWMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZpEAI",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQlAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 4000,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAXMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZqEAI",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQmAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 400,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAYMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZrEAI",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQnAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAZMA2" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZsEAI",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQoAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAaMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009beZtEAI",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSvAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAbMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedUEAQ",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSwAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAcMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedVEAQ",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSxAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAdMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedWEAQ",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSyAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAeMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedXEAQ",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSzAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAfMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedYEAQ",
        parentId: "a0RAd000000jGAIMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoT0AAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 35000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 35000,
      },
      {
        id: "a0RAd000000jGAgMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedfEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSwAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAhMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedgEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSxAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAiMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedhEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSyAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAjMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bediEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSzAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 90000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 90000,
      },
      {
        id: "a0RAd000000jGAkMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedjEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoT0AAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAlMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedkEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQkAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAmMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedlEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQlAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 250000,
        originalCostsClaimedToDate: 3000,
        originalEligibleCosts: 250000,
      },
      {
        id: "a0RAd000000jGAnMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedmEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQmAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAoMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bednEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQnAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGApMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedoEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoQoAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 0,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 0,
      },
      {
        id: "a0RAd000000jGAqMAM" as FinancialVirementForCostsId,
        profileId: "a0A26000009bedpEAA",
        parentId: "a0RAd000000jGAJMA2" as FinancialVirementForParticipantId,
        costCategoryId: "a0626000007qoSvAAI" as CostCategoryId,
        costCategoryName: "",
        newEligibleCosts: 5000,
        originalCostsClaimedToDate: 0,
        originalEligibleCosts: 5000,
      },
    ],
    partners: [
      {
        id: "a0D2600000zYOlEEAW" as PartnerId,
        name: "A B Cad Services",
        isLead: false,
      },
      {
        id: "a0D2600000zYOlDEAW" as PartnerId,
        name: "ABS EUI Medium Enterprise",
        isLead: false,
      },
      {
        id: "a0D2600000zYOlCEAW" as PartnerId,
        name: "EUI Small Ent Health",
        isLead: true,
      },
    ],
    pcrItemId: "a0G-Acc_ProjectChangeRequest__c" as PcrItemId,
  };

  it("should map the virements into the correct format", () => {
    expect(mapVirements(data)).toMatchSnapshot();
  });
});
