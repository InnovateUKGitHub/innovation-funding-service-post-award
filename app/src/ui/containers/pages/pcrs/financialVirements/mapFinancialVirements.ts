import { PartnerDto } from "@framework/dtos/partnerDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { FinancialVirementForCostsMapping } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { FinancialVirementForParticipantMapping } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { useMemo } from "react";

type FinancialVirementForCost = Pick<
  FinancialVirementForCostsMapping,
  | "costCategoryId"
  | "id"
  | "newEligibleCosts"
  | "originalCostsClaimedToDate"
  | "originalEligibleCosts"
  | "profileId"
  | "parentId"
>;
type FinancialVirementForParticipant = Pick<
  FinancialVirementForParticipantMapping,
  "id" | "newEligibleCosts" | "partnerId" | "newFundingLevel" | "originalFundingLevel" | "newRemainingGrant"
>;
type Partner = Pick<PartnerDto, "id" | "name" | "isLead">;

interface MapToFinancialVirementProps {
  financialVirementsForCosts: FinancialVirementForCost[];
  financialVirementsForParticipant: FinancialVirementForParticipant;
  partner: Partner;
}

interface MapCostCategoryProps {
  financialVirementsForCost: FinancialVirementForCost;
  financialVirementsForParticipant: FinancialVirementForParticipant;
}

interface MapVirements {
  financialVirementsForCosts: FinancialVirementForCost[];
  financialVirementsForParticipants: FinancialVirementForParticipant[];
  partners: Partner[];
}

const mapCostCategory = ({ financialVirementsForParticipant, financialVirementsForCost }: MapCostCategoryProps) => {
  const originalRemainingCosts = roundCurrency(
    financialVirementsForCost.originalEligibleCosts - financialVirementsForCost.originalCostsClaimedToDate,
  );
  const newRemainingCosts = roundCurrency(
    financialVirementsForCost.newEligibleCosts - financialVirementsForCost.originalCostsClaimedToDate,
  );
  const originalRemainingGrant = roundCurrency(
    originalRemainingCosts * (financialVirementsForParticipant.originalFundingLevel / 100),
  );
  const newRemainingGrant = roundCurrency(newRemainingCosts * (financialVirementsForParticipant.newFundingLevel / 100));

  return {
    virementCostId: financialVirementsForCost.id,
    virementParticipantId: financialVirementsForParticipant.id,
    // name: financialVirementsForCost.name,
    originalEligibleCosts: financialVirementsForCost.originalEligibleCosts,
    newEligibleCosts: financialVirementsForCost.newEligibleCosts,
    originalCostsClaimedToDate: financialVirementsForCost.originalCostsClaimedToDate,
    originalRemainingCosts,
    newRemainingCosts,
    originalRemainingGrant,
    newRemainingGrant,
  };
};

const mapProjectParticipant = ({
  financialVirementsForParticipant,
  financialVirementsForCosts,
  partner,
}: MapToFinancialVirementProps) => {
  let costsClaimedToDate = 0;
  let originalEligibleCosts = 0;
  let newRemainingGrant = 0;
  let originalRemainingGrant = 0;
  let newEligibleCosts = 0;

  const costCategoryVirements = financialVirementsForCosts
    .filter(financialVirementsForCost => financialVirementsForCost.parentId === financialVirementsForParticipant.id)
    .map(financialVirementsForCost => {
      const costCategoryVirement = mapCostCategory({ financialVirementsForParticipant, financialVirementsForCost });

      costsClaimedToDate = roundCurrency(costsClaimedToDate + costCategoryVirement.originalCostsClaimedToDate);
      originalEligibleCosts = roundCurrency(originalEligibleCosts + costCategoryVirement.originalEligibleCosts);
      newRemainingGrant = roundCurrency(newRemainingGrant + costCategoryVirement.newRemainingGrant);
      originalRemainingGrant = roundCurrency(originalRemainingGrant + costCategoryVirement.originalRemainingGrant);
      newEligibleCosts = roundCurrency(newEligibleCosts + costCategoryVirement.newEligibleCosts);

      return costCategoryVirement;
    });

  const originalRemainingCosts = roundCurrency(originalEligibleCosts - costsClaimedToDate);
  const newRemainingCosts = roundCurrency(newEligibleCosts - costsClaimedToDate);
  const grantDifference = roundCurrency(newRemainingGrant - originalRemainingGrant);
  const costDifference = roundCurrency(newEligibleCosts - originalEligibleCosts);

  return {
    virementParticipantId: financialVirementsForParticipant.id,
    partnerId: financialVirementsForParticipant.partnerId,
    name: partner.name,
    isLead: partner.isLead,

    costsClaimedToDate,
    originalEligibleCosts,
    originalRemainingCosts,
    newEligibleCosts,
    newRemainingCosts,
    originalRemainingGrant,
    newRemainingGrant,
    costDifference,
    grantDifference,

    virements: costCategoryVirements,

    originalFundingLevel: financialVirementsForParticipant.originalFundingLevel,
    newFundingLevel: financialVirementsForParticipant.newFundingLevel,
  };
};

const mapVirements = ({ financialVirementsForParticipants, financialVirementsForCosts, partners }: MapVirements) => {
  let costsClaimedToDate = 0;
  let originalEligibleCosts = 0;
  let originalRemainingCosts = 0;
  let originalRemainingGrant = 0;
  let newEligibleCosts = 0;
  let newRemainingCosts = 0;
  let newRemainingGrant = 0;
  let hasAvailablePartners = false;

  const virements = sortPartnersLeadFirst(partners).map(partner => {
    const financialVirementsForParticipant = financialVirementsForParticipants.find(
      financialVirementsForParticipant => financialVirementsForParticipant.partnerId === partner.id,
    ) as FinancialVirementForParticipant;

    const partnerVirement = mapProjectParticipant({
      financialVirementsForParticipant,
      financialVirementsForCosts,
      partner,
    });

    costsClaimedToDate = roundCurrency(costsClaimedToDate + partnerVirement.costsClaimedToDate);
    originalEligibleCosts = roundCurrency(originalEligibleCosts + partnerVirement.originalEligibleCosts);
    originalRemainingCosts = roundCurrency(originalRemainingCosts + partnerVirement.originalRemainingCosts);
    originalRemainingGrant = roundCurrency(originalRemainingGrant + partnerVirement.originalRemainingGrant);
    newEligibleCosts = roundCurrency(newEligibleCosts + partnerVirement.newEligibleCosts);
    newRemainingCosts = roundCurrency(newRemainingCosts + partnerVirement.newRemainingCosts);
    newRemainingGrant = roundCurrency(newRemainingGrant + partnerVirement.newRemainingGrant);
    if (partnerVirement.virements.length > 0) hasAvailablePartners = true;

    return partnerVirement;
  });

  const grantDifference = roundCurrency(newRemainingGrant - originalRemainingGrant);
  const costDifference = roundCurrency(newEligibleCosts - originalEligibleCosts);
  const hasAvailableGrant: boolean = grantDifference < 0;
  const hasMatchingGrant: boolean = grantDifference === 0;
  const isValidGrantTotal: boolean = hasAvailableGrant || hasMatchingGrant;

  const originalFundingLevel = roundCurrency(
    originalRemainingCosts ? (100 * originalRemainingGrant) / originalRemainingCosts : 0,
  );
  const newFundingLevel = roundCurrency(newRemainingCosts ? (100 * newRemainingGrant) / newRemainingCosts : 0);

  return {
    virementData: {
      costsClaimedToDate,
      originalEligibleCosts,
      originalRemainingCosts,
      originalRemainingGrant,
      newEligibleCosts,
      newRemainingCosts,
      newRemainingGrant,
      grantDifference,
      costDifference,
      virements,
      originalFundingLevel,
      newFundingLevel,
    },
    virementMeta: {
      hasMatchingGrant,
      hasAvailableGrant,
      originalRemainingGrant,
      grantDifference,
      isValidGrantTotal,
    },
    isSummaryValid: isValidGrantTotal && hasAvailablePartners,
  };
};

const useMapVirements = (props: MapVirements) => {
  return useMemo(() => {
    return mapVirements(props);
  }, [props.financialVirementsForCosts, props.financialVirementsForParticipants]);
};

export { mapVirements, useMapVirements, MapVirements };
