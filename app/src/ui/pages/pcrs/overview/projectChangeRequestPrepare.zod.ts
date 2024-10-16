import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { pcrItemIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

export const pcrPrepareErrorMap = makeZodI18nMap({ keyPrefix: ["pcrPrepare"] });

export const pcrPrepareSchema = z
  .object({
    button_submit: z.string(),
    form: z.literal(FormTypes.PcrPrepare),
    items: z
      .object({
        status: z.string(),
        shortName: z.string(),
        id: pcrItemIdValidation,
      })
      .array(),
    reasoningStatus: z.enum(["Complete", "Incomplete", "To do"]).optional(),
    comments: getTextValidation({
      maxLength: 1000,
      required: false,
    }),
  })
  .superRefine((data, ctx) => {
    if (data.button_submit === "submit") {
      if (data.reasoningStatus !== "Complete") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: "errors.invalid_enum_value" },
          path: ["reasoningStatus"],
        });
      }

      data.items.forEach((item, i) => {
        if (item.status !== "Complete") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: { i18n: "errors.invalid_enum_value", label: item.shortName },
            path: ["items", i, "status"],
          });
        }
      });
    }
  });

export type PcrPrepareSchema = typeof pcrPrepareSchema;
