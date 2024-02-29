import { parseCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  currencyValidation,
  emptyStringToUndefinedValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { MapVirements, mapVirements } from "../mapFinancialVirements";

const financialVirementsSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "financialVirements"] });

const getFinancialVirementsSummaryValidator = (props: MapVirements) => {
  return z
    .object({
      projectId: projectIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      form: z.literal(FormTypes.PcrFinancialVirementsSummary),
      grantMovingOverFinancialYear: z.union([emptyStringToUndefinedValidation, currencyValidation]),
      markedAsComplete: z.boolean(),
    })
    .superRefine((data, ctx) => {
      const { isSummaryValid, virementMeta } = mapVirements(props);

      if (data.markedAsComplete) {
        if (typeof data.grantMovingOverFinancialYear === "undefined") {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["grantMovingOverFinancialYear"],
            params: {
              i18n: "errors.required",
            },
          });
        }
      }

      if (!isSummaryValid) {
        ctx.addIssue({
          code: "custom",
          params: {
            i18n: "errors.virement_too_big",
            difference: virementMeta.grantDifference,
            total: virementMeta.originalRemainingGrant,
          },
        });
      }

      if (typeof data.grantMovingOverFinancialYear === "string") {
        const numbericGrantMovingOverFinancialYear = parseCurrency(data.grantMovingOverFinancialYear);

        if (numbericGrantMovingOverFinancialYear < 0) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            minimum: 1,
            inclusive: true,
            type: "number",
            path: ["grantMovingOverFinancialYear"],
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
