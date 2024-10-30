import { FormTypes } from "@ui/zod/FormTypes";
import { multipleContactDtoSchema } from "@ui/zod/contactSchema.zod";
import { projectIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { z } from "zod";

const contactSetupAssociateSchema = multipleContactDtoSchema.extend({
  form: z.literal(FormTypes.ProjectSetupContactAssociate),
  projectId: projectIdValidation,
});

type ContactSetupAssociateSchemaType = typeof contactSetupAssociateSchema;

export { contactSetupAssociateSchema, ContactSetupAssociateSchemaType };
