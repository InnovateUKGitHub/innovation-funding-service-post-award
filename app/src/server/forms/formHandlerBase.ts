import express from "express";
import { Params } from "react-router";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { EditorState, EditorStateKeys } from "@ui/redux";
import { InferEditorStoreDto, InferEditorStoreValidator } from "@ui/redux/stores/storeBase";
import { IFileWrapper, IAppError } from "@framework/types";
import { contextProvider } from "@server/features/common/contextProvider";
import { FormHandlerError } from "@server/features/common/appError";
import { ISession, ServerFileWrapper } from "../apis/controllerBase";

// TODO: review types in this file

interface RouteInfo<TParams> {
  routeName: string;
  routePath: string;
  getParams: (route: { name: string; path: string; params: AnyObject }) => TParams;
}

export interface IFormHandler {
  readonly routePath: string;
  handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
}

export interface IFormButton {
  name: string;
  value: string;
}

export type IFormBody = {
  [key: string]: string;
} & { partnerId: PartnerId; projectId: ProjectId };
type StoreKey<TStore extends EditorStateKeys> = keyof EditorState[TStore];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditor = InferEditorStoreDto<any>;

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
  private readonly getParams: (route: { name: string; path: string; params: Params }) => TParams;

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    // Used by BadRequestHandler to determine that the route has been matched
    res.locals.isMatchedRoute = true;

    const params = this.getParams({
      name: this.routeName,
      params: { ...req.params, ...req.query } as Params, // casting from express request param type to react router param type
      path: req.path,
    });

    const buttonName = this.buttons.find(x => `button_${x}` in req.body);

    // If the button in the request does not match this handler, call next handler
    if (!buttonName) return next();

    const button = { name: buttonName, value: req.body[`button_${buttonName}`] };
    const body = { ...req.body };
    delete body[`button_${buttonName}`];

    const session: ISession = { user: req.session?.user };
    const context = contextProvider.start(session);

    let dto: AnyEditor;

    try {
      dto = (await this.createDto(context, params, button, body, req)) || ({} as AnyEditor);
    } catch (error) {
      context.logger.error("Error creating dto in form submission", error);
      dto = {} as AnyEditor;
    }

    try {
      const { path: newRedirectUrl } = await this.run(context, params, button, dto);
      res.redirect(newRedirectUrl);
      return;
    } catch (error: unknown) {
      context.logger.error("Error handling form submission", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const key = this.getStoreKey(params, dto as any);
      throw new FormHandlerError(
        key,
        this.store,
        dto,
        this.createValidationResult(params, dto, button),
        error as IAppError,
      );
    }
  }

  protected abstract createDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    req: express.Request,
  ): Promise<AnyEditor>;

  protected abstract run(context: IContext, params: TParams, button: IFormButton, dto: AnyEditor): Promise<ILinkInfo>;

  protected abstract getStoreKey(
    params: TParams,
    dto: InferEditorStoreDto<EditorState[TStore][StoreKey<TStore>]>,
  ): string;

  protected abstract createValidationResult(
    params: TParams,
    dto: AnyEditor,
    button: IFormButton,
  ): // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InferEditorStoreValidator<any>;
}
export abstract class StandardFormHandlerBase<TParams, TStore extends EditorStateKeys> extends FormHandlerBase<
  TParams,
  TStore
> {
  protected async createDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<AnyEditor> {
    return this.getDto(context, params, button, body);
  }

  protected abstract getDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<AnyEditor>;
}

export abstract class SingleFileFormHandlerBase<TParams, TStore extends EditorStateKeys> extends FormHandlerBase<
  TParams,
  TStore
> {
  protected async createDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    req: express.Request,
  ): Promise<AnyEditor> {
    const file: IFileWrapper | null = req.file ? (new ServerFileWrapper(req.file) as IFileWrapper) : null;
    return this.getDto(context, params, button, body, file);
  }

  protected abstract getDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    file: IFileWrapper | null,
  ): Promise<AnyEditor>;
}

export abstract class MultipleFileFormHandlerBase<TParams, TStore extends EditorStateKeys> extends FormHandlerBase<
  TParams,
  TStore
> {
  protected async createDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    req: express.Request,
  ): Promise<AnyEditor> {
    const files: IFileWrapper[] = Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];
    return this.getDto(context, params, button, body, files);
  }

  protected abstract getDto(
    context: IContext,
    params: TParams,
    button: IFormButton,
    body: IFormBody,
    files: IFileWrapper[],
  ): Promise<AnyEditor>;
}
