import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const projectSetupBankStatementErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankStatement"] });

export const setupBankStatementSchema = z.object({
  form: z.literal(FormTypes.ProjectSetupBankStatement),
  // refine statement will reject as invalid if falsy and valid if truthy. Since value is a boolean, this will reject if false
  hasUploadedBankStatement: z.boolean().refine(hasUploaded => hasUploaded),
});

export type BankStatementSchema = typeof setupBankStatementSchema;
