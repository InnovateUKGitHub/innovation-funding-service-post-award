import { FormTypes } from "@ui/zod/FormTypes";

export type UpdatePartnerFormType = FormTypes.ProjectSetup | FormTypes.ProjectSetupBankStatement;

export const isUpdatePartnerFormType = (form: FormTypes): form is UpdatePartnerFormType =>
  form === FormTypes.ProjectSetupBankDetails ||
  form === FormTypes.ProjectSetupBankDetailsVerify ||
  form === FormTypes.ProjectSetup ||
  form === FormTypes.ProjectSetupBankStatement;
