import { ZodIssueCode, z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimSummary"] });

export const getClaimSummarySchema = ({
  iarRequired,
  pcfRequired,
  claimDetails,
}: {
  iarRequired: boolean;
  pcfRequired: boolean;
  claimDetails: Pick<
    CostsSummaryForPeriodDto,
    | "costsClaimedToDate"
    | "costCategoryId"
    | "costsClaimedThisPeriod"
    | "forecastThisPeriod"
    | "offerTotal"
    | "remainingOfferCosts"
  >[];
}) =>
  z.discriminatedUnion("button_submit", [
    z.object({
      button_submit: z.literal("submit"),
      status: z.string().superRefine((_, ctx) => {
        const remainingOfferCosts = claimDetails.reduce((total, item) => total + item.remainingOfferCosts, 0);

        if (remainingOfferCosts < 0) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            path: ["totalCosts"],
            type: "number",
            inclusive: true,
            minimum: 0,
          });
        }
      }),

      comments: z.string().max(1000),
      documents: z
        .object({ description: z.nullable(z.number()).optional() })
        .array()
        .superRefine((data, ctx) => {
          // x => !iarRequired || x.some(doc => doc.description === DocumentDescription.IAR)

          if (iarRequired) {
            if (!data.some(doc => doc.description === DocumentDescription.IAR)) {
              ctx.addIssue({ code: ZodIssueCode.custom, params: { i18n: "errors.iar_required" } });
            }
          }

          if (pcfRequired) {
            if (!data.some(doc => doc.description === DocumentDescription.ProjectCompletionForm)) {
              ctx.addIssue({ code: ZodIssueCode.custom, params: { i18n: "errors.pcf_required" } });
            }
          }
        }),
    }),
    z.object({
      button_submit: z.literal("saveAndReturnToClaims"),
      status: z.string(),
      comments: z.string().max(1000),
    }),
  ]);

export type ClaimSummarySchema = z.output<ReturnType<typeof getClaimSummarySchema>>;
