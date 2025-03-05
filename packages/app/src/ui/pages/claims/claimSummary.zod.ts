import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  ClaimPcfIarSharedValidatorResult,
  iarValidation,
  pcfValidation,
} from "@ui/validation/validators/shared/claimPcfIarSharedValidator";
import { FormTypes } from "@ui/zod/FormTypes";
import { claimIdValidation, evaluateObject } from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { ZodIssueCode, z } from "zod";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimSummary"] });

/**
 * Run both PCF and IAR (KTP: Schedule 3) validation
 *
 * YOU MUST update the Confluence document before editing the code.
 * @see {@link https://ukri.atlassian.net/wiki/spaces/ACC/pages/467107882/PCF+IAR+Validation}
 *
 * Differences here:
 * 1. Draft/Queried validation is not ran here since it is assumed being on the
 *    prepare page means they are in an editable state
 */

const isSubmit = (data: { button_submit: string }) => data.button_submit === "submit";

export const claimSummarySchema = evaluateObject(
  (data: {
    button_submit: string;
    remainingOfferCosts: number;
    project: Pick<ProjectDto, "competitionType" | "monitoringLevel">;
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
  }) => {
    return {
      button_submit: z.union([z.literal("submit"), z.literal("saveAndReturnToClaims")]),
      form: z.literal(FormTypes.ClaimSummary),
      id: claimIdValidation,
      status: z
        .string()
        .superRefine((_, ctx) => {
          if (isSubmit(data) && data.remainingOfferCosts < 0) {
            ctx.addIssue({
              code: ZodIssueCode.too_small,
              path: ["totalCosts"],
              type: "number",
              inclusive: true,
              minimum: 0,
            });
          }
        })
        .transform(x => x as ClaimStatus),
      comments: getTextValidation({
        maxLength: 1000,
        required: false,
      }),
      remainingOfferCosts: z.number().optional(),
      project: z.object({
        competitionType: z.string(),
        monitoringLevel: z.string().transform(x => x as ProjectMonitoringLevel),
      }),
      claim: z.object({
        status: z.string(),
        isFinalClaim: z.boolean(),
        impactManagementParticipation: z.string(),
        impactManagementPhasedCompetition: z.boolean(),
        impactManagementPhasedCompetitionStage: z.string(),
        pcfStatus: z.string(),
        iarStatus: z.string(),
        isIarRequired: z.boolean(),
      }),
      documents: z
        .object({ description: z.nullable(z.number()).optional() })
        .array()
        .superRefine((refinedData, ctx) => {
          if (isSubmit(data)) {
            const pcfResult = pcfValidation({
              claim: data.claim,
              project: data.project,
              documents: refinedData,
              submit: true,
            });
            const iarResult = iarValidation({
              claim: data.claim,
              project: data.project,
              documents: refinedData,
              submit: true,
            });

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
              case ClaimPcfIarSharedValidatorResult.SCHEDULE_THREE_MISSING:
                ctx.addIssue({
                  code: ZodIssueCode.custom,
                  params: { i18n: "errors.schedule3_required" },
                });
                break;
            }
          }
        }),
    };
  },
);

export type ClaimSummarySchemaType = typeof claimSummarySchema;

export type ClaimSummarySchema = z.output<ClaimSummarySchemaType>;
