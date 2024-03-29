import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { z, ZodIssueCode } from "zod";
import { IsomorphicFileWrapper } from "@server/apis/isomorphicFileWrapper";
import { validDocumentFilenameCharacters } from "@ui/validation/validators/documentUploadValidator";
import { getFileExtension, getFileName } from "@framework/util/files";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IFileWrapper } from "@framework/types/fileWapper";
import { validCurrencyRegex } from "@framework/util/numberHelper";

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

const currencyValidation = z
  .string()
  .nonempty()
  .superRefine((val, ctx) => {
    const currency = parseFloat(val.replaceAll("£", ""));

    // Check if the string can even be parsed
    if (isNaN(currency)) {
      return ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: "number",
        received: "nan",
      });
    }

    // Make sure our currency isn't so big as to break our server
    if (currency > 999_999_999_999) {
      return ctx.addIssue({
        code: ZodIssueCode.too_big,
        type: "number",
        maximum: 999_999_999_999,
        inclusive: false,
      });
    }

    if (!validCurrencyRegex.test(val)) {
      return ctx.addIssue({
        code: ZodIssueCode.invalid_string,
        validation: "regex",
      });
    }
  });

const zeroOrGreaterCurrencyValidation = currencyValidation.superRefine((val, ctx) => {
  const currency = parseFloat(val.replaceAll("£", ""));

  if (currency < 0) {
    return ctx.addIssue({
      code: ZodIssueCode.too_small,
      type: "number",
      minimum: 0,
      inclusive: true,
    });
  }
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
    .preprocess((x: unknown) => {
      // Map to ClientFileWrapper/ServerFileWrapper
      if (Array.isArray(x) && x.every(x => x instanceof IsomorphicFileWrapper)) return x;
      if ("FileList" in globalThis && x instanceof FileList) return [...x].map(x => new ClientFileWrapper(x));
      return null;
    }, z.array(getSingleFileValidation(options)).min(1).max(options.maxUploadFileCount))
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

const integerInput = z.union([
  z.number().int(),
  z.string().transform((x, ctx) => {
    if (x === "") return null;
    const x1 = Number(x);
    if (isNaN(x1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "number",
        received: "string",
      });
    }
    if (!Number.isInteger(x1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
      });
    }

    return x1;
  }),
]);

const positiveIntegerInput = ({ lt }: { lt?: number }) =>
  z.union([
    z.number().int().min(0),
    z.string().transform((x, ctx) => {
      if (x === "") return null;
      const x1 = Number(x);

      if (isNaN(x1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: "string",
        });
      } else if (x1 < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.too_small, minimum: 0, inclusive: true, type: "number" });
      } else if (!Number.isInteger(x1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
        });
      } else if (typeof lt === "number" && x1 >= lt) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          inclusive: false,
          maximum: lt,
          type: "number",
        });
      }

      return x1;
    }),
  ]);

const numberInput = z.union([z.number(), z.string().transform(x => (x === "" ? null : Number(x)))]);

const positiveNumberInput = z.union([
  z.number().min(0),
  z.string().transform((x, ctx) => {
    if (x === "") return null;
    const x1 = Number(x);

    if (isNaN(x1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "number",
        received: "string",
      });
    }
    if (x1 < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 0,
        inclusive: true,
        type: "number",
      });
    }

    return x1;
  }),
]);

const percentageNumberInput = ({ max = 0, min = 100 }: { max: number; min: number } = { max: 100, min: 0 }) =>
  z.union([
    z.number().min(min).max(max),
    z.string().transform((x, ctx) => {
      if (x === "") return null;

      const x1 = Number(x.replace(/%$/, ""));
      if (Number.isNaN(x1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: min,
          inclusive: true,
          type: "number",
        });
      } else if (x1 < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: min,
          inclusive: true,
          type: "number",
        });
      } else if (x1 > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: max,
          inclusive: true,
          type: "number",
        });
      }

      return x1;
    }),
  ]);

export {
  projectIdValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  financialVirementForCostsIdValidation,
  partnerIdValidation,
  profileIdValidation,
  periodIdValidation,
  booleanValidation,
  currencyValidation,
  zeroOrGreaterCurrencyValidation,
  claimIdValidation,
  costCategoryIdValidation,
  integerInput,
  numberInput,
  percentageNumberInput,
  positiveNumberInput,
  positiveIntegerInput,
  emptyStringToUndefinedValidation,
  emptyStringToNullValidation,
  getSingleFileValidation,
  getMultiFileValidation,
};
