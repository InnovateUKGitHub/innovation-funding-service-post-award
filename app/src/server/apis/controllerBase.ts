import mimeTypes from "mime-types";
import { Router } from "express-serve-static-core";
import multer from "multer";
import express, { NextFunction, Request, Response } from "express";
import { ApiError, ErrorCode, StatusCode } from "./ApiError";
import { ValidationError } from "../../shared/validation";
import { Results } from "../../ui/validation/results";
import { SalesforceTokenError } from "../repositories/salesforceConnection";
import { FileUpload } from "../../types/FileUpload";
import { SalesforceInvalidFilterError } from "../repositories/salesforceBase";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// this is the information extracted from an express request / session and stored in the redux store
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

  protected deleteItem<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<void>) {
    this.router.delete(path, this.executeMethod(200, getParams, run, true));
    return this;
  }

  protected getAttachment<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: ApiParams<TParams>) => Promise<DocumentDto>) {
    this.router.get(path, this.attachmentHandler(200, getParams, run));
    return this;
  }

  protected postAttachment<TParams>(path: string, getParams: (params: any, query: any, body: any, file: any) => TParams, run: (params: ApiParams<TParams>) => Promise<{documentId: string}>) {
    this.router.post(path, upload.single("attachment"), this.executeMethod(201, getParams, run, false));
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
      return { status: StatusCode.BAD_REQUEST, data: { code: ErrorCode.VALIDATION_ERROR, details: error.validationResult } };
    }
    if (error instanceof ApiError) {
      return { status: error.errorCode, data: { code: ErrorCode.SERVER_ERROR, details: error.message } };
    }
    if (error instanceof SalesforceTokenError) {
      return { status: StatusCode.SERVICE_UNAVAILABLE, data: { code: ErrorCode.SECURITY_ERROR, details: error.message } };
    }
    if(error instanceof SalesforceInvalidFilterError) {
      return { status: StatusCode.NOT_FOUND, data: {code: ErrorCode.REQUEST_ERROR, details: "Not found"}};
    }
    return { status: 500, data: { code: ErrorCode.SERVER_ERROR, details: error.message || "An unexpected error has occurred..." } };
  }

  private errorHandler<E extends Error>(err: E, resp: Response) {
    console.log("Error in controller", err);
    const { status, data } = this.constructErrorResponse(err);
    return resp.status(status).json(data);
  }

  private executeMethod<TParams, TResponse>(successStatus: number, getParams: (params: any, query: any, body?: any, file?: any) => TParams, run: (params: ApiParams<TParams>) => Promise<TResponse | null>, allowNulls: boolean) {
    type extendedRequest = Request & { file: Express.Multer.File };
    return async (req: extendedRequest, resp: Response, next: NextFunction) => {

      const file: FileUpload | {} = req.file ? { fileName: req.file.originalname, content: req.file.buffer.toString("base64") } : {};
      const p = Object.assign({ user: req.session!.user as IUser }, getParams(req.params || {}, req.query || {}, req.body || {}, file));
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
      const p = Object.assign({ user: req.session!.user as IUser }, getParams(req.params || {}, req.query || {}, req.body || {}));
      run(p)
        .then(result => {
          if ((result === null || result === undefined)) {
            return resp.status(404).send();
          }
          const defaultContentType = "application/octet-stream";
          const contentType = result.fileType ? mimeTypes.lookup(result.fileType) : defaultContentType;
          const head = {
            "Content-Length": result.contentLength,
            "Content-Type": contentType || defaultContentType,
            "Content-Disposition": `filename="${result.fileName}"`
          };
          resp.writeHead(successStatus, head);
          return result.stream.pipe(resp);
        })
        .catch((e: Error) => this.errorHandler(e, resp));
    };
  }
}
