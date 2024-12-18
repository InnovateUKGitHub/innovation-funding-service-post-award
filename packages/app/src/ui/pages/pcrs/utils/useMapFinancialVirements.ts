import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import {
  CostCategoryVirementDto,
  FinancialVirementDto,
  PartnerVirementsDto,
} from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities/financialVirement";
import { roundCurrency } from "@framework/util/numberHelper";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { useMemo } from "react";

type FinancialVirementForCost = Pick<
  CostCategoryFinancialVirement,
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
  PartnerFinancialVirement,
  "id" | "newEligibleCosts" | "partnerId" | "newFundingLevel" | "originalFundingLevel" | "newRemainingGrant"
>;
type Partner = Pick<
  PartnerDto,
  "id" | "name" | "isLead" | "remainingParticipantGrant" | "capLimitDeferredGrant" | "capLimit"
>;

interface MapToFinancialVirementProps {
  financialVirementsForCosts: FinancialVirementForCost[];
  financialVirementsForParticipant: FinancialVirementForParticipant;
  claimOverrideAwardRates?: ClaimOverrideRateDto;
  partner: Partner;
}

interface MapCostCategoryProps {
  financialVirementsForCost: FinancialVirementForCost;
  financialVirementsForParticipant: FinancialVirementForParticipant;
  claimOverrideAwardRates?: ClaimOverrideRateDto;
}

interface MappedFinancialVirementCostCategoryDto extends CostCategoryVirementDto {
  virementCostId: FinancialVirementForCostsId;
  virementParticipantId: FinancialVirementForParticipantId;
  newFundingLevel: number;
  originalFundingLevel: number;
}

interface MappedFinancialVirementParticipantDto extends PartnerVirementsDto {
  virementParticipantId: FinancialVirementForParticipantId;
  isLead: boolean;
  name: string;
  costDifference: number;
  grantDifference: number;
  originalAvailableGrant: number;
  originalCapLimitDeferredGrant: number;
  newAvailableGrant: number;
  virements: MappedFinancialVirementCostCategoryDto[];
}

interface MappedFinancialVirementDto extends FinancialVirementDto {
  grantDifference: number;
  availableGrantDifference: number;
  newAvailableGrant: number;
  costDifference: number;
  originalAvailableGrant: number;
  originalCapLimitDeferredGrant: number;
  partners: MappedFinancialVirementParticipantDto[];
  currentPartnerId?: PartnerId;
}

interface MappedFinancialVirementMeta {
  hasMatchingGrant: boolean;
  hasAvailableGrant: boolean;
  originalRemainingGrant: number;
  grantDifference: number;
  isValidGrantTotal: boolean;
}

interface MappedFinancialVirement {
  virementData: MappedFinancialVirementDto;
  virementMeta: MappedFinancialVirementMeta;
  isSummaryValid: boolean;
}

interface MapVirements {
  financialVirementsForCosts: FinancialVirementForCost[];
  financialVirementsForParticipants: FinancialVirementForParticipant[];
  claimOverrideAwardRates?: ClaimOverrideRateDto;
  partners: Partner[];
  pcrItemId: PcrItemId;
  currentPartnerId?: PartnerId;
}

const mapCostCategory = ({
  financialVirementsForParticipant,
  financialVirementsForCost,
  claimOverrideAwardRates,
}: MapCostCategoryProps): MappedFinancialVirementCostCategoryDto => {
  const originalRemainingCosts =
    financialVirementsForCost.originalEligibleCosts - financialVirementsForCost.originalCostsClaimedToDate;

  const newRemainingCosts =
    financialVirementsForCost.newEligibleCosts - financialVirementsForCost.originalCostsClaimedToDate;

  const originalRemainingGrant = originalRemainingCosts * (financialVirementsForParticipant.originalFundingLevel / 100);

  const newRemainingGrant = newRemainingCosts * (financialVirementsForParticipant.newFundingLevel / 100);

  let originalFundingLevel = financialVirementsForParticipant.originalFundingLevel;
  let newFundingLevel = financialVirementsForParticipant.newFundingLevel;

  if (claimOverrideAwardRates?.type === AwardRateOverrideType.BY_COST_CATEGORY) {
    const override = claimOverrideAwardRates.overrides.find(
      x => x.costCategoryId === financialVirementsForCost.costCategoryId,
    );

    if (override) {
      originalFundingLevel = override.amount;
      newFundingLevel = override.amount;
    }
  }

  return {
    virementCostId: financialVirementsForCost.id,
    virementParticipantId: financialVirementsForParticipant.id,
    originalEligibleCosts: financialVirementsForCost.originalEligibleCosts,
    newEligibleCosts: financialVirementsForCost.newEligibleCosts,
    costsClaimedToDate: financialVirementsForCost.originalCostsClaimedToDate,
    originalRemainingCosts,
    newRemainingCosts,
    originalRemainingGrant,
    newRemainingGrant,
    originalFundingLevel,
    newFundingLevel,
    costCategoryId: financialVirementsForCost.costCategoryId,
    costCategoryName: financialVirementsForCost.costCategoryName ?? "",
  };
};

const mapProjectParticipant = ({
  financialVirementsForParticipant,
  financialVirementsForCosts,
  claimOverrideAwardRates,
  partner,
}: MapToFinancialVirementProps): MappedFinancialVirementParticipantDto => {
  let costsClaimedToDate = 0;
  let originalEligibleCosts = 0;
  let newRemainingGrant = 0;
  let originalRemainingGrant = 0;
  let originalAvailableGrant;
  let newEligibleCosts = 0;
  let newAvailableGrant = 0;

  const costCategoryVirements = financialVirementsForCosts
    .filter(financialVirementsForCost => financialVirementsForCost.parentId === financialVirementsForParticipant.id)
    .map(financialVirementsForCost => {
      const costCategoryVirement = mapCostCategory({
        financialVirementsForParticipant,
        financialVirementsForCost,
        claimOverrideAwardRates,
      });

      costsClaimedToDate += costCategoryVirement.costsClaimedToDate;
      originalEligibleCosts += costCategoryVirement.originalEligibleCosts;
      newRemainingGrant += costCategoryVirement.newRemainingGrant;
      originalRemainingGrant += costCategoryVirement.originalRemainingGrant;
      newEligibleCosts += costCategoryVirement.newEligibleCosts;

      return costCategoryVirement;
    });

  costsClaimedToDate = roundCurrency(costsClaimedToDate);
  originalEligibleCosts = roundCurrency(originalEligibleCosts);
  newEligibleCosts = roundCurrency(newEligibleCosts);
  // Trust in Salesforce to have the correct number, as a claim period could have a different paid out grant level
  // Don't know why - See ACC-11652 for more information.
  originalRemainingGrant = roundCurrency(partner.remainingParticipantGrant || originalRemainingGrant);
  newRemainingGrant = roundCurrency(financialVirementsForParticipant?.newRemainingGrant || newRemainingGrant);
  const originalRemainingCosts = roundCurrency(originalEligibleCosts - costsClaimedToDate);
  const newRemainingCosts = roundCurrency(newEligibleCosts - costsClaimedToDate);
  const grantDifference = roundCurrency(newRemainingGrant - originalRemainingGrant);
  const costDifference = roundCurrency(newEligibleCosts - originalEligibleCosts);

  if (typeof partner.capLimit === "number") {
    originalAvailableGrant = roundCurrency(originalRemainingGrant - (partner.capLimitDeferredGrant ?? 0));
    newAvailableGrant = roundCurrency(newRemainingGrant - (partner.capLimitDeferredGrant ?? 0));
  } else {
    originalAvailableGrant = originalRemainingGrant;
    newAvailableGrant = newRemainingGrant;
  }

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
    newAvailableGrant,
    originalRemainingGrant,
    originalAvailableGrant,
    originalCapLimitDeferredGrant: partner.capLimitDeferredGrant ?? 0,
    newRemainingGrant,
    costDifference,
    grantDifference,
    virements: costCategoryVirements,
    originalFundingLevel: financialVirementsForParticipant.originalFundingLevel,
    newFundingLevel: financialVirementsForParticipant.newFundingLevel,
  };
};

const mapVirements = ({
  financialVirementsForParticipants,
  financialVirementsForCosts,
  claimOverrideAwardRates,
  partners,
  pcrItemId,
  currentPartnerId,
}: MapVirements): MappedFinancialVirement => {
  let costsClaimedToDate = 0;
  let originalEligibleCosts = 0;
  let originalRemainingCosts = 0;
  let originalRemainingGrant = 0;
  let originalAvailableGrant = 0;
  let originalCapLimitDeferredGrant = 0;
  let newEligibleCosts = 0;
  let newRemainingCosts = 0;
  let newRemainingGrant = 0;
  let newAvailableGrant = 0;
  let hasAvailablePartners = false;

  const partnerVirements = sortPartnersLeadFirst(partners)
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
        claimOverrideAwardRates,
        partner,
      });

      costsClaimedToDate += partnerVirement.costsClaimedToDate;
      originalEligibleCosts += partnerVirement.originalEligibleCosts;
      originalRemainingCosts += partnerVirement.originalRemainingCosts;
      originalRemainingGrant += partnerVirement.originalRemainingGrant;
      originalAvailableGrant += partnerVirement.originalAvailableGrant;
      originalCapLimitDeferredGrant += partnerVirement.originalCapLimitDeferredGrant;
      newEligibleCosts += partnerVirement.newEligibleCosts;
      newRemainingCosts += partnerVirement.newRemainingCosts;
      newRemainingGrant += partnerVirement.newRemainingGrant;
      newAvailableGrant += partnerVirement.newAvailableGrant;
      if (partnerVirement.virements.length > 0) hasAvailablePartners = true;

      return partnerVirement;
    })
    .filter(x => x);

  costsClaimedToDate = roundCurrency(costsClaimedToDate);
  originalEligibleCosts = roundCurrency(originalEligibleCosts);
  originalRemainingCosts = roundCurrency(originalRemainingCosts);
  originalRemainingGrant = roundCurrency(originalRemainingGrant);
  originalAvailableGrant = roundCurrency(originalAvailableGrant);
  originalCapLimitDeferredGrant = roundCurrency(originalCapLimitDeferredGrant);
  newEligibleCosts = roundCurrency(newEligibleCosts);
  newRemainingCosts = roundCurrency(newRemainingCosts);
  newRemainingGrant = roundCurrency(newRemainingGrant);
  newAvailableGrant = roundCurrency(newAvailableGrant);

  const availableGrantDifference = roundCurrency(newAvailableGrant - originalAvailableGrant);
  const grantDifference = roundCurrency(newRemainingGrant - originalRemainingGrant);
  const costDifference = roundCurrency(newEligibleCosts - originalEligibleCosts);
  const hasAvailableGrant: boolean = grantDifference < 0;
  const hasMatchingGrant: boolean = grantDifference === 0;
  const isValidGrantTotal: boolean = hasAvailableGrant || hasMatchingGrant;
  const originalFundingLevel = originalRemainingCosts ? (100 * originalRemainingGrant) / originalRemainingCosts : 0;
  const newFundingLevel = newRemainingCosts ? (100 * newRemainingGrant) / newRemainingCosts : 0;

  return {
    virementData: {
      costsClaimedToDate,
      originalEligibleCosts,
      originalRemainingCosts,
      originalRemainingGrant,
      originalAvailableGrant,
      originalCapLimitDeferredGrant,
      availableGrantDifference,
      newEligibleCosts,
      newRemainingCosts,
      newRemainingGrant,
      newAvailableGrant,
      grantDifference,
      costDifference,
      partners: partnerVirements,
      originalFundingLevel: roundCurrency(originalFundingLevel),
      newFundingLevel: roundCurrency(newFundingLevel),
      pcrItemId,
      currentPartnerId,
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

const useMapFinancialVirements = (props: MapVirements) => {
  return useMemo(() => {
    return mapVirements(props);
  }, [props.financialVirementsForCosts, props.financialVirementsForParticipants]);
};

type MappedFinancialVirements = ReturnType<typeof mapVirements>;

export { mapVirements, useMapFinancialVirements, MapVirements };
export type { MappedFinancialVirements, FinancialVirementForCost };
