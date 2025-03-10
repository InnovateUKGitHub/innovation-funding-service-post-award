import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  booleanValidation,
  costCategoryIdValidation,
  profileIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { sum } from "lodash";
import { z, ZodIssueCode } from "zod";

export type SetupSpendProfileSchemaType = typeof setupSpendProfileSchema;

export const errorMap = makeZodI18nMap({ keyPrefix: ["forecastTable"] });

export const setupSpendProfileSchema = z
  .object({
    form: z.literal(FormTypes.ProjectSetupForecast),
    profile: z
      .record(
        profileIdValidation,
        getGenericCurrencyValidation({
          min: -1_000_000_000,
          required: true,
        }),
      )
      .default({}), // Required for if all forecast cells are disabled
    submit: booleanValidation,
    costCategoryProfiles: z
      .object({
        costCategoryId: costCategoryIdValidation,
        isCalculated: z.boolean(),
        costCategoryName: z.string(),
        total: z.number(),
        profiles: z
          .object({
            profileId: profileIdValidation,
          })
          .array(),
      })
      .array(),
    initialProfile: z.record(profileIdValidation, z.string().nullable()),
  })
  .superRefine((data, { addIssue, path }) => {
    if (data.submit) {
      for (const costCategory of data.costCategoryProfiles) {
        const totalForCategory = sum(
          costCategory.profiles.map(x => parseCurrency(data?.profile?.[x.profileId] ?? "0")),
        );
        const differentFromAllocatedCosts = roundCurrency(totalForCategory) !== roundCurrency(costCategory.total);
        if (!costCategory.isCalculated && differentFromAllocatedCosts) {
          addIssue({
            code: ZodIssueCode.custom,
            path: [...path, "costCategory", costCategory.costCategoryId],
            params: {
              costCategoryName: costCategory.costCategoryName,
              i18n: "errors.forecasts_different",
            },
          });
        }
      }
    }
  });
