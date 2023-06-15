import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankDetailsTaskStatus, SpendProfileStatus } from "@framework/types";

export const errorMap = makeZodI18nMap({ keyPrefix: ["projectSetup"] });

z.setErrorMap(errorMap);
export const projectSetupSchema = z.object({
  postcode: z.string().min(1),
  bankDetailsTaskStatus: z.enum([String(BankDetailsTaskStatus.Complete)]),
  spendProfileStatus: z.enum([String(SpendProfileStatus.Complete)]),
});
