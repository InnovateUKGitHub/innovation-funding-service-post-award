/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { Authorisation, IContext, IFileWrapper } from "@framework/types";
import { ValidationError } from "@server/features/common/appError";
import { DocumentUploadDtoValidator, MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { FileTypeNotAllowedError } from "@server/repositories";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

// TODO this should become AuthorisedCommandBase and extend CommandBase
export abstract class NonAuthorisedCommandBase<T> {
  protected abstract run(context: IContext): Promise<T>;

  protected logMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class CommandBase<T> {
  protected abstract run(context: IContext): Promise<T>;

  protected accessControl(auth: Authorisation, context: IContext) {
    return Promise.resolve(true);
  }

  protected handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    return;
  }

  protected logMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class CommandMultipleDocumentBase<T> extends CommandBase<T> {
  protected abstract documents: MultipleDocumentUploadDto;
  protected abstract filesRequired: boolean;
  protected abstract showValidationErrors: boolean;

  protected async dispatchAction<iDocs extends IFileWrapper[]>(
    docs: iDocs,
    action: (doc: iDocs[0]) => Promise<string>,
  ): Promise<string[]> {
    const docsWithNameAndSize = docs.filter(x => x.fileName && x.size);
    const promisedDocs: Promise<string>[] = docsWithNameAndSize.map(action);

    return await Promise.all(promisedDocs);
  }

  protected handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    if (error instanceof FileTypeNotAllowedError) {
      const result = new MultipleDocumentUploadDtoValidator(
        this.documents,
        context.config.options,
        this.filesRequired,
        this.showValidationErrors,
        error,
      );
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
      const result = new DocumentUploadDtoValidator(this.document, context.config.options, this.showValidationErrors);
      if (!result.isValid) {
        throw new ValidationError(result);
      }
    }
  }
}

export abstract class SyncCommandBase<T> {
  protected abstract run(context: IContext): T;

  protected logMessage(): any {
    return [this.constructor.name, this];
  }
}
