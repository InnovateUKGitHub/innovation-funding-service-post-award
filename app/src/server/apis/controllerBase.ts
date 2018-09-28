import { Router } from "express-serve-static-core";
import express, { NextFunction, Request, Response } from "express";

export abstract class ControllerBase<T> {
    public readonly router: Router;
    public path?: string;

    protected constructor() {
        this.router = express.Router();
    }

    protected getCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<TResponse|null>, allowNulls?: boolean) {
        this.router.get(path, this.executeMethod(200, getParams, run, allowNulls || false));
        return this;
    }

    protected getItem<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<T|null>) {
        return this.getCustom<TParams, T>(path, getParams, run, false);
    }

    protected getItems<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<T[]>) {
        return this.getCustom<TParams, T[]>(path, getParams, run, false);
    }

    protected postCustom<TParams, TResponse>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<TResponse>) {
        this.router.post(path, this.executeMethod(204, getParams, run, false));
        return this;
    }

    protected getEmpty<TParams>(path: string, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<void>) {
        this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run, true));
        return this;
    }

    private executeMethod<TParams, TResponse>(successStatus: number, getParams: (params: any, query: any) => TParams, run: (params: TParams) => Promise<TResponse|null>, allowNulls: boolean) {
        return async (req: Request, resp: Response, next: NextFunction) => {
            try {
                const p = getParams(req.params || {}, req.query || {});
                const result = await run(p);
                if(result !== null || allowNulls === true) {
                    resp.status(successStatus).send(result);
                }
                else {
                    resp.status(404).send();
                }
            }
            catch (e) {
                console.log("Error in controller", e);
                resp.status(500).json({ message: "An unexpected Error has occoured.....", details: e.message });
            }
        };
    }
}
