import { makeZodI18nMap } from "@shared/zodi18n";
import {
  claimDetailsCommentsMaxLength,
  claimLineItemDescriptionMaxLength,
} from "@ui/validation/validators/claimDetailsValidator";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  claimIdValidation,
  costCategoryIdValidation,
  currencyValidation,
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  periodIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";

export const editClaimLineItemErrorMap = makeZodI18nMap({ keyPrefix: ["claimLineItems"] });

const editClaimLineItemLineItemSchema = z
  .object({
    id: z.union([claimIdValidation, emptyStringToUndefinedValidation]),
    value: z.union([currencyValidation, emptyStringToUndefinedValidation]),
    description: z.union([z.string().min(1).max(claimLineItemDescriptionMaxLength), emptyStringToUndefinedValidation]),
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
  comments: z.string().max(claimDetailsCommentsMaxLength),
});

type EditClaimLineItemsSchemaType = typeof editClaimLineItemsSchema;
type EditClaimLineItemLineItemSchemaType = typeof editClaimLineItemLineItemSchema;

export { editClaimLineItemsSchema, EditClaimLineItemsSchemaType, EditClaimLineItemLineItemSchemaType };
