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
import { MapVirements, mapVirements } from "../../../utils/useMapFinancialVirements";
import { patchFinancialVirementsForCosts } from "./CostCategoryLevelFinancialVirementEdit.logic";

const costCategoryLevelFinancialVirementEditErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "financialVirements", "costCategoryLevel"],
});

const getCostCategoryLevelFinancialVirementEditSchema = ({
  financialVirementsForCosts,
  financialVirementsForParticipants,
  partners,
  pcrItemId,
}: MapVirements) =>
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
      const { virementData } = mapVirements({
        financialVirementsForCosts: patchFinancialVirementsForCosts(financialVirementsForCosts, data.virements),
        financialVirementsForParticipants,
        partners,
        pcrItemId,
      });

      const partner = virementData.partners.find(x => x.partnerId === data.partnerId)!;

      data.virements.forEach(({ virementCostId }, i) => {
        const costCategoryVirement = partner.virements.find(x => x.virementCostId === virementCostId)!;

        if (costCategoryVirement.newEligibleCosts < costCategoryVirement.costsClaimedToDate) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["virements", i, "newEligibleCosts"],
            params: { i18n: "errors.costs_too_small", name: costCategoryVirement.costCategoryName },
          });
        }
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
