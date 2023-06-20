import mimeTypes from "mime-types";
import express, { Request, Response } from "express";
import { NotFoundError } from "@shared/appError";
import { getErrorResponse, getErrorStatus } from "@server/errorHandlers";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDto } from "@framework/dtos/documentDto";
import { upload } from "../forms/diskStorage";
import { readFileSync } from "fs";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IAppError } from "@framework/types/IAppError";
import { ISessionUser } from "@framework/types/IUser";
import { configuration } from "@server/features/common/config";

export class ServerFileWrapper implements IFileWrapper {
  constructor(file: Express.Multer.File) {
    this.fileName = file.originalname;
    this.size = file.size;
    this.read = () => readFileSync(file.path, { encoding: "base64" });
  }

  public readonly fileName: string;
  public readonly size: number;
  public readonly read: () => string;
}

// this is the information extracted from an express request / session and stored in the redux store
// it is the same shape client and server side allowing the client and server api calls to have the same shape
export interface ISession {
  user: ISessionUser;
}

export type ApiParams<T = undefined> = T extends undefined ? ISession : Merge<T, ISession>;

interface UrlParamsBase {
  [key: string]: string;
}

interface RequestUrlParams extends UrlParamsBase, INominalTypes {}

interface RequestQueryParams extends UrlParamsBase, INominalTypes {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetParams<T> = (params: RequestUrlParams, query: RequestQueryParams, body?: any) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InnerGetParams<T> = (params: RequestUrlParams, query: RequestQueryParams, body: any, req: Express.Request) => T;
type Run<T, TR> = (params: ApiParams<T>) => Promise<TR>;

export abstract class ControllerBaseWithSummary<TSummaryDto, TDto> {
  public readonly router: express.Router;

  protected constructor(public path: string) {
    this.router = express.Router();
  }

  protected getCustom<TParams, TResponse>(
    path: string,
    getParams: GetParams<TParams>,
    run: Run<TParams, TResponse | null>,
    allowNulls?: boolean,
  ) {
    this.router.get(path, this.executeMethod(200, getParams, run, allowNulls || false));
    return this;
  }

  protected getItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TDto | null>) {
    return this.getCustom<TParams, TDto>(path, getParams, run, false);
  }

  protected deleteItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, boolean>) {
    this.router.delete(path, this.executeMethod(200, getParams, run, true));
    return this;
  }

  protected getAttachment<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, DocumentDto | null>) {
    this.router.get(path, this.attachmentHandler(200, getParams, run));
    return this;
  }

  protected postAttachment<TParams>(
    path: string,
    getParams: GetParams<TParams>,
    run: Run<TParams & { document: DocumentUploadDto }, { documentId: string }>,
  ) {
    const wrappedGetParams: InnerGetParams<TParams & { document: DocumentUploadDto }> = (params, query, body, req) => {
      const p = getParams(params, query, body);

      const file: IFileWrapper | null = req.file ? (new ServerFileWrapper(req.file) as IFileWrapper) : null;
      const description = Number(body.description) || undefined;

      const document: DocumentUploadDto = { file, description };

      return { document, ...p };
    };

    this.router.post(path, upload.single("attachment"), this.executeMethod(201, wrappedGetParams, run, false));
  }

  protected postAttachments<TParams>(
    path: string,
    getParams: GetParams<TParams>,
    run: Run<TParams & { documents: MultipleDocumentUploadDto }, { documentIds: string[] }>,
  ) {
    const wrappedGetParams: InnerGetParams<TParams & { documents: MultipleDocumentUploadDto }> = (
      params,
      query,
      body,
      req,
    ) => {
      const p = getParams(params, query, body);

      const files: IFileWrapper[] = Array.isArray(req.files) ? req.files.map(x => new ServerFileWrapper(x)) : [];
      const description = Number(body.description) || undefined;
      const partnerId = body.partnerId;

      const documents: MultipleDocumentUploadDto = { files, description, partnerId };

      return { documents, ...p };
    };

    this.router.post(
      path,
      upload.array("attachment", configuration.options.maxUploadFileCount),
      this.executeMethod(201, wrappedGetParams, run, false),
    );
  }

  protected putItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TDto | null>) {
    return this.putCustom<TParams, TDto | null>(path, getParams, run);
  }

  protected putItems<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TSummaryDto[]>) {
    return this.putCustom<TParams, TSummaryDto[]>(path, getParams, run);
  }

  protected postItem<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TDto | null>) {
    return this.postCustom<TParams, TDto | null>(path, null, getParams, run);
  }

  protected postItems<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TSummaryDto[]>) {
    return this.postCustom<TParams, TSummaryDto[]>(path, 201, getParams, run);
  }

  protected getItems<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TSummaryDto[]>) {
    return this.getCustom<TParams, TSummaryDto[]>(path, getParams, run, false);
  }

  protected putCustom<TParams, TResponse>(path: string, getParams: GetParams<TParams>, run: Run<TParams, TResponse>) {
    this.router.put(path, this.executeMethod(200, getParams, run, false));
    return this;
  }

  protected postCustom<TParams, TResponse>(
    path: string,
    successStatus: number | null,
    getParams: GetParams<TParams>,
    run: Run<TParams, TResponse>,
  ) {
    this.router.post(path, this.executeMethod(successStatus || 201, getParams, run, false));
    return this;
  }

  protected getEmpty<TParams>(path: string, getParams: GetParams<TParams>, run: Run<TParams, void>) {
    this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run, true));
    return this;
  }

  private executeMethod<TParams, TResponse>(
    successStatus: number,
    getParams: InnerGetParams<TParams>,
    run: Run<TParams, TResponse | null>,
    allowNulls: boolean,
  ) {
    return async (req: Request, resp: Response) => {
      const user: ISessionUser = req.session?.user;

      const p = Object.assign(
        { user },
        getParams((req.params || {}) as RequestUrlParams, (req.query as RequestQueryParams) || {}, req.body || {}, req),
      ) as ApiParams<TParams>;

      run(p)
        .then(result => {
          if ((result === null || result === undefined) && allowNulls === false) {
            throw new NotFoundError();
          }
          resp.status(successStatus).send(result);
        })
        .catch((e: IAppError) => this.handleError(resp, e));
    };
  }

  private attachmentHandler<TParams>(
    successStatus: number,
    getParams: GetParams<TParams>,
    run: Run<TParams, DocumentDto | null>,
  ) {
    return async (req: Request, resp: Response) => {
      const user: ISessionUser = req.session?.user;
      const p = Object.assign(
        { user },
        getParams((req.params || {}) as RequestUrlParams, (req.query as RequestQueryParams) || {}, req.body || {}),
      ) as ApiParams<TParams>;
      run(p)
        .then(result => {
          if (result === null || result === undefined) {
            throw new NotFoundError();
          }
          const defaultContentType = "application/octet-stream";
          const contentType = result.fileType ? mimeTypes.lookup(result.fileType) : defaultContentType;
          const head = {
            "Content-Length": result.contentLength,
            "Content-Type": `${contentType || defaultContentType}; charset=utf-8`,
            "Content-Disposition": `filename="${result.fileName}"`,
          };
          resp.writeHead(successStatus, head);
          return result.stream.pipe(resp);
        })
        .catch((e: IAppError) => this.handleError(resp, e));
    };
  }

  private handleError(res: Response, err: IAppError) {
    return res.status(getErrorStatus(err)).json(getErrorResponse(err));
  }
}

export abstract class ControllerBase<T> extends ControllerBaseWithSummary<T, T> {}
