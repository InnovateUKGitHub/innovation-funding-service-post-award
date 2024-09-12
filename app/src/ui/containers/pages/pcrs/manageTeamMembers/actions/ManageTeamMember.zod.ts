import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  contactIdValidation,
  dateValidation,
  partnerIdValidation,
  pclIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";
import { ManageTeamMemberRole } from "../ManageTeamMember.logic";

const createTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersCreate),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  firstName: getTextValidation({ maxLength: 100, required: true }),
  lastName: getTextValidation({ maxLength: 100, required: true }),
  email: getTextValidation({ base: z.string().email(), maxLength: 100, required: true }),
  startDate: dateValidation,
  role: z.literal(ManageTeamMemberRole.ASSOCIATE),
});

const replaceTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersReplace),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  pclId: pclIdValidation,
  firstName: getTextValidation({ maxLength: 100, required: true }),
  lastName: getTextValidation({ maxLength: 100, required: true }),
  email: getTextValidation({ base: z.string().email(), maxLength: 100, required: true }),
  role: z.nativeEnum(ManageTeamMemberRole),
});

const updateTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersUpdate),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  pclId: pclIdValidation,
  contactId: contactIdValidation,
  firstName: getTextValidation({ maxLength: 100, required: true }),
  lastName: getTextValidation({ maxLength: 100, required: true }),
  role: z.nativeEnum(ManageTeamMemberRole),
});

const deleteTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersDelete),
  projectId: projectIdValidation,
  pclId: pclIdValidation,
  role: z.nativeEnum(ManageTeamMemberRole),
});

const manageTeamMemberValidator = z.discriminatedUnion("form", [
  createTeamMemberValidator,
  replaceTeamMemberValidator,
  updateTeamMemberValidator,
  deleteTeamMemberValidator,
]);

type ManageTeamMemberValidatorSchema = typeof manageTeamMemberValidator;

const manageTeamMemberErrorMap = makeZodI18nMap({ keyPrefix: ["project", "manageTeamMembers"] });

export {
  ManageTeamMemberValidatorSchema,
  manageTeamMemberErrorMap,
  manageTeamMemberValidator,
  createTeamMemberValidator,
  replaceTeamMemberValidator,
  updateTeamMemberValidator,
  deleteTeamMemberValidator,
};
