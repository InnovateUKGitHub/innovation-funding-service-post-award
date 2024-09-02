import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  contactIdValidation,
  partnerIdValidation,
  pclIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

const createTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersCreate),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  firstName: getTextValidation({ maxLength: 100, required: true }),
  lastName: getTextValidation({ maxLength: 100, required: true }),
  email: getTextValidation({ base: z.string().email(), maxLength: 100, required: true }),
});

const replaceTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersReplace),
  projectId: projectIdValidation,
  pclId: pclIdValidation,
  firstName: getTextValidation({ maxLength: 100, required: true }),
  lastName: getTextValidation({ maxLength: 100, required: true }),
  email: getTextValidation({ base: z.string().email(), maxLength: 100, required: true }),
});

const updateTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersUpdate),
  projectId: projectIdValidation,
  pclId: pclIdValidation,
  contactId: contactIdValidation,
  firstName: getTextValidation({ maxLength: 100, required: true }),
  lastName: getTextValidation({ maxLength: 100, required: true }),
});

const deleteTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersDelete),
  projectId: projectIdValidation,
  pclId: pclIdValidation,
});

const manageTeamMemberValidator = z.discriminatedUnion("form", [
  createTeamMemberValidator,
  replaceTeamMemberValidator,
  updateTeamMemberValidator,
  deleteTeamMemberValidator,
]);

type ManageTeamMemberValidatorSchema = typeof manageTeamMemberValidator;

const manageTeamMemberErrorMap = makeZodI18nMap({ keyPrefix: ["project", "manageTeamMembers"] });

export { ManageTeamMemberValidatorSchema, manageTeamMemberErrorMap, manageTeamMemberValidator };
