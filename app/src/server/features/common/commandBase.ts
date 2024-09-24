/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { ValidationError } from "@server/features/common/appError";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Authorisation } from "@framework/types/authorisation";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { IContext } from "@framework/types/IContext";
import { FileTypeNotAllowedError } from "@server/repositories/errors";
import {
  MultipleDocumentUploadDtoValidator,
  DocumentUploadDtoValidator,
} from "@ui/validation/validators/documentUploadValidator";
import { RunnableBase } from "./Runnable";

export abstract class SyncCommandBase<T> extends RunnableBase<T> {}
export abstract class AsyncCommandBase<T> extends SyncCommandBase<Promise<T>> {}
export abstract class AuthorisedAsyncCommandBase<T> extends AsyncCommandBase<T> {
  accessControl(auth: Authorisation, context: IContext) {
    return Promise.resolve(true);
  }

  handleRepositoryError(context: IContext, error: unknown): Error | void {
    return;
  }
}

export abstract class CommandMultipleDocumentBase<T> extends AuthorisedAsyncCommandBase<T> {
  protected abstract documents: MultipleDocumentUploadDto;
  protected abstract filesRequired: boolean;
  protected abstract showValidationErrors: boolean;

  async dispatchAction<iDocs extends IFileWrapper[]>(
    docs: iDocs,
    action: (doc: iDocs[0]) => Promise<string>,
  ): Promise<string[]> {
    const docsWithNameAndSize = docs.filter(x => x.fileName && x.size);
    const promisedDocs: Promise<string>[] = docsWithNameAndSize.map(action);

    return await Promise.all(promisedDocs);
  }

  handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    if (error instanceof FileTypeNotAllowedError) {
      const result = new MultipleDocumentUploadDtoValidator(
        this.documents,
        context.config.options,
        this.filesRequired,
        this.showValidationErrors,
        error,
      );
      if (!result.isValid) {
        return new ValidationError(result);
      }
    }
  }
}

export abstract class CommandDocumentBase<T> extends AuthorisedAsyncCommandBase<T> {
  protected abstract document: DocumentUploadDto;
  protected abstract showValidationErrors: boolean;
  handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    if (error instanceof FileTypeNotAllowedError) {
      const result = new DocumentUploadDtoValidator(this.document, context.config.options, this.showValidationErrors);
      if (!result.isValid) {
        return new ValidationError(result);
      }
    }
  }
}
