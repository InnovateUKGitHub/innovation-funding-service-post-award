import mimeTypes from "mime-types";
import {Router} from "express-serve-static-core";
import express, {NextFunction, Request, Response} from "express";
import {ApiError, ErrorCode, StatusCode} from "./ApiError";
import {ValidationError} from "../../shared/validation";
import {Results} from "../../ui/validation/results";
import {DocumentDto} from "../../ui/models";

import { IUser } from "../../shared/IUser";

// this is the infromation extreacted from an express request / session and stored in the redux store
// it is the same shape client and server side allowing the client and server api calls to have the same shape
export interface ISession {
  user: IUser;
}

export type ApiParams<T> = T & ISession;


export abstract class ControllerBase<T> {
  public readonly router: Router;

  protected constructor(public path: string) {
    this.router = express.Router();
  }

  protected getCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<TResponse | null>, allowNulls?: boolean) {
    this.router.get(path, this.executeMethod(200, getParams, run, allowNulls || false));
    return this;
  }

  protected getItem<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<T | null>) {
    return this.getCustom<TParams, T>(path, getParams, run, false);
  }

  protected getAttachment<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<DocumentDto>) {
    this.router.get(path, this.attachmentHandler(200, getParams, run));
    return this;
  }

  protected putItem<TParams>(path: string, getParams: (params: any, query: any, body: any) => TParams, run: (params: ApiParams<TParams>) => Promise<T | null>) {
    return this.putCustom<TParams, T | null>(path, getParams, run);
  }

  protected putItems<TParams>(path: string, getParams: (params: any, query: any, body: any) => TParams, run: (params: ApiParams<TParams>) => Promise<T[]>) {
    return this.putCustom<TParams, T[]>(path, getParams, run);
  }


  protected postItems<TParams>(path: string, getParams: (params: any, query: any, body: any) => TParams, run: (params: ApiParams<TParams>) => Promise<T[]>) {
    return this.postCustom<TParams, T[]>(path, 201, getParams, run);
  }

  protected getItems<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<T[]>) {
    return this.getCustom<TParams, T[]>(path, getParams, run, false);
  }

  protected putCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any, body?: any) => TParams, run: (params: ApiParams<TParams>) => Promise<TResponse>) {
    this.router.put(path, this.executeMethod(200, getParams, run, false));
    return this;
  }

  protected postCustom<TParams, TResponse>(path: string, successStatus: number, getParams: (params: any, query: any, body?: any) => TParams, run: (params: ApiParams<TParams>) => Promise<TResponse>) {
    this.router.post(path, this.executeMethod(successStatus || 201, getParams, run, false));
    return this;
  }

  protected getEmpty<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<void>) {
    this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run, true));
    return this;
  }

  private constructErrorResponse<E extends Error>(error: E): { status: number, data: { code: number, details: string | Results<{}> } } {
    if (error instanceof ValidationError) {
      return { status: StatusCode.BAD_REQUEST, data: { code: ErrorCode.VALIDATION_ERROR, details: error.validationResult }};
    }
    if (error instanceof ApiError) {
      return { status: error.errorCode, data: { code: ErrorCode.SERVER_ERROR, details: error.message }};
    }
    return { status: 500, data: { code: ErrorCode.SERVER_ERROR, details: "An unexpected error has occurred..." } };
  }

  private errorHandler<E extends Error>(err: E, resp: Response) {
    console.log("Error in controller", err);
    const {status, data} = this.constructErrorResponse(err);
    return resp.status(status).json(data);
  }

  private executeMethod<TParams, TResponse>(successStatus: number, getParams: (params: any, query: any, body?: any) => TParams, run: (params: ApiParams<TParams>) => Promise<TResponse | null>, allowNulls: boolean) {
    return async (req: Request, resp: Response, next: NextFunction) => {

      const p = Object.assign({user: req.session!.user as IUser}, getParams(req.params || {}, req.query || {}, req.body || {}));
      run(p)
        .then(result => {
          if ((result === null || result === undefined) && allowNulls === false) {
            return resp.status(404).send();
          }
          resp.status(successStatus).send(result);
        })
        .catch((e: Error) => this.errorHandler(e, resp));
    };
  }

  private attachmentHandler<TParams, TResponse>(successStatus: number, getParams: (params: any, query: any, body?: any) => TParams, run: (params: ApiParams<TParams>) => Promise<DocumentDto>) {
    return async (req: Request, resp: Response, next: NextFunction) => {
      const p = Object.assign({user: req.session!.user as IUser}, getParams(req.params || {}, req.query || {}, req.body || {}));
      run(p)
        .then(result => {
          if ((result === null || result === undefined)) {
            return resp.status(404).send();
          }
          const head = {
            "Content-Length": result.contentLength,
            "Content-Type": mimeTypes.lookup(result.fileType) || "application/octet-stream",
            "Content-Disposition": `filename="${result.fileName}"`
          };
          resp.writeHead(successStatus, head);
          return result.stream.pipe(resp);
        })
        .catch((e: Error) => this.errorHandler(e, resp));
    };
  }
}
