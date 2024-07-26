import { FormTypes } from "@ui/zod/FormTypes";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getFinanceContactSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrAddPartnerFinanceContactStep),
    markedAsComplete: z.string(),
    button_submit: z.string(),
    contact1Forename: getTextareaValidation({ required: markedAsComplete, maxLength: 50 }),
    contact1Surname: getTextareaValidation({ required: markedAsComplete, maxLength: 50 }),
    contact1Phone: getTextareaValidation({ required: markedAsComplete, maxLength: 20 }),
    contact1Email: getTextareaValidation({ required: markedAsComplete, maxLength: 255 }),
  });

export type FinanceContactSchemaType = ReturnType<typeof getFinanceContactSchema>;
export type FinanceContactSchema = z.infer<FinanceContactSchemaType>;
