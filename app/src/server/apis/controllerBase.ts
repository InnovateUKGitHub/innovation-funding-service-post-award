import {Router} from "express-serve-static-core";
import express, {NextFunction, Request, Response} from "express";
import {ApiError} from "./ApiError";

export abstract class ControllerBase<T> {
  public readonly router: Router;
  public path?: string;

  protected constructor() {
    this.router = express.Router();
  }

  protected getCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<TResponse | null>, allowNulls?: boolean) {
    this.router.get(path, this.executeMethod(200, getParams, run, allowNulls || false));
    return this;
  }

  protected getItem<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<T | null>) {
    return this.getCustom<TParams, T>(path, getParams, run, false);
  }

  protected putItem<TParams>(path: string, getParams: (params: any, query: any, body: any) => TParams, run: (params: TParams) => Promise<T>) {
    return this.putCustom<TParams, T>(path, getParams, run);
  }

  protected getItems<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<T[]>) {
    return this.getCustom<TParams, T[]>(path, getParams, run, false);
  }

  protected putCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any, body?: any) => TParams, run: (params: TParams) => Promise<TResponse>) {
    this.router.put(path, this.executeMethod(200, getParams, run, false));
    return this;
  }

  protected getEmpty<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<void>) {
    this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run, true));
    return this;
  }

  private executeMethod<TParams, TResponse>(successStatus: number, getParams: (params: any, query: any, body?: any) => TParams, run: (params: TParams) => Promise<TResponse | null>, allowNulls: boolean) {
    return async (req: Request, resp: Response, next: NextFunction) => {
      const p = getParams(req.params || {}, req.query || {}, req.body || {});
      run(p)
        .then(result => {
          if (result !== null || allowNulls === true) {
            resp.status(successStatus).send(result);
          }
          else {
            resp.status(404).send();
          }
        })
        .catch((e: ApiError) => {
          console.log("Error in controller", e);
          if (e.errorCode && e.message) {
            return resp.status(e.errorCode).json({message: "An error occurred...", details: e.message});
          }
          resp.status(500).json({message: "An unexpected Error has occurred.....", details: e.message});
        });
    };
  }
}
