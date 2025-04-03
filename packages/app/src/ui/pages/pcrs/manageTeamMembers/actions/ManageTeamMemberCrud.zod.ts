import { ProjectRole } from "@framework/dtos/projectContactDto";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  contactIdValidation,
  getDateValidation,
  partnerIdValidation,
  pclIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

const maxInputLength = 80;

const createTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersCreate),
  partnerId: partnerIdValidation,
  firstName: getTextValidation({ maxLength: maxInputLength, required: true }),
  lastName: getTextValidation({ maxLength: maxInputLength, required: true }),
  email: getTextValidation({ base: z.string().email(), maxLength: maxInputLength, required: true }),
  startDate: getDateValidation().optional(),
  role: z.union([
    z.literal(ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR),
    z.literal(ProjectRole.MAIN_COMPANY_CONTACT),
    z.literal(ProjectRole.ASSOCIATE),
  ]),
});

const replaceTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersReplace),
  partnerId: partnerIdValidation,
  pclId: pclIdValidation,
  firstName: getTextValidation({ maxLength: maxInputLength, required: true }),
  lastName: getTextValidation({ maxLength: maxInputLength, required: true }),
  email: getTextValidation({ base: z.string().email(), maxLength: maxInputLength, required: true }),
  role: z.nativeEnum(ProjectRole),
  endDate: getDateValidation().optional(),
});

const updateTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersUpdate),
  partnerId: partnerIdValidation,
  pclId: pclIdValidation,
  contactId: contactIdValidation,
  firstName: getTextValidation({ maxLength: maxInputLength, required: true }),
  lastName: getTextValidation({ maxLength: maxInputLength, required: true }),
  role: z.nativeEnum(ProjectRole),
});

const deleteTeamMemberValidator = z.object({
  form: z.literal(FormTypes.ProjectManageTeamMembersDelete),
  pclId: pclIdValidation,
  role: z.nativeEnum(ProjectRole),
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
  createTeamMemberValidator,
  deleteTeamMemberValidator,
  manageTeamMemberErrorMap,
  manageTeamMemberValidator,
  ManageTeamMemberValidatorSchema,
  replaceTeamMemberValidator,
  updateTeamMemberValidator,
};
