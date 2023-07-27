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

type ProjectLevelDeleteOutputs = z.output<typeof projectLevelDelete>;
type PartnerLevelDeleteOutputs = z.output<typeof partnerLevelDelete>;
type ClaimLevelDeleteOutputs = z.output<typeof claimLevelDelete>;
type FileDeleteOutputs = ProjectLevelDeleteOutputs | PartnerLevelDeleteOutputs | ClaimLevelDeleteOutputs;

type ClaimLevelUploadOutputs = z.output<typeof claimLevelUpload>;
type ProjectLevelUploadOutputs = z.output<typeof projectLevelUpload>;
type FileUploadOutputs = ClaimLevelUploadOutputs | ProjectLevelUploadOutputs;

export type {
  FileDeleteOutputs,
  FileUploadOutputs,
  ProjectLevelDeleteOutputs,
  PartnerLevelDeleteOutputs,
  ClaimLevelDeleteOutputs,
  ClaimLevelUploadOutputs,
  ProjectLevelUploadOutputs,
};
export { projectLevelUpload, projectLevelDelete, partnerLevelDelete, claimLevelUpload, claimLevelDelete };
