import { ZodIssueCode, z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { SalesforceCompetitionTypes } from "@framework/constants/competitionTypes";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimSummary"] });

export const getClaimSummarySchema = ({
  iarRequired,
  pcfRequired,
  competitionType,
}: {
  iarRequired: boolean;
  pcfRequired: boolean;
  competitionType: string;
}) =>
  z.discriminatedUnion("button_submit", [
    z.object({
      button_submit: z.literal("submit"),
      status: z.string(),
      comments: z.string().max(1000),
      documents: z
        .object({ description: z.nullable(z.number()).optional() })
        .array()
        .superRefine((data, ctx) => {
          const hasDocument = (docType: DocumentDescription) => data.some(x => x.description === docType);

          if (iarRequired) {
            if (competitionType === SalesforceCompetitionTypes.ktp) {
              if (!hasDocument(DocumentDescription.ScheduleThree)) {
                ctx.addIssue({ code: ZodIssueCode.custom, params: { i18n: "errors.schedule_three_required" } });
              }
            } else {
              if (!hasDocument(DocumentDescription.IAR)) {
                ctx.addIssue({ code: ZodIssueCode.custom, params: { i18n: "errors.iar_required" } });
              }
            }
          }

          if (pcfRequired) {
            if (!hasDocument(DocumentDescription.ProjectCompletionForm)) {
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
