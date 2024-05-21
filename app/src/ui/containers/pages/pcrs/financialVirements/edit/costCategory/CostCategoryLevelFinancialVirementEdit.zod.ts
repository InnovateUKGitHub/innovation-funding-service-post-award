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
import { MapVirements } from "../../../utils/useMapFinancialVirements";
import { mapOverwrittenFinancialVirements } from "./CostCategoryLevelFinancialVirementEdit.logic";

const costCategoryLevelFinancialVirementEditErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "financialVirements", "costCategoryLevel"],
});

const getCostCategoryLevelFinancialVirementEditSchema = ({
  mapFinancialVirementProps,
}: {
  mapFinancialVirementProps: MapVirements;
}) =>
  z
    .object({
      form: z.literal(FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue),
      projectId: projectIdValidation,
      partnerId: partnerIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      virements: z.array(
        z.object({
          virementCostId: financialVirementForCostsIdValidation,
          newEligibleCosts: zeroOrGreaterCurrencyValidation,
        }),
      ),
    })
    .superRefine((data, ctx) => {
      const { virementData } = mapOverwrittenFinancialVirements(mapFinancialVirementProps)(data.virements);

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

type CostCategoryLevelFinancialVirementEditSchemaType = ReturnType<
  typeof getCostCategoryLevelFinancialVirementEditSchema
>;

export {
  CostCategoryLevelFinancialVirementEditSchemaType,
  costCategoryLevelFinancialVirementEditErrorMap,
  getCostCategoryLevelFinancialVirementEditSchema,
};
