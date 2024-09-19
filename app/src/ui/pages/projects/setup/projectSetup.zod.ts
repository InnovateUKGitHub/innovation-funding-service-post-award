import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankDetailsTaskStatus, SpendProfileStatus } from "@framework/constants/partner";
import { FormTypes } from "@ui/zod/FormTypes";

export const projectSetupErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetup"] });

export const projectSetupSchema = z.object({
  form: z.literal(FormTypes.ProjectSetup),
  postcode: z.string().min(1),
  bankDetailsTaskStatus: z
    .nativeEnum(BankDetailsTaskStatus)
    .refine(bankTaskStatus => bankTaskStatus === BankDetailsTaskStatus.Complete),
  spendProfileStatus: z
    .nativeEnum(SpendProfileStatus)
    .refine(spendProfileStatus => spendProfileStatus === SpendProfileStatus.Complete),
});

export type ProjectSetupSchema = typeof projectSetupSchema;
