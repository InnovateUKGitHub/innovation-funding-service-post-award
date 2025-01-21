import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const jesStepSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerJesFormStep),
  markedAsComplete: z.boolean().optional(),
  button_submit: z.string().optional(),
});

export type JesStepSchema = typeof jesStepSchema;
