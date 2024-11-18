import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const setupBankStatementSchema = z.object({
  form: z.literal(FormTypes.ProjectSetupBankStatement),
});

export type BankStatementSchema = typeof setupBankStatementSchema;
