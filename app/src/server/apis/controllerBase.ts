import mimeTypes from "mime-types";
import multer from "multer";
import express, { Request, Response } from "express";

import { FileUpload, IAppError, ISessionUser } from "../../types";
import { NotFoundError } from "../features/common/appError";
import { errorHandlerApi } from "../errorHandlers";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// this is the information extracted from an express request / session and stored in the redux store
// it is the same shape client and server side allowing the client and server api calls to have the same shape
export interface ISession {
  user: ISessionUser;
}

export type ApiParams<T> = T & ISession;

interface RequestUrlParams {
  [key: string]: string;
}

interface RequestQueryParams {
  [key: string]: string;
}

type GetParams<T> = (params: RequestUrlParams, query: RequestQueryParams, body?: any, file?: any) => T;
type Run<T, TR> = (params: ApiParams<T>) => Promise<TR>;

export abstract class ControllerBase<T> {
  public readonly router: express.Router;

  protected constructor(public path: string) {
    this.router = express.Router();
  }

  protected getCustom<TParams, TResponse>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TResponse | null>, allowNulls?: boolean) {
    this.router.get(path, this.executeMethod(200, getParams, run, allowNulls || false));
    return this;
  }

  protected getItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, T | null>) {
    return this.getCustom<TParams, T>(path, getParams, run, false);
  }

  protected deleteItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, void>) {
    this.router.delete(path, this.executeMethod(200, getParams, run, true));
    return this;
  }

  protected getAttachment<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, DocumentDto>) {
    this.router.get(path, this.attachmentHandler(200, getParams, run));
    return this;
  }

  protected postAttachment<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, { documentId: string }>) {
    this.router.post(path, upload.single("attachment"), this.executeMethod(201, getParams, run, false));
  }

  protected putItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, T | null>) {
    return this.putCustom<TParams, T | null>(path, getParams, run);
  }

  protected putItems<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, T[]>) {
    return this.putCustom<TParams, T[]>(path, getParams, run);
  }

  protected postItems<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, T[]>) {
    return this.postCustom<TParams, T[]>(path, 201, getParams, run);
  }

  protected getItems<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, T[]>) {
    return this.getCustom<TParams, T[]>(path, getParams, run, false);
  }

  protected putCustom<TParams, TResponse>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TResponse>) {
    this.router.put(path, this.executeMethod(200, getParams, run, false));
    return this;
  }

  protected postCustom<TParams, TResponse>(path: string, successStatus: number, getParams: GetParams<TParams>, run: Run<TParams, TResponse>) {
    this.router.post(path, this.executeMethod(successStatus || 201, getParams, run, false));
    return this;
  }

  protected getEmpty<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, void>) {
    this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run, true));
    return this;
  }

  private executeMethod<TParams, TResponse>(successStatus: number, getParams: GetParams<TParams>, run: Run<TParams, TResponse | null>, allowNulls: boolean) {
    type extendedRequest = Request & { file: Express.Multer.File };

    return async (req: extendedRequest, resp: Response) => {
      const file: FileUpload | {} = req.file ? { fileName: req.file.originalname, content: req.file.buffer.toString("base64") } : {};
      const p = Object.assign({ user: req.session!.user as ISessionUser }, getParams(req.params || {}, req.query || {}, req.body || {}, file));
      run(p)
        .then(result => {
          if ((result === null || result === undefined) && allowNulls === false) {
            throw new NotFoundError();
          }
          resp.status(successStatus).send(result);
        })
        .catch((e: IAppError) => errorHandlerApi(resp, e));
    };
  }

  private attachmentHandler<TParams>(successStatus: number, getParams: GetParams<TParams>, run: Run<TParams, DocumentDto>) {
    return async (req: Request, resp: Response) => {
      const p = Object.assign({ user: req.session!.user as ISessionUser }, getParams(req.params || {}, req.query || {}, req.body || {}));
      run(p)
        .then(result => {
          if (result === null || result === undefined) {
            throw new NotFoundError();
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
        .catch((e: IAppError) => errorHandlerApi(resp, e));
    };
  }
}
