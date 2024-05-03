import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

enum PageCrasherValidCrashTypes {
  Error = "Error",
  NotFoundError = "NotFoundError",
  ForbiddenError = "ForbiddenError",
  InActiveProjectError = "InActiveProjectError",
  BadRequestError = "BadRequestError",
  UnauthenticatedError = "UnauthenticatedError",
  ConfigurationError = "ConfigurationError",
  FormHandlerError = "FormHandlerError",
}

const pageCrasherValidCrashTypesArray = [
  PageCrasherValidCrashTypes.Error,
  PageCrasherValidCrashTypes.NotFoundError,
  PageCrasherValidCrashTypes.ForbiddenError,
  PageCrasherValidCrashTypes.InActiveProjectError,
  PageCrasherValidCrashTypes.BadRequestError,
  PageCrasherValidCrashTypes.UnauthenticatedError,
  PageCrasherValidCrashTypes.ConfigurationError,
  PageCrasherValidCrashTypes.FormHandlerError,
] as const;

const pageCrasherValidationErrorMap = makeZodI18nMap({ keyPrefix: ["developer", "pageCrasher"] });
const pageCrasherValidationSchema = z.object({
  form: z.literal(FormTypes.DeveloperPageCrasher),
  crashType: z.enum(pageCrasherValidCrashTypesArray),
});
type PageCrasherValidationSchemaType = typeof pageCrasherValidationSchema;

export {
  pageCrasherValidationSchema,
  PageCrasherValidationSchemaType,
  pageCrasherValidationErrorMap,
  pageCrasherValidCrashTypesArray,
  PageCrasherValidCrashTypes,
};
