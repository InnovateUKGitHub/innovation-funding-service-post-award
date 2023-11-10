import express from "express";
import { Params } from "react-router-dom";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { InferEditorStoreDto, InferEditorStoreValidator } from "@ui/redux/stores/storeBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { FormHandlerError } from "@server/features/common/appError";
import { ISession, ServerFileWrapper } from "../apis/controllerBase";
import { MulterError } from "multer";
import { Logger } from "@shared/developmentLogger";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IAppError } from "@framework/types/IAppError";
import { EditorStateKeys } from "@ui/redux/reducers/editorsReducer";
import { EditorState } from "@ui/redux/reducers/rootReducer";
import { equalityIfDefined } from "@gql/dtoMapper/equalityIfDefined";

const logger: Logger = new Logger("FormHandlerBase");

// TODO: review types in this file

export interface RouteInfo<TParams> {
  routeName: string;
  routePath: string;
  getParams: (route: { name: string; path: string; params: AnyObject }) => TParams;
}

export interface IFormHandler {
  readonly routePath: string;

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
type StoreKey<TStore extends EditorStateKeys> = keyof EditorState[TStore];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditor = InferEditorStoreDto<any>;

abstract class FormHandlerBase<TParams, TStore extends EditorStateKeys> implements IFormHandler {
  protected constructor(routeInfo: RouteInfo<TParams>, buttons: (string | IFormButton)[], protected store: TStore) {
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

    if (err instanceof MulterError && this.store === "multipleDocuments") {
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

    const session: ISession = { user: req.session?.user };
    const context = contextProvider.start(session);

    let dto: AnyEditor;

    if (err instanceof MulterError) {
      dto = {
        multerError: err.code,
      };
    } else {
      try {
        dto = (await this.createDto(context, params, button, body, req)) || ({} as AnyEditor);
      } catch (error) {
        context.logger.error("Error creating dto in form submission", error);
        dto = {} as AnyEditor;
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
      next(
        new FormHandlerError(
          key,
          this.store,
          dto,
          this.createValidationResult(params, dto, button),
          error as IAppError,
        ),
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
