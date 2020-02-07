import { Authorisation, IContext } from "@framework/types";
import { ValidationError } from "@server/features/common/appError";
import { DocumentUploadDtoValidator, MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { FileTypeNotAllowedError } from "@server/repositories";

// TODO this should become AuthorisedCommandBase and extend CommandBase
export abstract class NonAuthorisedCommandBase<T> {
  protected abstract Run(context: IContext): Promise<T>;

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class CommandBase<T> {
  protected abstract Run(context: IContext): Promise<T>;

  protected accessControl(auth: Authorisation, context: IContext) {
    return Promise.resolve(true);
  }

  protected handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    return;
  }

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class CommandMultipleDocumentBase<T> extends CommandBase<T> {
  protected abstract documents: MultipleDocumentUploadDto;
  protected abstract filesRequired: boolean;
  protected abstract showValidationErrors: boolean;
  protected handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    if (error instanceof FileTypeNotAllowedError) {
      const result = new MultipleDocumentUpdloadDtoValidator(this.documents, context.config, this.filesRequired, this.showValidationErrors, error);
      if (!result.isValid) {
        throw new ValidationError(result);
      }
    }
  }
}

export abstract class CommandDocumentBase<T> extends CommandBase<T> {
  protected abstract document: DocumentUploadDto;
  protected abstract showValidationErrors: boolean;
  protected handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    if (error instanceof FileTypeNotAllowedError) {
      const result = new DocumentUploadDtoValidator(this.document, context.config.maxFileSize, this.showValidationErrors, error);
      if (!result.isValid) {
        throw new ValidationError(result);
      }
    }
  }
}

export abstract class SyncCommandBase<T> {
  protected abstract Run(context: IContext): T;

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}
