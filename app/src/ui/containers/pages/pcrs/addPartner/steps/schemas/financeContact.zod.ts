import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getFinanceContactSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrAddPartnerFinanceContactStep),
    markedAsComplete: z.string(),
    button_submit: z.string(),
    contact1Forename: getTextValidation({ required: markedAsComplete, maxLength: 50 }),
    contact1Surname: getTextValidation({ required: markedAsComplete, maxLength: 50 }),
    contact1Phone: getTextValidation({ required: markedAsComplete, maxLength: 20 }),
    contact1Email: getTextValidation({ required: markedAsComplete, maxLength: 255 }),
  });

export type FinanceContactSchemaType = ReturnType<typeof getFinanceContactSchema>;
export type FinanceContactSchema = z.infer<FinanceContactSchemaType>;
