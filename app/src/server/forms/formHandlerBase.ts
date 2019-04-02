import express, { RequestHandler } from "express";
import { ISession } from "../apis/controllerBase";
import { configureRouter } from "../../ui/routing";
import { Results } from "../../ui/validation/results";
import contextProvider from "../features/common/contextProvider";
import { FileUpload } from "../../types/FileUpload";
import { FormHandlerError } from "../features/common/appError";
import { ILinkInfo } from "../../types/ILinkInfo";
import { IContext } from "../../types/IContext";

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

export abstract class FormHandlerBase<TParams, TDto, TValidation = {}> implements IFormHandler {
  protected constructor(routeInfo: RouteInfo<TParams>, buttons: string[], middleware?: RequestHandler[]) {
    this.routePath = routeInfo.routePath.split("?")[0];
    this.routeName = routeInfo.routeName;
    this.getParams = routeInfo.getParams;
    this.middleware = middleware || [];
    this.buttons = buttons;
  }

  public readonly routePath: string;
  public readonly routeName: string;
  public readonly buttons: string[];
  public readonly middleware: RequestHandler[];
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

    const file = req.file && { fileName: req.file.originalname, content: req.file.buffer.toString("base64") };
    const dto = await this.createDto(context, params, button, body, file);

    try {
      const link = await this.run(context, params, button, dto);
      this.redirect(link, res);
      return;
    }
    catch (error) {
      const { key, store } = this.getStoreInfo(params, dto);
      throw new FormHandlerError(key, store, dto, this.createValidationResult(params, dto), error);
    }
  }

  private async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, file?: FileUpload): Promise<TDto> {
    const defaultDto = {} as TDto;
    try {
      return await this.getDto(context, params, button, body, file) || defaultDto;
    }
    catch(e) {
      return defaultDto;
    }
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, file?: FileUpload): Promise<TDto>;

  protected abstract run(context: IContext, params: TParams, button: IFormButton, dto: TDto): Promise<ILinkInfo>;

  protected abstract getStoreInfo(params: TParams, dto: TDto): { key: string, store: string };

  protected abstract createValidationResult(params: TParams, dto: TDto): Results<TDto | TValidation>;

  protected redirect(link: ILinkInfo, res: express.Response) {
    const router = configureRouter();
    const url = router.buildPath(link.routeName, link.routeParams);
    res.redirect(url);
    return;
  }
}
