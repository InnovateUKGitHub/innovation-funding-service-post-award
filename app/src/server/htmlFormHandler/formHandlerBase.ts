import express from "express";
import { Params } from "react-router-dom";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { contextProvider } from "@server/features/common/contextProvider";
import { FormHandlerError } from "@server/features/common/appError";
import { ISession, ServerFileWrapper } from "../apis/controllerBase";
import { MulterError } from "multer";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { IAppError } from "@framework/types/IAppError";
import { equalityIfDefined } from "@gql/dtoMapper/equalityIfDefined";

const logger: ILogger = new Logger("FormHandlerBase");

// TODO: review types in this file

export interface RouteInfo<TParams> {
  routeName: string;
  routePath: string;
  getParams: (route: { name: string; path: string; params: AnyObject }) => TParams;
}

export interface IFormHandler {
  readonly routePath: string | string[];

  // This handler can be used for both error handling and standard routing.
  // This is therefore a destructured object instead of positional arg based,
  // to prevent a developer from passing straight into Express.
  handle: ({
    err,
    req,
    res,
    next,
  }: {
    err?: unknown;
    req: express.Request;
    res: express.Response;
    next: express.NextFunction;
  }) => Promise<void>;
}

export interface IFormButton {
  name: string;
  value?: string;
}

export type IFormBody = {
  [key: string]: string;
} & { partnerId: PartnerId; projectId: ProjectId; pcrId: PcrId; itemId: PcrItemId };

abstract class FormHandlerBase<TParams, TDto extends AnyObject> implements IFormHandler {
  protected constructor(routeInfo: RouteInfo<TParams>, buttons: (string | IFormButton)[]) {
    this.routePath = routeInfo.routePath.split("?")[0];
    this.routeName = routeInfo.routeName;
    this.getParams = routeInfo.getParams;

    this.buttons = buttons.map(x => (typeof x === "string" ? { name: x, value: undefined } : x));
  }

  public readonly routePath: string;
  public readonly routeName: string;
  public readonly buttons: IFormButton[];
  private readonly getParams: (route: { name: string; path: string; params: Params }) => TParams;

  public async handle({
    err,
    req,
    res,
    next,
  }: {
    err?: unknown;
    req: express.Request;
    res: express.Response;
    next: express.NextFunction;
  }): Promise<void> {
    let button: IFormButton;

    // Used by BadRequestHandler to determine that the route has been matched
    res.locals.isMatchedRoute = true;

    if (err instanceof MulterError) {
      // Stub Multer errors with a stub button.
      // We don't know what the button is because we don't have any body anymore (great!)
      logger.error("A multer error occurred!", err);
      button = { name: "", value: "" };
    } else if (err) {
      // If another error has occurred, pass it on to Express.
      return next(err);
    } else {
      // See if our button matches this handler.
      const buttonMatch = this.buttons.find(
        x => `button_${x.name}` in req.body && equalityIfDefined(x.value, req.body[`button_${x.name}`]),
      );
      if (!buttonMatch) return next();

      button = { name: buttonMatch.name, value: req.body[`button_${buttonMatch.name}`] };
    }

    const params = this.getParams({
      name: this.routeName,
      params: { ...req.params, ...req.query } as Params, // casting from express request param type to react router param type
      path: req.path,
    });

    const body = { ...req.body };
    if (button.name) {
      delete body[`button_${button.name}`];
    }

    const session: ISession = { user: req.session?.user, traceId: res.locals.traceId };
    const context = await contextProvider.start(session);

    let dto: TDto;

    if (err instanceof MulterError) {
      dto = {
        multerError: err.code,
      } as unknown as TDto;
    } else {
      try {
        dto = (await this.createDto(context, params, button, body, req)) || ({} as TDto);
      } catch (error) {
        context.logger.error("Error creating dto in form submission", error);
        dto = {} as TDto;
      }
    }

    try {
      const { path: newRedirectUrl } = await this.run(context, params, button, dto);

      res.redirect(newRedirectUrl);
      return;
    } catch (error: unknown) {
      context.logger.error("Error handling form submission", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const key = this.getStoreKey(params, dto as any);
      next(new FormHandlerError(key, dto, this.createValidationResult(params, dto, button), error as IAppError));
    }
  }

  protected abstract createDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    req: express.Request,
  ): Promise<TDto>;

  protected abstract run(context: IContext, params: TParams, button: IFormButton, dto: TDto): Promise<ILinkInfo>;
  protected abstract getStoreKey(params: TParams, dto: TDto): string;
  protected abstract createValidationResult(params: TParams, dto: TDto, button: IFormButton): ResultBase;
}
export abstract class StandardFormHandlerBase<TParams, TDto extends AnyObject> extends FormHandlerBase<TParams, TDto> {
  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody): Promise<TDto> {
    return this.getDto(context, params, button, body);
  }
  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody): Promise<TDto>;
}

export abstract class MultipleFileFormHandlerBase<TParams, TDto extends AnyObject> extends FormHandlerBase<
  TParams,
  TDto
> {
  protected async createDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    req: express.Request,
  ): Promise<TDto> {
    const files: IFileWrapper[] = Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];
    return this.getDto(context, params, button, body, files);
  }

  protected abstract getDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    files: IFileWrapper[],
  ): Promise<TDto>;
}
