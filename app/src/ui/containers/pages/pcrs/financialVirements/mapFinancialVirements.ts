import { PartnerDto } from "@framework/dtos/partnerDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { FinancialVirementForCostsMapping } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { FinancialVirementForParticipantMapping } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { useMemo } from "react";

type FinancialVirementForCost = Pick<
  FinancialVirementForCostsMapping,
  | "costCategoryId"
  | "costCategoryName"
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
  const originalRemainingCosts =
    financialVirementsForCost.originalEligibleCosts - financialVirementsForCost.originalCostsClaimedToDate;

  const newRemainingCosts =
    financialVirementsForCost.newEligibleCosts - financialVirementsForCost.originalCostsClaimedToDate;

  const originalRemainingGrant = originalRemainingCosts * (financialVirementsForParticipant.originalFundingLevel / 100);

  const newRemainingGrant = newRemainingCosts * (financialVirementsForParticipant.newFundingLevel / 100);

  return {
    virementCostId: financialVirementsForCost.id,
    virementParticipantId: financialVirementsForParticipant.id,
    originalEligibleCosts: financialVirementsForCost.originalEligibleCosts,
    newEligibleCosts: financialVirementsForCost.newEligibleCosts,
    originalCostsClaimedToDate: financialVirementsForCost.originalCostsClaimedToDate,
    originalRemainingCosts,
    newRemainingCosts,
    originalRemainingGrant,
    newRemainingGrant,
    costCategoryId: financialVirementsForCost.costCategoryId,
    costCategoryName: financialVirementsForCost.costCategoryName ?? "",
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

      costsClaimedToDate += costCategoryVirement.originalCostsClaimedToDate;
      originalEligibleCosts += costCategoryVirement.originalEligibleCosts;
      newRemainingGrant += costCategoryVirement.newRemainingGrant;
      originalRemainingGrant += costCategoryVirement.originalRemainingGrant;
      newEligibleCosts += costCategoryVirement.newEligibleCosts;

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
    costsClaimedToDate: roundCurrency(costsClaimedToDate),
    originalEligibleCosts: roundCurrency(originalEligibleCosts),
    originalRemainingCosts: roundCurrency(originalRemainingCosts),
    newEligibleCosts: roundCurrency(newEligibleCosts),
    newRemainingCosts,
    originalRemainingGrant: roundCurrency(originalRemainingGrant),
    newRemainingGrant: roundCurrency(newRemainingGrant),
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

  const virements = sortPartnersLeadFirst(partners)
    .filter(partner =>
      financialVirementsForParticipants.find(
        financialVirementsForParticipant => financialVirementsForParticipant.partnerId === partner.id,
      ),
    )
    .map(partner => {
      const financialVirementsForParticipant = financialVirementsForParticipants.find(
        financialVirementsForParticipant => financialVirementsForParticipant.partnerId === partner.id,
      );

      if (!financialVirementsForParticipant) {
        throw new Error(`failed to find match a financial virement with partner of id: ${partner.id}`);
      }
      const partnerVirement = mapProjectParticipant({
        financialVirementsForParticipant,
        financialVirementsForCosts,
        partner,
      });

      costsClaimedToDate += partnerVirement.costsClaimedToDate;
      originalEligibleCosts += partnerVirement.originalEligibleCosts;
      originalRemainingCosts += partnerVirement.originalRemainingCosts;
      originalRemainingGrant += partnerVirement.originalRemainingGrant;
      newEligibleCosts += partnerVirement.newEligibleCosts;
      newRemainingCosts += partnerVirement.newRemainingCosts;
      newRemainingGrant += partnerVirement.newRemainingGrant;
      if (partnerVirement.virements.length > 0) hasAvailablePartners = true;

      return partnerVirement;
    })
    .filter(x => x);

  const grantDifference = roundCurrency(newRemainingGrant - originalRemainingGrant);
  const costDifference = roundCurrency(newEligibleCosts - originalEligibleCosts);
  const hasAvailableGrant: boolean = grantDifference < 0;
  const hasMatchingGrant: boolean = grantDifference === 0;
  const isValidGrantTotal: boolean = hasAvailableGrant || hasMatchingGrant;
  const originalFundingLevel = originalRemainingCosts ? (100 * originalRemainingGrant) / originalRemainingCosts : 0;
  const newFundingLevel = newRemainingCosts ? (100 * newRemainingGrant) / newRemainingCosts : 0;

  return {
    virementData: {
      costsClaimedToDate: roundCurrency(costsClaimedToDate),
      originalEligibleCosts: roundCurrency(originalEligibleCosts),
      originalRemainingCosts: roundCurrency(originalRemainingCosts),
      originalRemainingGrant: roundCurrency(originalRemainingGrant),
      newEligibleCosts: roundCurrency(newEligibleCosts),
      newRemainingCosts: roundCurrency(newRemainingCosts),
      newRemainingGrant: roundCurrency(newRemainingGrant),
      grantDifference,
      costDifference,
      virements,
      originalFundingLevel: roundCurrency(originalFundingLevel),
      newFundingLevel: roundCurrency(newFundingLevel),
    },
    virementMeta: {
      hasMatchingGrant,
      hasAvailableGrant,
      originalRemainingGrant: roundCurrency(originalRemainingGrant),
      grantDifference: roundCurrency(grantDifference),
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
