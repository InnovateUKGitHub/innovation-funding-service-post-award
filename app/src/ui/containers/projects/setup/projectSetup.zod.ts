import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankDetailsTaskStatus, SpendProfileStatus } from "@framework/types";

export const errorMap = makeZodI18nMap({ keyPrefix: ["projectSetup"] });

z.setErrorMap(errorMap);
export const projectSetupSchema = z.object({
  postcode: z.string().min(1),
  spendProfileStatus: z.enum([String(BankDetailsTaskStatus.Complete)]),
  bankDetailsTaskStatus: z.enum([String(SpendProfileStatus.Complete)]),
});
