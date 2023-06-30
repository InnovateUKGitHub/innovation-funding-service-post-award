import { SalesforcePrefixes } from "@framework/constants/salesforceConstants";
import bytes from "bytes";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { z } from "zod";
import { IsomorphicFileWrapper } from "@server/apis/isomorphicFileWrapper";

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

const periodIdValidation = z.number().int().gt(0).lt(100);

const fileValidation = z.preprocess(
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

export {
  projectIdValidation,
  partnerIdValidation,
  periodIdValidation,
  emptyStringToUndefinedValidation,
  fileValidation,
};
