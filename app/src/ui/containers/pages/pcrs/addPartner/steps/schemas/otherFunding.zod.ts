import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const otherFundingSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerOtherFundingStep),
  button_submit: z.string(),
  hasOtherFunding: z.string(),
});

export type OtherFundingSchemaType = typeof otherFundingSchema;
export type OtherFundingSchema = z.infer<typeof otherFundingSchema>;
