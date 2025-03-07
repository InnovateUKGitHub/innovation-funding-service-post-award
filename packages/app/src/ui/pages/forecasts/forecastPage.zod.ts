import { makeZodI18nMap } from "@shared/zodi18n";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { profileIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { z, ZodIssueCode } from "zod";

export type ForecastPageSchema = typeof forecastPageSchema;

export const errorMap = makeZodI18nMap({ keyPrefix: ["forecastTable"] });

export const forecastPageSchema = z
  .object({
    form: z.literal(FormTypes.ForecastTileForecast),
    profile: z
      .record(
        profileIdValidation,
        getGenericCurrencyValidation({
          min: -1_000_000_000,
          required: true,
        }),
      )
      .default({}), // Required for if all forecast cells are disabled
    total: z.number(),
    totalGolCost: z.number(),
    initialProfile: z.record(profileIdValidation, z.string()),
    finalClaim: z.object({ isApproved: z.boolean() }).optional(),
  })
  .superRefine((data, { addIssue, path }) => {
    if (data.total > data.totalGolCost) {
      addIssue({
        code: ZodIssueCode.too_big,
        maximum: data.totalGolCost,
        inclusive: false,
        type: "number",
        path: [...path, "total"],
      });
    }

    // Error if it is the final claim and there are changes made in the clientProfiles list.
    if (typeof data.profile === "object" && Object.keys(data.profile).length !== 0 && data.finalClaim) {
      addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: data.finalClaim.isApproved ? "errors.final_claim_already_approved" : "errors.final_claim",
        },
      });
    }
  });
