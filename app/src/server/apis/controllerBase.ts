import {Router} from "express-serve-static-core";
import express, {NextFunction, Request, Response} from "express";
import {ApiError, ErrorCode, StatusCode} from "./ApiError";
import {ValidationError} from "../../shared/validation";
import {Results} from "../../ui/validation/results";

export abstract class ControllerBase<T> {
  public readonly router: Router;

  protected constructor(public path: string) {
    this.router = express.Router();
  }

  protected getCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<TResponse | null>, allowNulls?: boolean) {
    this.router.get(path, this.executeMethod(200, getParams, run, allowNulls || false));
    return this;
  }

  protected getItem<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<T | null>) {
    return this.getCustom<TParams, T>(path, getParams, run, false);
  }

  protected putItem<TParams>(path: string, getParams: (params: any, query: any, body: any) => TParams, run: (params: TParams) => Promise<T | null>) {
    return this.putCustom<TParams, T | null>(path, getParams, run);
  }

  protected postItems<TParams>(path: string, getParams: (params: any, query: any, body: any) => TParams, run: (params: TParams) => Promise<T[]>) {
    return this.postCustom<TParams, T[]>(path, 201, getParams, run);
  }

  protected getItems<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<T[]>) {
    return this.getCustom<TParams, T[]>(path, getParams, run, false);
  }

  protected putCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any, body?: any) => TParams, run: (params: TParams) => Promise<TResponse>) {
    this.router.put(path, this.executeMethod(200, getParams, run, false));
    return this;
  }

  protected postCustom<TParams, TResponse>(path: string, successStatus: number, getParams: (params: any, query: any, body?: any) => TParams, run: (params: TParams) => Promise<TResponse>) {
    this.router.post(path, this.executeMethod(successStatus || 201, getParams, run, false));
    return this;
  }

  protected getEmpty<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<void>) {
    this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run, true));
    return this;
  }

  private constructErrorResponse(e: ApiError | ValidationError | any): { status: number, data: { code: number, details: string | Results<{}> } } {
    if (e instanceof ValidationError) {
      return { status: StatusCode.BAD_REQUEST, data: { code: ErrorCode.VALIDATION_ERROR, details: e.validationResult }};
    }
    if (e instanceof ApiError) {
      return { status: e.errorCode, data: { code: ErrorCode.SERVER_ERROR, details: e.message }};
    }
    return { status: 500, data: { code: ErrorCode.SERVER_ERROR, details: "An unexpected error has occurred..." } };
  }

  private executeMethod<TParams, TResponse>(successStatus: number, getParams: (params: any, query: any, body?: any) => TParams, run: (params: TParams) => Promise<TResponse | null>, allowNulls: boolean) {
    return async (req: Request, resp: Response, next: NextFunction) => {
      const p = getParams(req.params || {}, req.query || {}, req.body || {});
      run(p)
        .then(result => {
          if ((result === null || result === undefined) && allowNulls === false) {
            return resp.status(404).send();
          }
          resp.status(successStatus).send(result);
        })
        .catch((e: ApiError) => {
          console.log("Error in controller", e);
          const { status, data } = this.constructErrorResponse(e);
          return resp.status(status).json(data);
        });
    };
  }
}
