import { makeZodI18nMap } from "@shared/zodi18n";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import {
  mapToForecastTableDto,
  MapToForecastTableProps,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/useMapToForecastTableDto";
import { z, ZodIssueCode } from "zod";
import { FormTypes } from "./FormTypes";
import {
  currencyValidation,
  partnerIdValidation,
  profileIdValidation,
  projectIdValidation,
} from "./helperValidators.zod";

type ForecastTableSchemaType = ReturnType<typeof getForecastTableValidation>["schema"];
const getForecastTableValidation = (data: Omit<MapToForecastTableProps, "clientProfiles">) => {
  const errorMap = makeZodI18nMap({ keyPrefix: ["forecastTable"], context: data });

  const schema = z
    .object({
      projectId: projectIdValidation,
      partnerId: partnerIdValidation,
      form: z.union([z.literal(FormTypes.ClaimForecastSaveAndContinue), z.literal(FormTypes.ClaimForecastSaveAndQuit)]),
      profile: z.record(profileIdValidation, currencyValidation).optional(),
    })
    .superRefine(({ profile: clientProfiles }, { addIssue, path }) => {
      const table = mapToForecastTableDto({ ...data, clientProfiles });
      const nonForecastClaims = data.claims.filter(x => getClaimStatusGroup(x.status) !== ClaimStatusGroup.FORECAST);
      const finalClaim = nonForecastClaims.find(claim => claim.isFinalClaim);

      if (table.totalRow.total > table.totalRow.golCost) {
        addIssue({
          code: ZodIssueCode.too_big,
          maximum: table.totalRow.golCost,
          inclusive: false,
          type: "number",
          path: [...path, "total"],
        });
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
