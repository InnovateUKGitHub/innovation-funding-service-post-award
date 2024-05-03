import { ErrorCode } from "@framework/constants/enums";
import { configuration } from "@server/features/common/config";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  BadRequestError,
  ConfigurationError,
  ForbiddenError,
  FormHandlerError,
  InActiveProjectError,
  NotFoundError,
  UnauthenticatedError,
} from "@shared/appError";
import {
  PageCrasherValidCrashTypes,
  PageCrasherValidationSchemaType,
  pageCrasherValidationErrorMap,
  pageCrasherValidationSchema,
} from "@ui/containers/pages/developer/PageCrasher/PageCrasher.logic";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class DeveloperPageCrasherHandler extends ZodFormHandlerBase<PageCrasherValidationSchemaType, never> {
  constructor() {
    super({
      routes: configuration.sso.enabled ? "*" : [],
      forms: [FormTypes.DeveloperPageCrasher],
    });
  }

  public acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pageCrasherValidationSchema,
      errorMap: pageCrasherValidationErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PageCrasherValidationSchemaType>> {
    return {
      form: input.form,
      crashType: input.crashType,
    };
  }

  public async run({ input }: { input: z.output<PageCrasherValidationSchemaType> }): Promise<void> {
    switch (input.crashType) {
      case PageCrasherValidCrashTypes.Error:
        throw new Error("This page has crashed on purpose.");
      case PageCrasherValidCrashTypes.NotFoundError:
        throw new NotFoundError();
      case PageCrasherValidCrashTypes.ForbiddenError:
        throw new ForbiddenError();
      case PageCrasherValidCrashTypes.InActiveProjectError:
        throw new InActiveProjectError();
      case PageCrasherValidCrashTypes.BadRequestError:
        throw new BadRequestError();
      case PageCrasherValidCrashTypes.UnauthenticatedError:
        throw new UnauthenticatedError();
      case PageCrasherValidCrashTypes.ConfigurationError:
        throw new ConfigurationError("This page has crashed on purpose.");
      case PageCrasherValidCrashTypes.FormHandlerError:
        throw new FormHandlerError("test", "test", null, null, {
          code: ErrorCode.UNKNOWN_ERROR,
          message: "This page has crashed on purpose.",
          details: [],
        });
    }

    return;
  }
}
