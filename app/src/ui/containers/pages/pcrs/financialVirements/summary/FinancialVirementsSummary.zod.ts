import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  emptyStringToUndefinedValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
  zeroOrGreaterCurrencyValidation,
} from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { MapVirements, mapVirements } from "../../utils/useMapFinancialVirements";

const financialVirementsSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "financialVirements"] });

const getFinancialVirementsSummaryValidator = ({
  mapFinancialVirementProps,
}: {
  mapFinancialVirementProps: MapVirements;
}) => {
  return z
    .object({
      projectId: projectIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      form: z.literal(FormTypes.PcrFinancialVirementsSummary),
      grantMovingOverFinancialYear: z.union([zeroOrGreaterCurrencyValidation, emptyStringToUndefinedValidation]),
      markedAsComplete: z.boolean(),
    })
    .superRefine((data, ctx) => {
      const { isSummaryValid, virementData, virementMeta } = mapVirements(mapFinancialVirementProps);

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

        if (typeof data.grantMovingOverFinancialYear === "undefined") {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["grantMovingOverFinancialYear"],
            params: {
              i18n: "errors.required",
            },
          });
        }

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
};

type FinancialVirementsSummaryValidatorSchema = ReturnType<typeof getFinancialVirementsSummaryValidator>;

export {
  financialVirementsSummaryErrorMap,
  getFinancialVirementsSummaryValidator,
  FinancialVirementsSummaryValidatorSchema,
};
