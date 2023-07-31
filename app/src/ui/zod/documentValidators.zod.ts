import {
  allowedClaimDocuments,
  allowedProjectLevelDocuments,
  DocumentDescription,
} from "@framework/constants/documentDescription";
import { z } from "zod";
import { FormTypes } from "./FormTypes";
import {
  projectIdValidation,
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  fileValidation,
  periodIdValidation,
} from "./helperValidators.zod";

const projectLevelUpload = z.object({
  form: z.literal(FormTypes.ProjectLevelUpload),
  projectId: projectIdValidation,
  partnerId: z.union([emptyStringToUndefinedValidation, partnerIdValidation]),
  description: z.union([
    emptyStringToUndefinedValidation,
    z.coerce
      .number()
      .refine(x => allowedProjectLevelDocuments.includes(x))
      .optional()
      .transform(x => x as DocumentDescription),
  ]),
  files: fileValidation,
});

const claimLevelUpload = z.object({
  form: z.literal(FormTypes.ClaimLevelUpload),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  description: z.union([
    emptyStringToUndefinedValidation,
    z.coerce
      .number()
      .refine(x => allowedClaimDocuments.includes(x))
      .optional()
      .transform(x => x as DocumentDescription),
  ]),
  periodId: periodIdValidation,
  files: fileValidation,
});

const projectLevelDelete = z.object({
  form: z.literal(FormTypes.ProjectLevelDelete),
  projectId: projectIdValidation,
  documentId: z.string(),
});

const partnerLevelDelete = z.object({
  form: z.literal(FormTypes.PartnerLevelDelete),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  documentId: z.string(),
});

const claimLevelDelete = z.object({
  form: z.literal(FormTypes.ClaimLevelDelete),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  documentId: z.string(),
});

const projectOrPartnerLevelDelete = z.discriminatedUnion("form", [partnerLevelDelete, projectLevelDelete]);

export {
  projectLevelUpload,
  projectLevelDelete,
  partnerLevelDelete,
  claimLevelUpload,
  claimLevelDelete,
  projectOrPartnerLevelDelete,
};
