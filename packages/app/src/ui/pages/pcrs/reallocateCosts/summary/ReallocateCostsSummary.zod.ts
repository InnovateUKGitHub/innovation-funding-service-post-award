import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { evaluateObject } from "@ui/zod/helperValidators/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { MapVirements, mapVirements } from "../../utils/useMapFinancialVirements";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { financialVirementValidator } from "../../utils/mapFinancialVirements.zod";

const reallocateCostsSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "reallocateCosts"] });

const reallocateCostsSummaryValidator = evaluateObject(
  (data: { markedAsComplete: boolean; financialVirements: MapVirements }) => ({
    form: z.literal(FormTypes.PcrReallocateCostsSummary),
    grantMovingOverFinancialYear: getGenericCurrencyValidation({
      required: data.markedAsComplete,
    }),
    financialVirements: financialVirementValidator,
    markedAsComplete: z.boolean(),
  }),
).superRefine((data, ctx) => {
  // @ts-expect-error Zod has neglected to allow status to be a field in the first arg passed to super refine
  if (data.status === "aborted") {
    return;
  }
  console.log("here", data);
  const { isSummaryValid, virementData, virementMeta } = mapVirements(data.financialVirements);

  if (data.markedAsComplete) {
    virementData.partners.forEach(partner => {
      if (
        partner.virements.some(
          costCategoryVirement => costCategoryVirement.newEligibleCosts < costCategoryVirement.costsClaimedToDate,
        )
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["partner", partner.partnerId],
          params: {
            i18n: "errors.costs_too_small",
            name: partner.name,
          },
        });
      }
    });

    if (!isSummaryValid) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.virement_too_big",
          difference: virementMeta.grantDifference,
          total: virementMeta.originalRemainingGrant,
        },
      });
    }
  }
});

type ReallocateCostsSummaryValidatorSchema = typeof reallocateCostsSummaryValidator;

export { reallocateCostsSummaryErrorMap, reallocateCostsSummaryValidator, ReallocateCostsSummaryValidatorSchema };
