import {
  allowedClaimDocuments,
  allowedImpactManagementClaimDocuments,
  allowedProjectLevelDocuments,
  DocumentDescription,
  allowedPcrLevelDocuments,
} from "@framework/constants/documentDescription";
import { IAppOptions } from "@framework/types/IAppOptions";
import { z } from "zod";
import { FormTypes } from "./FormTypes";
import {
  projectIdValidation,
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  getMultiFileValidation,
  periodIdValidation,
  pcrItemIdValidation,
  costCategoryIdValidation,
  pcrIdValidation,
} from "./helperValidators.zod";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { makeZodI18nMap } from "@shared/zodi18n";

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
    files: getMultiFileValidation(config),
  });

type UploadBankStatementSchemaType = ReturnType<typeof getBankStatementUpload>;
const getBankStatementUpload = (config: IAppOptions) =>
  z.object({
    form: z.literal(FormTypes.ProjectLevelUpload),
    projectId: projectIdValidation,
    partnerId: z.union([emptyStringToUndefinedValidation, partnerIdValidation]),
    description: z.union([
      emptyStringToUndefinedValidation,
      z.coerce
        .number()
        .refine(x => [DocumentDescription.BankStatement].includes(x))
        .optional()
        .transform(x => x as DocumentDescription),
    ]),
    files: getMultiFileValidation(config),
  });

interface ClaimLevelUploadSchemaExtraProps {
  config: IAppOptions;
  project: Pick<ProjectDto, "impactManagementParticipation">;
}

type ClaimLevelUploadSchemaType = ReturnType<typeof getClaimLevelUpload>;
const documentsErrorMap = makeZodI18nMap({ keyPrefix: ["documents"] });
const getClaimLevelUpload = ({ config, project }: ClaimLevelUploadSchemaExtraProps) =>
  z.object({
    form: z.union([z.literal(FormTypes.ClaimLevelUpload), z.literal(FormTypes.ClaimReviewLevelUpload)]),
    projectId: projectIdValidation,
    partnerId: partnerIdValidation,
    description: z.union([
      emptyStringToUndefinedValidation,
      z.coerce
        .number()
        .refine(x =>
          (project.impactManagementParticipation === ImpactManagementParticipation.Yes
            ? allowedImpactManagementClaimDocuments
            : allowedClaimDocuments
          ).includes(x),
        )
        .optional()
        .transform(x => x as DocumentDescription),
    ]),
    periodId: periodIdValidation,
    files: getMultiFileValidation(config),
  });

type ClaimDetailLevelUploadSchemaType = ReturnType<typeof getClaimDetailLevelUpload>;
const getClaimDetailLevelUpload = ({ config, project }: ClaimLevelUploadSchemaExtraProps) =>
  z.object({
    form: z.literal(FormTypes.ClaimDetailLevelUpload),
    projectId: projectIdValidation,
    partnerId: partnerIdValidation,
    costCategoryId: costCategoryIdValidation,
    description: z.union([
      emptyStringToUndefinedValidation,
      z.coerce
        .number()
        .refine(x =>
          (project.impactManagementParticipation === ImpactManagementParticipation.Yes
            ? allowedImpactManagementClaimDocuments
            : allowedClaimDocuments
          ).includes(x),
        )
        .optional()
        .transform(x => x as DocumentDescription),
    ]),
    periodId: periodIdValidation,
    files: getMultiFileValidation(config),
  });

const getPcrLevelUpload = ({ config }: { config: IAppOptions }) =>
  z.object({
    form: z.literal(FormTypes.PcrLevelUpload),
    projectId: projectIdValidation,
    projectChangeRequestIdOrItemId: pcrItemIdValidation,
    description: z.union([
      emptyStringToUndefinedValidation,
      z.coerce
        .number()
        .refine(x => allowedPcrLevelDocuments.includes(x))
        .optional()
        .transform(x => x as DocumentDescription),
    ]),
    files: getMultiFileValidation(config),
  });

type PcrLevelUploadSchemaType = ReturnType<typeof getPcrLevelUpload>;

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

type ClaimLevelDeleteSchemaType = typeof claimLevelDelete;
const claimLevelDelete = z.object({
  form: z.union([z.literal(FormTypes.ClaimLevelDelete), z.literal(FormTypes.ClaimReviewLevelDelete)]),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  documentId: z.string(),
});

const claimDetailLevelDelete = z.object({
  form: z.literal(FormTypes.ClaimDetailLevelDelete),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  costCategoryId: costCategoryIdValidation,
  documentId: z.string(),
});

const pcrLevelDelete = z.object({
  form: z.literal(FormTypes.PcrLevelDelete),
  projectId: projectIdValidation,
  projectChangeRequestIdOrItemId: z.union([pcrItemIdValidation, pcrIdValidation]),
  documentId: z.string(),
});

const projectOrPartnerLevelDelete = z.discriminatedUnion("form", [partnerLevelDelete, projectLevelDelete]);

export {
  getPcrLevelUpload,
  getProjectLevelUpload,
  projectLevelDelete,
  partnerLevelDelete,
  getClaimLevelUpload,
  getClaimDetailLevelUpload,
  claimDetailLevelDelete,
  claimLevelDelete,
  pcrLevelDelete,
  projectOrPartnerLevelDelete,
  getBankStatementUpload,
  documentsErrorMap,
};
export type {
  ProjectLevelUploadSchemaType,
  ClaimLevelUploadSchemaType,
  UploadBankStatementSchemaType,
  PcrLevelUploadSchemaType,
  ClaimDetailLevelUploadSchemaType,
  ClaimLevelDeleteSchemaType,
};
