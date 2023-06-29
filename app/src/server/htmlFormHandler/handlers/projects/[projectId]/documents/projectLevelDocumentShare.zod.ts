import { DocumentDescription } from "@framework/constants/documentDescription";
import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";
import bytes from "bytes";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { z } from "zod";

const projectIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_Project__c)
  .transform(x => x as ProjectId);

const partnerIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_ProjectParticipant__c)
  .transform(x => x as PartnerId);

const emptyStringToUndefinedValidation = z
  .string()
  .refine(x => x === "")
  .transform(() => undefined);

const periodIdValidation = z
  .number()
  .int()
  .transform(x => x as PeriodId);

const fileValidation = z.preprocess(
  (x: unknown) => {
    // clientfilewrapper
    if (Array.isArray(x) && x.every(x => x instanceof ClientFileWrapper)) return x;
    if ("FileList" in window && x instanceof FileList) return [...x].map(x => new ClientFileWrapper(x));
    return null;
  },
  z
    .array(
      z
        .custom<ClientFileWrapper>()
        .refine(file => file.fileName.length > 0, {
          params: {
            i18n: "errors.file_name_too_small",
          },
        })
        .refine(file => file.fileName.length <= 80, {
          params: {
            i18n: "errors.file_name_too_large",
            count: 80,
          },
        })
        .refine(file => file.size > 0, {
          params: {
            i18n: "errors.file_size_too_small",
          },
        })
        .refine(file => file.size <= bytes("32MB"), {
          params: {
            i18n: "errors.file_size_too_large",
            size: bytes("32MB"),
          },
        }),
    )
    .min(1)
    .max(10),
);

const projectLevelUpload = z.object({
  form: z.literal("projectLevelUpload"),
  projectId: projectIdValidation,
  partnerId: z.union([emptyStringToUndefinedValidation, partnerIdValidation]),
  description: z.union([
    emptyStringToUndefinedValidation,
    z.coerce
      .number()
      .optional()
      .transform(x => x as DocumentDescription | undefined),
  ]),
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

const claimLevelDelete = z.object({
  form: z.literal("claimLevelDelete"),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  documentId: z.string(),
});

const claimDetailLevelDelete = z.object({
  form: z.literal("claimDetailLevelDelete"),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  costCategoryId: z.string(),
  documentId: z.string(),
});

type ProjectLevelDeleteOutputs = z.output<typeof projectLevelDelete>;
type PartnerLevelDeleteOutputs = z.output<typeof partnerLevelDelete>;
type ClaimLevelDeleteOutputs = z.output<typeof claimLevelDelete>;
type ClaimDetailLevelDeleteOutputs = z.output<typeof claimDetailLevelDelete>;
type ProjectLevelUploadOutputs = z.output<typeof projectLevelUpload>;

type FileUploadOutputs = ProjectLevelUploadOutputs;
type FileDeleteOutputs =
  | ProjectLevelDeleteOutputs
  | PartnerLevelDeleteOutputs
  | ClaimLevelDeleteOutputs
  | ClaimDetailLevelDeleteOutputs;
type ValidForms = FileDeleteOutputs["form"] | FileUploadOutputs["form"];

const getDocumentFormValidation = (form: ValidForms) => {
  switch (form) {
    case "claimLevelDelete":
      return claimLevelDelete;
    case "partnerLevelDelete":
      return partnerLevelDelete;
    case "projectLevelDelete":
      return projectLevelDelete;
    case "claimDetailLevelDelete":
      return claimDetailLevelDelete;
    case "projectLevelUpload":
      return projectLevelUpload;
    default:
      throw new Error("Invalid form");
  }
};

export type { FileDeleteOutputs, FileUploadOutputs, ValidForms };
export { getDocumentFormValidation };
