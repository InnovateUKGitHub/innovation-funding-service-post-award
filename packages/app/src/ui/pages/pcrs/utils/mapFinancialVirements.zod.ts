import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import {
  costCategoryIdValidation,
  financialVirementForCostsIdValidation,
  financialVirementForPartnerIdValidation,
  partnerIdValidation,
  pcrItemIdValidation,
  periodIdValidation,
  profileIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { z } from "zod";

export const financialVirementValidator = z.object({
  financialVirementsForCosts: z.array(
    z.object({
      costCategoryId: costCategoryIdValidation,
      costCategoryName: z.string().optional(),
      id: financialVirementForCostsIdValidation,
      newEligibleCosts: z.number(),
      originalCostsClaimedToDate: z.number(),
      originalEligibleCosts: z.number(),
      profileId: profileIdValidation,
      parentId: financialVirementForPartnerIdValidation,
    }),
  ),
  financialVirementsForParticipants: z.array(
    z.object({
      id: financialVirementForPartnerIdValidation,
      partnerId: partnerIdValidation,
      newEligibleCosts: z.number(),
      newFundingLevel: z.number(),
      originalFundingLevel: z.number(),
      newRemainingGrant: z.number().optional(),
    }),
  ),
  partners: z.array(
    z.object({
      id: partnerIdValidation,
      name: z.string(),
      isLead: z.boolean(),
    }),
  ),
  claimOverrideAwardRates: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal(AwardRateOverrideType.NONE),
        overrides: z.never().array(),
      }),
      z.object({
        type: z.literal(AwardRateOverrideType.BY_COST_CATEGORY),
        overrides: z
          .object({
            costCategoryId: costCategoryIdValidation,
            costCategoryName: z.string(),
            amount: z.number(),
            target: z.number().transform(x => x as unknown as AwardRateOverrideTarget),
            targetId: partnerIdValidation.optional(),
          })
          .array(),
      }),
      z.object({
        type: z.literal(AwardRateOverrideType.BY_PERIOD),
        overrides: z
          .object({
            period: periodIdValidation,
            amount: z.number(),
            target: z.number().transform(x => x as unknown as AwardRateOverrideTarget),
            targetId: partnerIdValidation.optional(),
          })
          .array(),
      }),
    ])
    .optional(),
  pcrItemId: pcrItemIdValidation,
  currentPartnerId: partnerIdValidation.optional(),
});

export type FinancialVirementValidator = typeof financialVirementValidator;
