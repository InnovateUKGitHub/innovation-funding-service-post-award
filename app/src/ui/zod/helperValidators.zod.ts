import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { z } from "zod";
import { IsomorphicFileWrapper } from "@server/apis/isomorphicFileWrapper";
import { validDocumentFilenameCharacters } from "@ui/validation/validators/documentUploadValidator";
import { getFileExtension } from "@framework/util/files";
import { IAppOptions } from "@framework/types/IAppOptions";

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
  .transform(() => undefined)
  .optional();

const periodIdValidation = z.coerce
  .number()
  .int()
  .gt(0)
  .lt(100) // Assumption that a project has fewer than 100 periods.
  .transform(x => x as PeriodId);

const getFileValidation = (options: IAppOptions) =>
  z.preprocess(
    (x: unknown) => {
      // Map to ClientFileWrapper/ServerFileWrapper
      if (Array.isArray(x) && x.every(x => x instanceof IsomorphicFileWrapper)) return x;
      if ("FileList" in globalThis && x instanceof FileList) return [...x].map(x => new ClientFileWrapper(x));
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
          .refine(file => validDocumentFilenameCharacters.test(file.fileName), {
            params: {
              i18n: "errors.file_name_invalid_characters",
            },
          })
          .refine(
            file => {
              const { imageTypes, pdfTypes, presentationTypes, spreadsheetTypes, textTypes } = options.permittedTypes;

              const permittedFileTypes = [
                ...pdfTypes,
                ...textTypes,
                ...presentationTypes,
                ...spreadsheetTypes,
                ...imageTypes,
              ];

              const extension = getFileExtension(file.fileName);

              return permittedFileTypes.includes(extension);
            },
            {
              params: {
                i18n: "errors.file_name_invalid_type",
              },
            },
          )
          .refine(file => file.size > 0, {
            params: {
              i18n: "errors.file_size_too_small",
            },
          })
          .refine(file => file.size <= options.maxFileSize, {
            params: {
              i18n: "errors.file_size_too_large",
              size: options.maxFileSize,
            },
          }),
      )
      .min(1)
      .max(options.maxUploadFileCount),
  );

export {
  projectIdValidation,
  partnerIdValidation,
  periodIdValidation,
  emptyStringToUndefinedValidation,
  getFileValidation,
};
