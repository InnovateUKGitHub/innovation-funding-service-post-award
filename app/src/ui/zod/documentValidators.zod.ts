import {
  allowedClaimDocuments,
  allowedProjectLevelDocuments,
  DocumentDescription,
} from "@framework/constants/documentDescription";
import { IAppOptions } from "@framework/types/IAppOptions";
import { z } from "zod";
import { FormTypes } from "./FormTypes";
import {
  projectIdValidation,
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  getFileValidation,
  periodIdValidation,
} from "./helperValidators.zod";

type ProjectLevelUploadSchemaType = ReturnType<typeof getProjectLevelUpload>;
const getProjectLevelUpload = (config: IAppOptions) =>
  z.object({
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
    files: getFileValidation(config),
  });

type ClaimLevelUploadSchemaType = ReturnType<typeof getClaimLevelUpload>;
const getClaimLevelUpload = (config: IAppOptions) =>
  z.object({
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
    files: getFileValidation(config),
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
  getProjectLevelUpload,
  projectLevelDelete,
  partnerLevelDelete,
  getClaimLevelUpload,
  claimLevelDelete,
  projectOrPartnerLevelDelete,
};
export type { ProjectLevelUploadSchemaType, ClaimLevelUploadSchemaType };
