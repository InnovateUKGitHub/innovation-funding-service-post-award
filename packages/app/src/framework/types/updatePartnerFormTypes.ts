import { FormTypes } from "@ui/zod/FormTypes";

export type UpdatePartnerFormType =
  | FormTypes.PartnerDetailsEdit
  | FormTypes.ProjectSetupBankDetails
  | FormTypes.ProjectSetupBankDetailsVerify
  | FormTypes.ProjectSetupPostcode
  | FormTypes.ProjectSetup
  | FormTypes.ProjectSetupBankStatement;
//   | FormTypes.ClaimForecastSaveAndContinue
//   | FormTypes.ClaimForecastSaveAndQuit
//   | FormTypes.ProjectSetupForecast
//   | FormTypes.ForecastTileForecast;

export const isUpdatePartnerFormType = (form: FormTypes): form is UpdatePartnerFormType =>
  form === FormTypes.PartnerDetailsEdit ||
  form === FormTypes.ProjectSetupBankDetails ||
  form === FormTypes.ProjectSetupBankDetailsVerify ||
  form === FormTypes.ProjectSetupPostcode ||
  form === FormTypes.ProjectSetup ||
  form === FormTypes.ProjectSetupBankStatement;
//   form === FormTypes.ClaimForecastSaveAndContinue ||
//   form === FormTypes.ClaimForecastSaveAndQuit ||
//   form === FormTypes.ProjectSetupForecast ||
//   form === FormTypes.ForecastTileForecast;
