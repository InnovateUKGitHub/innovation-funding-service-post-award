import { makeZodI18nMap } from "@shared/zodi18n";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import {
  mapToForecastTableDto,
  MapToForecastTableProps,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { z, ZodIssueCode } from "zod";
import { FormTypes } from "./FormTypes";
import {
  booleanValidation,
  partnerIdValidation,
  profileIdValidation,
  projectIdValidation,
} from "./helperValidators.zod";
import { getGenericCurrencyValidation } from "./currencyValidator.zod";

type ForecastTableSchemaType = ReturnType<typeof getForecastTableValidation>["schema"];
const getForecastTableValidation = (data: Omit<MapToForecastTableProps, "clientProfiles">) => {
  const errorMap = makeZodI18nMap({ keyPrefix: ["forecastTable"], context: data });

  const schema = z
    .object({
      projectId: projectIdValidation,
      partnerId: partnerIdValidation,
      form: z.union([
        z.literal(FormTypes.ClaimForecastSaveAndContinue),
        z.literal(FormTypes.ClaimForecastSaveAndQuit),
        z.literal(FormTypes.ProjectSetupForecast),
        z.literal(FormTypes.ForecastTileForecast),
      ]),
      profile: z.record(
        profileIdValidation,
        getGenericCurrencyValidation({
          label: "forms.forecastTable.profile.label",
          min: -1_000_000_000,
          required: true,
        }),
      ),
      submit: booleanValidation,
    })
    .superRefine(({ profile: clientProfiles, form, submit }, { addIssue, path }) => {
      const table = mapToForecastTableDto({ ...data, clientProfiles });
      const nonForecastClaims = data.claimTotalProjectPeriods.filter(
        x => getClaimStatusGroup(x.status) !== ClaimStatusGroup.FORECAST,
      );
      const finalClaim = nonForecastClaims.find(claim => claim.isFinalClaim);

      if (form === FormTypes.ProjectSetupForecast) {
        if (submit) {
          for (const costCategory of table.costCategories) {
            if (costCategory.differentThanAllocatedCosts && !costCategory.isCalculated) {
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
      } else {
        // Don't check if the total is too big for project setup spend profile
        // (there is already a check for each cost cat)
        if (table.totalRow.total > table.totalRow.golCost) {
          addIssue({
            code: ZodIssueCode.too_big,
            maximum: table.totalRow.golCost,
            inclusive: false,
            type: "number",
            path: [...path, "total"],
          });
        }
      }

      if (clientProfiles && finalClaim) {
        addIssue({
          code: ZodIssueCode.custom,
          params: {
            i18n: finalClaim.isApproved ? "errors.final_claim_already_approved" : "errors.final_claim",
          },
        });
      }
    });

  return { errorMap, schema };
};

export { getForecastTableValidation };
export type { ForecastTableSchemaType };
