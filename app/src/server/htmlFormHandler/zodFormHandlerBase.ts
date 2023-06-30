import { Copy } from "@copy/Copy";
import { IContext } from "@framework/types/IContext";
import { ISession, ServerFileWrapper } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { ZodFormHandlerError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { makeZodI18nMap } from "@shared/zodi18n";
import { IRouteDefinition } from "@ui/containers/containerBase";
import express from "express";
import { z, ZodError } from "zod";
import { IFormHandler } from "./formHandlerBase";

abstract class ZodFormHandlerBase<Schema extends z.ZodObject<AnyObject>, QueryParams extends AnyObject>
  implements IFormHandler
{
  public readonly zod: Schema;
  public readonly route: IRouteDefinition<QueryParams>;
  public readonly routePath: string;
  public readonly forms: string[];
  private readonly formIntlKeyPrefix: string[];
  public abstract readonly acceptFiles: boolean;
  protected readonly logger: Logger;
  protected readonly copy: Copy;

  constructor({
    zod,
    route,
    forms,
    formIntlKeyPrefix,
  }: {
    zod: Schema;
    route: IRouteDefinition<QueryParams>;
    forms: string[];
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

      // If the ID of the form has not been submitted, skip.
      if (!req.body.form) return next();

      // If this form handler does not accept this form, skip.
      if (!this.forms.includes(req.body.form)) return next();

      const files = this.acceptFiles && Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];

      res.locals.isMatchedRoute = true;

      // Convert the HTML body input into a form acceptable for Zod parsing.
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
