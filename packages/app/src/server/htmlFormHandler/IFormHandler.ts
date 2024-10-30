import express from "express";

export interface IFormHandler {
  readonly routePath: string | string[];

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
