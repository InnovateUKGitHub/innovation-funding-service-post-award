import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";

const loggerSetupMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.locals.requestId = v4();

  next();
};

export { loggerSetupMiddleware };
