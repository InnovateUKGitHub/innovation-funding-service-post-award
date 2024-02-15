import { ClaimDto } from "@framework/dtos/claimDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  ClaimPcfIarSharedValidatorResult,
  iarValidation,
  pcfValidation,
} from "@ui/validation/validators/shared/claimPcfIarSharedValidator";
import { ZodIssueCode, z } from "zod";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimSummary"] });

/**
 * Run both PCF and IAR (KTP: Schedule 3) validation
 *
 * YOU MUST update the Confluence document before editing the code.
 * https://ukri.atlassian.net/wiki/spaces/ACC/pages/467107882/PCF+IAR+Validation
 *
 * Differences here:
 * 1. Draft/Queried validation is not ran here since it is assumed being on the
 *    prepare page means they are in an editable state
 */
export const getClaimSummarySchema = ({
  claim,
  project,
  claimDetails,
}: {
  claim: Pick<
    ClaimDto,
    | "status"
    | "isFinalClaim"
    | "impactManagementParticipation"
    | "impactManagementPhasedCompetition"
    | "impactManagementPhasedCompetitionStage"
    | "pcfStatus"
    | "iarStatus"
    | "isIarRequired"
  >;
  project: Pick<ProjectDto, "competitionType">;
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
          const pcfResult = pcfValidation({ claim, project, documents: data, submit: true });
          const iarResult = iarValidation({ claim, project, documents: data, submit: true });

          switch (pcfResult) {
            case ClaimPcfIarSharedValidatorResult.PCF_MISSING:
              ctx.addIssue({
                code: ZodIssueCode.custom,
                params: { i18n: "errors.pcf_required" },
              });
              break;
            case ClaimPcfIarSharedValidatorResult.IM_QUESTIONS_MISSING:
              ctx.addIssue({
                code: ZodIssueCode.custom,
                params: { i18n: "errors.im_required" },
              });
              break;
          }

          switch (iarResult) {
            case ClaimPcfIarSharedValidatorResult.IAR_MISSING:
              ctx.addIssue({
                code: ZodIssueCode.custom,
                params: { i18n: "errors.iar_required" },
              });
              break;
            // case ClaimPcfIarSharedValidatorResult.SCHEDULE_THREE_MISSING:
            //   ctx.addIssue({
            //     code: ZodIssueCode.custom,
            //     message: "You must upload a schedule 3 before you can submit this claim",
            //   });
            //   break;
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
