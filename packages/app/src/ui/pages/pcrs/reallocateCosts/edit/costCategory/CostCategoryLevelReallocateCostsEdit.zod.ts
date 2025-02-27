import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  financialVirementForCostsIdValidation,
  partnerIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { mapOverwrittenFinancialVirements } from "./CostCategoryLevelReallocateCostsEdit.logic";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { financialVirementValidator } from "@ui/pages/pcrs/utils/mapFinancialVirements.zod";

const costCategoryLevelReallocateCostsEditErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "reallocateCosts", "costCategoryLevel"],
});

export const costCategoryLevelReallocateCostsEditSchema = z
  .object({
    form: z.literal(FormTypes.PcrReallocateCostsCostCategorySaveAndContinue),
    partnerId: partnerIdValidation,
    virements: z.array(
      z.object({
        virementCostId: financialVirementForCostsIdValidation,
        newEligibleCosts: getGenericCurrencyValidation({
          required: true,
        }),
        initialNewEligibleCosts: getGenericCurrencyValidation({ required: false }),
      }),
    ),
    financialVirements: financialVirementValidator,
  })
  .superRefine((data, ctx) => {
    // @ts-expect-error Zod has neglected to allow status to be a field in the first arg passed to super refine
    if (data.status === "aborted") {
      return;
    }
    const { virementData } = mapOverwrittenFinancialVirements(data.financialVirements)(data.virements);

    virementData.partners.forEach(partner => {
      partner.virements.forEach((costCategoryVirement, i) => {
        if (
          partner.partnerId === data.partnerId &&
          costCategoryVirement.newEligibleCosts < costCategoryVirement.costsClaimedToDate
        ) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["virements", i, "newEligibleCosts"],
            params: {
              i18n: "errors.costs_too_small",
              name: costCategoryVirement.costCategoryName,
              costsClaimedToDate: costCategoryVirement.costsClaimedToDate,
            },
          });
        }
      });
    });
  });

type CostCategoryLevelReallocateCostsEditSchemaType = typeof costCategoryLevelReallocateCostsEditSchema;

export { CostCategoryLevelReallocateCostsEditSchemaType, costCategoryLevelReallocateCostsEditErrorMap };
