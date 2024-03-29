import { Copy } from "@copy/Copy";
import { IContext } from "@framework/types/IContext";
import { ISession, ServerFileWrapper } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { ValidationError, ZodFormHandlerError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { IRouteDefinition } from "@ui/containers/containerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z, ZodError, ZodTypeAny } from "zod";
import { IFormHandler } from "./formHandlerBase";
import { convertResultErrorsToZodFormat } from "@framework/util/errorHelpers";

// Ensure that the Schema passed into the ZodFormHandlerBase
// has the "form" form/button discriminator
type AnyForm = { form: ZodTypeAny };

abstract class ZodFormHandlerBase<
  Schema extends
    | z.ZodObject<AnyForm>
    | z.ZodEffects<z.ZodObject<AnyForm>>
    | z.ZodDiscriminatedUnion<string, z.ZodObject<AnyForm>[]>,
  QueryParams extends AnyObject,
> implements IFormHandler
{
  public readonly route: IRouteDefinition<QueryParams>;
  public readonly routePath: string;
  public readonly forms: FormTypes[];
  protected readonly logger: Logger;
  protected readonly copy: Copy;

  /**
   * Should this form handler accept files?
   * true  : The form handler will map Express/Multer `req.files` to an array of ServerFileHandler
   * false : The form handler will return an empty array of files
   */
  public abstract readonly acceptFiles: boolean;

  constructor({ route, forms }: { route: IRouteDefinition<QueryParams>; forms: FormTypes[] }) {
    this.route = route;
    this.routePath = route.routePath;
    this.logger = new Logger(`${route.routeName} Form Handler`);
    this.forms = forms;
    this.copy = new Copy();
  }

  /**
   * Process a user's `req.body` into a dto, validate the dto, and run a command against the validated dto.
   *
   * Order of operations:
   * 1. `req.body` - The input the user entered, mapped as string or string[] (number is a string)
   * 2. `userInput` - The input the user entered, mapped to the correct types (number is a number)
   * 3. `validData` - The input the user entered and with the correct types (including nominal types)
   */
  public async handle({ req, res, next }: { req: express.Request; res: express.Response; next: express.NextFunction }) {
    let userInput: z.output<Schema> | null = null;

    try {
      const session: ISession = { user: req.session?.user };
      const context = contextProvider.start(session);

      // If the ID of the form has not been submitted, skip to the next handler
      if (!req.body.form) return next();

      // If this form handler does not accept this form, skip to the next handler
      if (!this.forms.includes(req.body.form)) return next();

      // Only map `req.files` to ServerFileWrapper if the form handler requests it
      const files = this.acceptFiles && Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];

      res.locals.isMatchedRoute = true;

      // Convert the HTML body input into a form acceptable for Zod parsing.
      userInput = await this.mapToZod({
        input: req.body,
        req,
        res,
        params: req.params as QueryParams,
        files,
        context,
      });

      this.logger.debug(req.url, userInput);

      // TODO: Make `mapToRedirect` accept the Zod output instead of the req.body
      const { schema, errorMap } = await this.getZodSchema({
        input: userInput,
        req,
        res,
        params: req.params as QueryParams,
        files,
        context,
      });

      const validData = schema.parse(userInput, { errorMap });
      this.logger.debug("Successfully parsed Zod input!", validData);

      const newPath = await this.run({ input: validData, context, res, params: req.params as QueryParams });

      res.locals.isFormSuccess = true;

      // If the params is null, we're staying on the same page.
      if (!newPath) {
        next();
      } else {
        res.redirect(newPath);
      }
    } catch (e) {
      if (e instanceof ZodError) {
        this.logger.debug("Failed to parse Zod input.", userInput, e);
        next(new ZodFormHandlerError(userInput, e.message, e.issues));
      } else if (e instanceof ValidationError) {
        this.logger.debug("Failed to execute Zod form handler due to ValidationError", userInput, e);
        next(new ZodFormHandlerError(userInput, e.message, convertResultErrorsToZodFormat(e.results.errors)));
      } else {
        this.logger.error("Failed to execute Zod form handler.", e);
        next(e);
      }
    }
  }

  protected abstract getZodSchema({
    input,
    req,
    res,
    params,
    files,
    context,
  }: {
    input: z.input<Schema>;
    req: express.Request;
    res: express.Response;
    params: QueryParams;
    files: ServerFileWrapper[];
    context: IContext;
  }): Promise<{ schema: Schema; errorMap: z.ZodErrorMap }>;

  /**
   * Convert the `req.body` and `req.files` of Express into the input
   * expected by the Zod validator
   */
  protected abstract mapToZod({
    input,
    req,
    res,
    params,
    files,
    context,
  }: {
    input: AnyObject;
    req: express.Request;
    res: express.Response;
    params: QueryParams;
    files: ServerFileWrapper[];
    context: IContext;
  }): Promise<z.input<Schema>>;

  /**
   * Execute the form handler.
   *
   * @returns The URL to redirect a successful request to. Return `void` to not redirect.
   */
  protected abstract run({
    input,
    context,
    res,
    params,
  }: {
    input: z.output<Schema>;
    context: IContext;
    res: express.Response;
    params: QueryParams;
  }): Promise<void | string>;
}

export { ZodFormHandlerBase };
