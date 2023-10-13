import {
  allowedClaimDocuments,
  allowedImpactManagementClaimDocuments,
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
  getMultiFileValidation,
  periodIdValidation,
} from "./helperValidators.zod";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";

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

interface ClaimLevelUploadSchemaExtraProps {
  config: IAppOptions;
  project: Pick<ProjectDto, "impactManagementParticipation">;
}

type ClaimLevelUploadSchemaType = ReturnType<typeof getClaimLevelUpload>;
const getClaimLevelUpload = ({ config, project }: ClaimLevelUploadSchemaExtraProps) =>
  z.object({
    form: z.literal(FormTypes.ClaimLevelUpload),
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
