import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  financialVirementForCostsIdValidation,
  partnerIdValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { MapVirements } from "../../../utils/useMapFinancialVirements";
import { mapOverwrittenFinancialVirements } from "./CostCategoryLevelReallocateCostsEdit.logic";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";

const costCategoryLevelReallocateCostsEditErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "reallocateCosts", "costCategoryLevel"],
});

const getCostCategoryLevelReallocateCostsEditSchema = ({
  mapReallocateCostsProps,
}: {
  mapReallocateCostsProps: MapVirements;
}) =>
  z
    .object({
      form: z.literal(FormTypes.PcrReallocateCostsCostCategorySaveAndContinue),
      projectId: projectIdValidation,
      partnerId: partnerIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      virements: z.array(
        z.object({
          virementCostId: financialVirementForCostsIdValidation,
          newEligibleCosts: getGenericCurrencyValidation({
            required: true,
          }),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      const { virementData } = mapOverwrittenFinancialVirements(mapReallocateCostsProps)(data.virements);

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

type CostCategoryLevelReallocateCostsEditSchemaType = ReturnType<typeof getCostCategoryLevelReallocateCostsEditSchema>;

export {
  CostCategoryLevelReallocateCostsEditSchemaType,
  costCategoryLevelReallocateCostsEditErrorMap,
  getCostCategoryLevelReallocateCostsEditSchema,
};
