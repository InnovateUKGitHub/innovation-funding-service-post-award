/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { ValidationError, ZodFormHandlerError } from "@server/features/common/appError";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Authorisation } from "@framework/types/authorisation";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { IContext } from "@framework/types/IContext";
import { FileTypeNotAllowedError } from "@server/repositories/errors";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { RunnableBase } from "./Runnable";
import { z, ZodError, ZodRawShape } from "zod";

export abstract class SyncCommandBase<T> extends RunnableBase<T> {}
export abstract class AsyncCommandBase<T> extends SyncCommandBase<Promise<T | undefined>> {}
export abstract class AuthorisedAsyncCommandBase<T> extends AsyncCommandBase<T> {
  accessControl(auth: Authorisation, context: IContext) {
    return Promise.resolve(true);
  }

  handleRepositoryError(context: IContext, error: unknown): Error | void {
    return;
  }
}

export abstract class ZodAuthorisedAsyncCommandBase<
  T,
  Schema extends
    | z.ZodObject<ZodRawShape>
    | z.ZodEffects<z.ZodObject<ZodRawShape>>
    | z.ZodDiscriminatedUnion<string, z.ZodObject<ZodRawShape>[]>,
  Dto extends AnyObject,
> extends AuthorisedAsyncCommandBase<T> {
  protected abstract readonly dto: Dto;
  protected abstract getZodSchema(context: IContext): Promise<{ schema: Schema; errorMap: z.ZodErrorMap }>;

  /**
   * Convert the `req.body` and `req.files` of Express into the input
   * expected by the Zod validator
   */
  protected abstract mapToZod(dto: AnyObject): Promise<z.input<Schema>>;

  protected abstract runRepositoryCommands(context: IContext, validatedData: z.output<Schema>): Promise<T>;

  protected async run(context: IContext): Promise<T> {
    try {
      const { schema, errorMap } = await this.getZodSchema(context);
      const data = await this.mapToZod(this.dto);
      const validatedData = schema.parse(data, { errorMap });
      const res = await this.runRepositoryCommands(context, validatedData);
      return res;
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ZodFormHandlerError(this.dto, e.message, e.issues, e);
      }
      return Promise.reject(e);
    }
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
