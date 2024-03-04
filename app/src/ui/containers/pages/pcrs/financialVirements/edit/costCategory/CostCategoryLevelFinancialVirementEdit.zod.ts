import { parseCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  financialVirementForCostsIdValidation,
  partnerIdValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
  zeroOrGreaterCurrencyValidation,
} from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";

const costCategoryLevelFinancialVirementEditErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "financialVirements", "costCategoryLevel"],
});

const costCategoryLevelFinancialVirementEditSchema = z.object({
  form: z.literal(FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  pcrId: pcrIdValidation,
  pcrItemId: pcrItemIdValidation,
  virements: z.array(
    z
      .object({
        virementCostId: financialVirementForCostsIdValidation,
        newEligibleCosts: zeroOrGreaterCurrencyValidation,
        costsClaimedToDate: z.number(),
        costCategoryName: z.string(),
      })
      .superRefine((data, ctx) => {
        if (parseCurrency(data.newEligibleCosts) < data.costsClaimedToDate) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["newEligibleCosts"],
            params: { i18n: "errors.costs_too_small", name: data.costCategoryName },
          });
        }
      }),
  ),
});

type CostCategoryLevelFinancialVirementEditSchemaType = typeof costCategoryLevelFinancialVirementEditSchema;

export {
  CostCategoryLevelFinancialVirementEditSchemaType,
  costCategoryLevelFinancialVirementEditErrorMap,
  costCategoryLevelFinancialVirementEditSchema,
};
