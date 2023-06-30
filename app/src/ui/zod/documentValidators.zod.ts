import {
  allowedClaimDocuments,
  allowedProjectLevelDocuments,
  DocumentDescription,
} from "@framework/constants/documentDescription";
import { z } from "zod";
import {
  projectIdValidation,
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  fileValidation,
  periodIdValidation,
} from "./helperValidators.zod";

const projectLevelUpload = z.object({
  form: z.literal("projectLevelUpload"),
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
  form: z.literal("claimLevelUpload"),
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
  form: z.literal("projectLevelDelete"),
  projectId: projectIdValidation,
  documentId: z.string(),
});

const partnerLevelDelete = z.object({
  form: z.literal("partnerLevelDelete"),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  documentId: z.string(),
});

type ProjectLevelDeleteOutputs = z.output<typeof projectLevelDelete>;
type PartnerLevelDeleteOutputs = z.output<typeof partnerLevelDelete>;
type FileDeleteOutputs = ProjectLevelDeleteOutputs | PartnerLevelDeleteOutputs;

type ClaimLevelUploadOutputs = z.output<typeof claimLevelUpload>;
type ProjectLevelUploadOutputs = z.output<typeof projectLevelUpload>;

export type { FileDeleteOutputs, ProjectLevelUploadOutputs, ClaimLevelUploadOutputs };
export { projectLevelUpload, projectLevelDelete, partnerLevelDelete };
