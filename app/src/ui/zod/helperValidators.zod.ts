import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { z, ZodIssueCode } from "zod";
import { IsomorphicFileWrapper } from "@server/apis/isomorphicFileWrapper";
import { validDocumentFilenameCharacters } from "@ui/validation/validators/documentUploadValidator";
import { getFileExtension, getFileName } from "@framework/util/files";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IFileWrapper } from "@framework/types/fileWapper";

const projectIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_Project__c)
  .transform(x => x as ProjectId);

const pcrIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_ProjectChangeRequest__c)
  .transform(x => x as PcrId);

const pcrItemIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_ProjectChangeRequest__c)
  .transform(x => x as PcrItemId);

const partnerIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_ProjectParticipant__c)
  .transform(x => x as PartnerId);

const emptyStringToUndefinedValidation = z
  .string()
  .refine(x => x === "")
  .transform(() => undefined)
  .optional();

const emptyStringToNullValidation = z
  .string()
  .refine(x => x === "")
  .transform(() => null)
  .nullable();

const periodIdValidation = z.coerce
  .number()
  .int()
  .gt(0)
  .lt(500) // Assumption that a project has fewer than 500 periods.
  .transform(x => x as PeriodId);

const getSingleFileValidation = (options: IAppOptions) => {
  const { imageTypes, pdfTypes, presentationTypes, spreadsheetTypes, textTypes } = options.permittedTypes;
  const permittedFileTypes = [...pdfTypes, ...textTypes, ...presentationTypes, ...spreadsheetTypes, ...imageTypes];

  return z.custom<IFileWrapper>().superRefine((file, ctx) => {
    const basename = getFileName(file.fileName);
    const extension = getFileExtension(file.fileName);

    if (basename.length === 0 || extension.length === 0) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.file_basename_too_small",
        },
      });
    }

    if (!(file.fileName.length <= options.maxFileBasenameLength)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.file_basename_too_big",
          count: options.maxFileBasenameLength,
        },
      });
    }

    if (!validDocumentFilenameCharacters.test(file.fileName)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.file_name_invalid_characters",
        },
      });
    }

    if (!permittedFileTypes.includes(extension)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.file_extension_invalid_type",
        },
      });
    }

    if (!(file.size > 0)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.file_size_too_small",
        },
      });
    }

    if (!(file.size <= options.maxFileSize)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        params: {
          i18n: "errors.file_size_too_large",
          size: options.maxFileSize,
        },
      });
    }
  });
};

const getMultiFileValidation = (options: IAppOptions) =>
  z.preprocess((x: unknown) => {
    // Map to ClientFileWrapper/ServerFileWrapper
    if (Array.isArray(x) && x.every(x => x instanceof IsomorphicFileWrapper)) return x;
    if ("FileList" in globalThis && x instanceof FileList) return [...x].map(x => new ClientFileWrapper(x));
    return null;
  }, z.array(getSingleFileValidation(options)).min(1).max(options.maxUploadFileCount));

export {
  projectIdValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  partnerIdValidation,
  periodIdValidation,
  emptyStringToUndefinedValidation,
  emptyStringToNullValidation,
  getSingleFileValidation,
  getMultiFileValidation,
};
