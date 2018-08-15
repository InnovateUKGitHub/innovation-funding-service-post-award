import { Router } from "express-serve-static-core";
import { IContext } from "../features/common/context";
import contextProvider from "../features/common/contextProvider";
import express, { Request, Response, NextFunction } from 'express';

export abstract class ControllerBase<T>
{
    public readonly router: Router;

    constructor(public readonly path: string){
        this.router = express.Router();
    }

    protected getCustom<TParams, TResponse>(path: string, getParams: (params:any, query:any) => TParams, run: (params: TParams) => Promise<TResponse>) {
        this.router.get(path, this.executeMethod(200, getParams, run));
        return this;
    }

    protected getItem<TParams>(path:string, getParams: (params:any, query:any) => TParams, run: (params: TParams) => Promise<T>){
        return this.getCustom<TParams, T>(path, getParams, run);    
    }

    
    protected getItems<TParams>(path:string, getParams: (params:any, query:any) => TParams, run: (params: TParams) => Promise<T[]>){
        return this.getCustom<TParams, T[]>(path, getParams, run);    
    }

    protected postCustom<TParams, TResponse>(path: string, getParams: (params:any, query:any) => TParams, run: (params: TParams) => Promise<TResponse>) {
        this.router.post(path, this.executeMethod(204, getParams, run));
        return this;
    }

    protected getEmpty<TParams>(path: string, getParams: (params:any, query:any) => TParams, run: (params: TParams) => Promise<void>) {
        this.router.get(path, this.executeMethod<TParams, void>(204, getParams, run));
        return this;
    }

    private executeMethod<TParams, TResponse>(successStatus: number, getParams: (params:any, query:any) => TParams, run: (params: TParams) => Promise<TResponse>){
        return async (req: Request, resp: Response, next: NextFunction) => {
            try 
            {
                let p = getParams(req.params || {}, req.query || {});
                //let context = contextProvider.start();
                let result = await run(p);
                resp.status(successStatus).send(result); 
            }
            catch(e)
            {
                next(e);
            }
        }
    }
}