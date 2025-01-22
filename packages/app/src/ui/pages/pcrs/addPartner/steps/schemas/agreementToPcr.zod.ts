import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const agreementToPcrSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerAgreementFilesStep),
  markedAsComplete: z.boolean().optional(),
  button_submit: z.string().optional(),
});

export type AgreementToPcrSchema = typeof agreementToPcrSchema;
