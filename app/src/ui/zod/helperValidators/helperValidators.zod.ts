import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { z, ZodIssueCode, ZodRawShape } from "zod";
import { IsomorphicFileWrapper } from "@server/apis/isomorphicFileWrapper";
import { validDocumentFilenameCharacters } from "@ui/validation/validators/documentUploadValidator";
import { getFileExtension, getFileName } from "@framework/util/files";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { DateTime } from "luxon";

const y2k = new Date("2000-01-01");

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

const financialVirementForCostsIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_Virements__c)
  .transform(x => x as FinancialVirementForCostsId);

const partnerIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_ProjectParticipant__c)
  .transform(x => x as PartnerId);

const costCategoryIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_CostCategory__c)
  .transform(x => x as CostCategoryId);

const pclIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_ProjectContactLink__c)
  .transform(x => x as ContactId);

const costIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_IFSSpendProfile__c)
  .transform(x => x as CostId);

const loanIdValidation = z
  .string()
  .startsWith(SalesforcePrefixes.Acc_Prepayment__c)
  .transform(x => x as LoanId);

const profileIdValidation = z.string().startsWith(SalesforcePrefixes.Acc_Profile__c);

const claimIdValidation = z.string().startsWith(SalesforcePrefixes.Acc_Claims__c);

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

const booleanValidation = z
  .union([z.literal(true), z.literal(false), z.literal("true"), z.literal("false")])
  .transform<boolean>(value => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  });

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
  z
    .preprocess(
      (x: unknown) => {
        // Map to ClientFileWrapper/ServerFileWrapper
        if (Array.isArray(x) && x.every(x => x instanceof IsomorphicFileWrapper)) return x;
        if ("FileList" in globalThis && x instanceof FileList) return [...x].map(x => new ClientFileWrapper(x));
        return null;
      },
      z.array(getSingleFileValidation(options)).min(1).max(options.maxUploadFileCount),
    )
    .superRefine((files, ctx) => {
      let anyFileTooBig = false;
      let total = 0;

      for (const file of files) {
        total += file.size;
        if (file.size > options.maxTotalFileSize) {
          anyFileTooBig = true;
          break;
        }
      }

      if (!anyFileTooBig && total > options.maxTotalFileSize) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          params: {
            i18n: "errors.total_size_too_large",
            size: options.maxTotalFileSize,
          },
        });
      }
    });

const dateValidation = z
  .union([
    z.date(),
    z
      .object({
        day: z
          .string()
          .max(2)
          .regex(/^\d\d?$/),
        month: z
          .string()
          .max(2)
          .regex(/^\d\d?$/),
        year: z
          .string()
          .min(4)
          .max(4)
          .regex(/^\d\d\d\d$/),
      })
      .superRefine((x, ctx) => {
        const year = Number(x.year);
        const month = Number(x.month);
        const day = Number(x.day);
        const datetime = DateTime.utc(year, month, day);
        if (!datetime.isValid) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_date,
          });
        }
      })
      .transform(x => DateTime.utc(Number(x.year), Number(x.month), Number(x.day)).toJSDate()),
  ])
  .superRefine((x, ctx) => {
    if (x < y2k) {
      ctx.addIssue({
        code: ZodIssueCode.too_small,
        minimum: y2k.getTime(),
        inclusive: false,
        type: "date",
      });
    }
  });

/**
 * ## evaluateObject
 *
 * This function can be used for dynamically created objects in which some fields
 * are dependent on the outcome of other fields
 *
 * most notably `markedAsComplete`
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const evaluateObject = <T extends (validationData: any) => ZodRawShape>(validator: T) => {
  return z.any().transform((data, ctx) => {
    const objectSchema = z.object(validator(data));

    const results = objectSchema.safeParse(data);

    if (!results.success) {
      results.error.issues
        .map(x => ({ ...x, message: undefined })) // the applied default message is messing up the error mapping
        .forEach(problem => {
          ctx.addIssue(problem);
        });
      return z.NEVER;
    }
    return results.data;
  }) as unknown as z.ZodObject<ReturnType<T>>;
};

export {
  projectIdValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  financialVirementForCostsIdValidation,
  partnerIdValidation,
  profileIdValidation,
  periodIdValidation,
  pclIdValidation,
  booleanValidation,
  loanIdValidation,
  costIdValidation,
  claimIdValidation,
  costCategoryIdValidation,
  emptyStringToUndefinedValidation,
  emptyStringToNullValidation,
  getSingleFileValidation,
  getMultiFileValidation,
  dateValidation,
  evaluateObject,
};
