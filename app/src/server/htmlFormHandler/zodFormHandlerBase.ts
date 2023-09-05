import { Copy } from "@copy/Copy";
import { IContext } from "@framework/types/IContext";
import { ISession, ServerFileWrapper } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { ZodFormHandlerError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { makeZodI18nMap } from "@shared/zodi18n";
import { IRouteDefinition } from "@ui/containers/containerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z, ZodError, ZodTypeAny } from "zod";
import { IFormHandler } from "./formHandlerBase";

// Ensure that the Schema passed into the ZodFormHandlerBase
// has the "form" form/button discriminator
type AnyForm = { form: ZodTypeAny };

abstract class ZodFormHandlerBase<
  Schema extends z.ZodObject<AnyForm> | z.ZodDiscriminatedUnion<"form", z.ZodObject<AnyForm>[]>,
  QueryParams extends AnyObject,
> implements IFormHandler
{
  public readonly zod: Schema;
  public readonly route: IRouteDefinition<QueryParams>;
  public readonly routePath: string;
  public readonly forms: FormTypes[];
  private readonly formIntlKeyPrefix: string[];
  protected readonly logger: Logger;
  protected readonly copy: Copy;

  /**
   * Should this form handler accept files?
   * true  : The form handler will map Express/Multer `req.files` to an array of ServerFileHandler
   * false : The form handler will return an empty array of files
   */
  public abstract readonly acceptFiles: boolean;

  constructor({
    zod,
    route,
    forms,
    formIntlKeyPrefix,
  }: {
    zod: Schema;
    route: IRouteDefinition<QueryParams>;
    forms: FormTypes[];
    formIntlKeyPrefix: string[];
  }) {
    this.zod = zod;
    this.route = route;
    this.routePath = route.routePath;
    this.logger = new Logger(`${route.routeName} Form Handler`);
    this.forms = forms;
    this.formIntlKeyPrefix = formIntlKeyPrefix;
    this.copy = new Copy();
  }

  public async handle({ req, res, next }: { req: express.Request; res: express.Response; next: express.NextFunction }) {
    let input: z.output<Schema> | null = null;

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

      // Convert the HTTP body input into a form acceptable for Zod parsing.
      input = await this.mapToZod({
        input: req.body,
        req,
        res,
        params: req.params as QueryParams,
        files,
        context,
      });

      this.logger.debug(req.url, input);
      const data = this.zod.parse(input, { errorMap: makeZodI18nMap({ keyPrefix: this.formIntlKeyPrefix }) });
      this.logger.debug("Successfully parsed Zod input!", data);
      await this.run({ input: data, context, res });

      // TODO: Make `mapToRedirect` accept the Zod output instead of the req.body
      const successRedirectParams = await this.mapToRedirect({
        input: req.body,
        req,
        res,
        params: req.params as QueryParams,
        files,
        context,
      });

      res.locals.isFormSuccess = true;

      // If the params is null, we're staying on the same page.
      if (!successRedirectParams) {
        next();
      } else {
        res.redirect(this.route.getLink(successRedirectParams).path);
      }
    } catch (e) {
      if (e instanceof ZodError) {
        this.logger.debug("Failed to parse Zod input.", input, e);
        next(new ZodFormHandlerError(input, e));
      } else {
        this.logger.error("Failed to execute Zod form handler.", e);
        next(e);
      }
    }
  }

  /**
   * Redirect a user to a specified URL.
   * Return `null` to avoid redirecting and re-render the page the user submitted from.
   */
  protected abstract mapToRedirect({
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
  }): Promise<QueryParams | null>;

  /**
   * Convert the `req.body` and `req.files` of Express into the input
   * exprected by the Zod validator
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
   * Execute the query required by this handler with the user's validated Zod input.
   */
  protected abstract run({
    input,
    context,
    res,
  }: {
    input: z.output<Schema>;
    context: IContext;
    res: express.Response;
  }): Promise<void>;
}

export { ZodFormHandlerBase };
