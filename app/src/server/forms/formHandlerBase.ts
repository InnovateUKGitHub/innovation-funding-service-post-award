import express, { RequestHandler } from "express";
import { ISession } from "../apis/controllerBase";
import { configureRouter } from "../../ui/routing";
import { serverRender } from "../serverRender";
import { Results } from "../../ui/validation/results";
import contextProvider from "../features/common/contextProvider";
import { IContext } from "../features/common/context";
import { FileUpload } from "../../types/FileUpload";

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
  name: string;
  value: string;
}
export interface IFormBody {
  [key: string]: string;
}

export abstract class FormHandlerBase<TParams, TDto> implements IFormHandler {
  protected constructor(routeInfo: RouteInfo<TParams>, buttons: string[], middleware?: RequestHandler[]) {
    this.routePath = routeInfo.routePath;
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
    const params = this.getParams({ name: this.routeName, params: req.params, path: req.path });

    const buttonName = this.buttons.find(x => `button_${x}` in req.body);
    if (!buttonName) return next();

    const button = { name: buttonName, value: req.body[`button_${buttonName}`] };
    const body = { ...req.body };
    delete body[`button_${buttonName}`];

    const session: ISession = { user: req.session!.user };
    const context = contextProvider.start(session);
    const file = req.file && { fileName: req.file.originalname, content: req.file.buffer.toString("base64") };
    const dto = await this.getDto(context, params, button, body, file);
    try {
      const link = await this.run(context, params, button, dto);
      this.redirect(link, res);
      return;
    }
    catch (error) {
      const { key, store } = this.getStoreInfo(params);
      serverRender(req, res, { key, store, dto, result: this.createValidationResult(params, dto), error });
      return;
    }
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, file?: FileUpload): Promise<TDto>;

  protected abstract run(context: IContext, params: TParams, button: IFormButton, dto: TDto): Promise<ILinkInfo>;

  protected abstract getStoreInfo(params: TParams): { key: string, store: string };

  protected abstract createValidationResult(params: TParams, dto: TDto): Results<TDto>;

  protected redirect(link: ILinkInfo, res: express.Response) {
    const router = configureRouter();
    const url = router.buildPath(link.routeName, link.routeParams);
    res.redirect(url);
  }
}
