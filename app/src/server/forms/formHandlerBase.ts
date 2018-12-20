import express from "express";
import { ISession } from "../apis/controllerBase";
import { configureRouter } from "../../ui/routing";
import { serverRender } from "../serverRender";
import { Results } from "../../ui/validation/results";
import contextProvider from "../features/common/contextProvider";
import { IContext } from "../features/common/context";

interface RouteInfo<TParams> {
  routeName: string;
  routePath: string;
  getParams: (route: { name: string, path: string, params: any }) => TParams;
}

export interface IFormHandler {
  readonly routePath: string;
  handle(req: express.Request, res: express.Response): Promise<void>;
}

export abstract class FormHandlerBase<TParams, TDto> implements IFormHandler {
  constructor(routeInfo: RouteInfo<TParams>) {
    this.routePath = routeInfo.routePath;
    this.routeName = routeInfo.routeName;
    this.getParams = routeInfo.getParams;
  }

  public readonly routePath: string;
  public readonly routeName: string;
  private readonly getParams: (route: { name: string, path: string, params: any }) => TParams;

  public async handle(req: express.Request, res: express.Response): Promise<void> {
    const params = this.getParams({ name: this.routeName, params: req.params, path: req.path });
    const button = req.body.button as string;
    const session: ISession = { user: req.session!.user };
    const context = contextProvider.start(session);
    const file = req.file && { fileName: req.file.originalname, content: req.file.buffer.toString("base64") };
    const dto = await this.getDto(context, params, button, req.body, file);
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

  protected abstract getDto(context: IContext, params: TParams, button: string, body: { [key: string]: string }, file?: any): Promise<TDto>;

  protected abstract run(context: IContext, params: TParams, button: string, dto: TDto): Promise<ILinkInfo>;

  protected abstract getStoreInfo(params: TParams): { key: string, store: string };

  protected abstract createValidationResult(params: TParams, dto: TDto): Results<TDto>;

  protected redirect(link: ILinkInfo, res: express.Response) {
    const router = configureRouter();
    const url = router.buildPath(link.routeName, link.routeParams);
    res.redirect(url);
  }
}
