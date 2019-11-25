import express, { RequestHandler } from "express";
import { ISession, ServerFileWrapper } from "../apis/controllerBase";
import { configureRouter, routeConfig } from "../../ui/routing";
import { Results } from "../../ui/validation/results";
import contextProvider from "../features/common/contextProvider";
import { FormHandlerError } from "../features/common/appError";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { upload } from "./memoryStorage";

interface RouteInfo<TParams> {
  routeName: string;
  routePath: string;
  getParams: (route: { name: string, path: string, params: any }) => TParams;
}

export interface IFormHandler {
  readonly routePath: string;
  readonly middleware: RequestHandler[];
  handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
}

export interface IFormButton {
  name: string | undefined;
  value: string;
}
export interface IFormBody {
  [key: string]: string;
}

abstract class FormHandlerBase<TParams, TDto, TValidation extends Results<{}>> implements IFormHandler {
  protected constructor(routeInfo: RouteInfo<TParams>, buttons: string[]) {
    this.routePath = routeInfo.routePath.split("?")[0];
    this.routeName = routeInfo.routeName;
    this.getParams = routeInfo.getParams;
    this.buttons = buttons;
  }

  public readonly routePath: string;
  public readonly routeName: string;
  public readonly buttons: string[];
  private readonly getParams: (route: { name: string, path: string, params: any }) => TParams;

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    // Used by BadRequestHandler to determine that the route has been matched
    res.locals.isMatchedRoute = true;

    const params = this.getParams({ name: this.routeName, params: { ...req.params, ...req.query }, path: req.path });

    const buttonName = this.buttons.find(x => `button_${x}` in req.body);

    // If the button in the request does not match this handler, call next handler
    if (!buttonName) return next();

    const button = { name: buttonName, value: req.body[`button_${buttonName}`] };
    const body = { ...req.body };
    delete body[`button_${buttonName}`];

    const session: ISession = { user: req.session!.user };
    const context = contextProvider.start(session);

    let dto: TDto;
    try {
      dto = (await this.createDto(context, params, button, body, req)) || {} as TDto;
    }
    catch (error) {
      context.logger.error("Error creating dto in form submission", error);
      dto = {} as TDto;
    }

    try {
      const link = await this.run(context, params, button, dto);
      this.redirect(link, res);
      return;
    }
    catch (error) {
      context.logger.error("Error handling form submission", error);
      const { key, store } = this.getStoreInfo(params, dto);
      throw new FormHandlerError(key, store, dto, this.createValidationResult(params, dto, button), error);
    }
  }

  protected abstract createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<TDto>;

  protected abstract run(context: IContext, params: TParams, button: IFormButton, dto: TDto): Promise<ILinkInfo>;

  protected abstract getStoreInfo(params: TParams, dto: TDto): { key: string, store: string };

  protected abstract createValidationResult(params: TParams, dto: TDto, button: IFormButton): TValidation;

  protected redirect(link: ILinkInfo, res: express.Response) {
    const router = configureRouter(routeConfig);
    const url = router.buildPath(link.routeName, link.routeParams);
    res.redirect(url);
    return;
  }

  public abstract readonly middleware: RequestHandler[];
}

export abstract class StandardFormHandlerBase<TParams, TDto, TValidation extends Results<{}>> extends FormHandlerBase<TParams, TDto, TValidation> {

  public readonly middleware = [];

  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<TDto> {
    return this.getDto(context, params, button, body);
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody): Promise<TDto>;
}

export abstract class SingleFileFormHandlerBase<TParams, TDto, TValidation extends Results<{}>> extends FormHandlerBase<TParams, TDto, TValidation> {
  public readonly middleware = [upload.single("attachment")];

  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<TDto> {
    const file: IFileWrapper | null = req.file && new ServerFileWrapper(req.file);
    return this.getDto(context, params, button, body, file);
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, file: IFileWrapper|null): Promise<TDto>;
}

export abstract class MultipleFileFormHandlerBase<TParams, TDto, TValidation extends Results<{}>> extends FormHandlerBase<TParams, TDto, TValidation> {
  public readonly middleware = [upload.array("attachment")];

  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<TDto> {
    const files: IFileWrapper[] = Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];
    return this.getDto(context, params, button, body, files);
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<TDto>;

}
