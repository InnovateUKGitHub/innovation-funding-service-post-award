import { z } from "zod";

export const otherFundingSchema = z.object({
  button_submit: z.string(),
  hasOtherFunding: z.string(),
});

export type OtherFundingSchema = z.infer<typeof otherFundingSchema>;
