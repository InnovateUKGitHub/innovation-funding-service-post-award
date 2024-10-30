import { makeZodI18nMap } from "@shared/zodi18n";
import {
  claimDetailsCommentsMaxLength,
  claimLineItemDescriptionMaxLength,
} from "@ui/validation/validators/claimDetailsValidator";
import { FormTypes } from "@ui/zod/FormTypes";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import {
  claimIdValidation,
  costCategoryIdValidation,
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  periodIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { ZodIssueCode, z } from "zod";

export const editClaimLineItemErrorMap = makeZodI18nMap({ keyPrefix: ["claimLineItems"] });

const editClaimLineItemLineItemSchema = z
  .object({
    id: z.union([claimIdValidation, emptyStringToUndefinedValidation]),
    value: getGenericCurrencyValidation({
      min: -1_000_000,
      required: true,
    }),
    description: getTextValidation({
      maxLength: claimLineItemDescriptionMaxLength,
      required: true,
    }),
  })
  .superRefine(({ description, value }, ctx) => {
    if (typeof description === "undefined" && typeof value !== "undefined") {
      ctx.addIssue({
        code: ZodIssueCode.too_small,
        path: ["description"],
        minimum: 0,
        inclusive: false,
        type: "string",
      });
    }
    if (typeof description !== "undefined" && typeof value === "undefined") {
      ctx.addIssue({
        code: ZodIssueCode.too_small,
        path: ["value"],
        minimum: 0,
        inclusive: false,
        type: "string",
      });
    }
  });

const editClaimLineItemsSchema = z.object({
  form: z.union([z.literal(FormTypes.ClaimLineItemSaveAndQuit), z.literal(FormTypes.ClaimLineItemSaveAndDocuments)]),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  costCategoryId: costCategoryIdValidation,
  lineItems: editClaimLineItemLineItemSchema.array(),
  comments: getTextValidation({
    maxLength: claimDetailsCommentsMaxLength,
    required: false,
  }),
});

type EditClaimLineItemsSchemaType = typeof editClaimLineItemsSchema;
type EditClaimLineItemLineItemSchemaType = typeof editClaimLineItemLineItemSchema;

export { editClaimLineItemsSchema, EditClaimLineItemsSchemaType, EditClaimLineItemLineItemSchemaType };
