/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { IContext } from "@framework/types/IContext";
import { Authorisation } from "@framework/types/authorisation";
import { FileTypeNotAllowedError } from "@server/repositories/errors";
import { ZodRawShape, ZodTypeAny, z } from "zod";

export abstract class ZodCommandBase<
  T,
  Schema extends
    | z.ZodObject<ZodRawShape>
    | z.ZodEffects<z.ZodObject<ZodRawShape>>
    | z.ZodDiscriminatedUnion<string, z.ZodObject<ZodRawShape>[]>,
> {
  protected abstract getZodSchema({
    input,
    context,
  }: {
    input: z.input<Schema>;
    context: IContext;
  }): Promise<{ schema: Schema; errorMap: z.ZodErrorMap }>;

  /**
   * Convert the `req.body` and `req.files` of Express into the input
   * expected by the Zod validator
   */
  protected abstract mapToZod(dto: AnyObject): Promise<z.input<Schema>>;

  protected abstract run(context: IContext): Promise<T>;

  protected accessControl(auth: Authorisation, context: IContext) {
    return Promise.resolve(true);
  }

  protected handleRepositoryError(context: IContext, error: FileTypeNotAllowedError | null) {
    return;
  }

  protected logMessage(): unknown {
    return [this.constructor.name, this];
  }
}
