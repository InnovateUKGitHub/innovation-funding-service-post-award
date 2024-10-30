import { roundCurrency, parseCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { partnerIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { z } from "zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "changeRemainingGrant"] });

export const changeRemainingGrantSchema = z
  .object({
    form: z.literal(FormTypes.PcrReallocateCostsChangeRemainingGrant),
    partners: z.array(
      z
        .object({
          newRemainingGrant: getGenericCurrencyValidation({
            required: true,
          }),
          newRemainingCosts: z.number(),
          newFundingLevel: z.number(),
          originalFundingLevel: z.number(),
          originalRemainingCosts: z.number(),
          originalRemainingGrant: z.number(),
          partnerId: partnerIdValidation,
        })
        .superRefine((data, ctx) => {
          if (roundCurrency(parseCurrency(data.newRemainingGrant)) > roundCurrency(data.newRemainingCosts)) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              type: "number",
              inclusive: true,
              maximum: data.newRemainingCosts,
              path: ["newRemainingGrant"],
            });
          }
        }),
    ),
    originalRemainingGrant: z.number(),
    newRemainingGrant: z.number(),
    newRemainingCosts: z.number(),
  })
  .superRefine((data, ctx) => {
    if (roundCurrency(data.newRemainingGrant) > roundCurrency(data.originalRemainingGrant)) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "number",
        inclusive: true,
        maximum: data.newRemainingCosts,
        path: ["newRemainingGrant"],
      });
    }
  });

export type ChangeRemainingGrantSchemaType = typeof changeRemainingGrantSchema;
export type ChangeRemainingGrantSchema = z.infer<ChangeRemainingGrantSchemaType>;
