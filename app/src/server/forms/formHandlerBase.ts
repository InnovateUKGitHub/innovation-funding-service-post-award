import express, { RequestHandler } from "express";
import { ISession, ServerFileWrapper } from "../apis/controllerBase";
import { configureRouter, routeConfig } from "../../ui/routing";
import contextProvider from "../features/common/contextProvider";
import { FormHandlerError } from "../features/common/appError";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { upload } from "./memoryStorage";
import { EditorState, EditorStateKeys } from "@ui/redux";
import { InferEditorStoreDto, InferEditorStoreValidator } from "@ui/redux/stores/storeBase";

interface RouteInfo<TParams> {
  routeName: string;
  routePath: string;
  getParams: (route: { name: string, path: string, params: any }) => TParams;
}

export interface IFormHandler {
  readonly routePath: string;
  handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
}

export interface IFormButton {
  name: string | undefined;
  value: string;
}
export interface IFormBody {
  [key: string]: string;
}

abstract class FormHandlerBase<TParams, TStore extends EditorStateKeys> implements IFormHandler {
  protected constructor(routeInfo: RouteInfo<TParams>, buttons: string[], protected store: TStore) {
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

    let dto: InferEditorStoreDto<EditorState[TStore][string]>;
    try {
      dto = (await this.createDto(context, params, button, body, req)) || {} as InferEditorStoreDto<EditorState[TStore][string]>;
    }
    catch (error) {
      context.logger.error("Error creating dto in form submission", error);
      dto = {} as InferEditorStoreDto<EditorState[TStore][string]>;
    }

    try {
      const link = await this.run(context, params, button, dto);
      this.redirect(link, res);
      return;
    }
    catch (error) {
      context.logger.error("Error handling form submission", error);
      const key = this.getStoreKey(params, dto);
      throw new FormHandlerError(key, this.store, dto, this.createValidationResult(params, dto, button), error);
    }
  }

  protected abstract createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<InferEditorStoreDto<EditorState[TStore][string]>>;

  protected abstract run(context: IContext, params: TParams, button: IFormButton, dto: InferEditorStoreDto<EditorState[TStore][string]>): Promise<ILinkInfo>;

  protected abstract getStoreKey(params: TParams, dto: InferEditorStoreDto<EditorState[TStore][string]>): string;

  protected abstract createValidationResult(params: TParams, dto: InferEditorStoreDto<EditorState[TStore][string]>, button: IFormButton): InferEditorStoreValidator<EditorState[TStore][string]>;

  protected redirect(link: ILinkInfo, res: express.Response) {
    const router = configureRouter(routeConfig);
    const url = router.buildPath(link.routeName, link.routeParams);
    res.redirect(url);
  }
}

export abstract class StandardFormHandlerBase<TParams, TStore extends EditorStateKeys> extends FormHandlerBase<TParams, TStore> {

  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<InferEditorStoreDto<EditorState[TStore][string]>> {
    return this.getDto(context, params, button, body);
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody): Promise<InferEditorStoreDto<EditorState[TStore][string]>>;
}

export abstract class SingleFileFormHandlerBase<TParams, TStore extends EditorStateKeys> extends FormHandlerBase<TParams, TStore> {

  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<InferEditorStoreDto<EditorState[TStore][string]>> {
    const file: IFileWrapper | null = req.file && new ServerFileWrapper(req.file);
    return this.getDto(context, params, button, body, file);
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, file: IFileWrapper | null): Promise<InferEditorStoreDto<EditorState[TStore][string]>>;
}

export abstract class MultipleFileFormHandlerBase<TParams, TStore extends EditorStateKeys> extends FormHandlerBase<TParams, TStore> {
  protected async createDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, req: express.Request): Promise<InferEditorStoreDto<EditorState[TStore][string]>> {
    const files: IFileWrapper[] = Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];
    return this.getDto(context, params, button, body, files);
  }

  protected abstract getDto(context: IContext, params: TParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<InferEditorStoreDto<EditorState[TStore][string]>>;

}
