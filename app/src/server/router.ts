import express, { NextFunction, Request, Response } from "express";
import { serverRender } from "./serverRender";
import { componentGuideRender } from "./componentGuideRender";
import { router as apiRoutes } from "./apis";
import { formRouter } from "./forms/formRouter";
import { NotFoundError } from "./features/common/appError";

export const router = express.Router();

const cacheControl = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  return next();
};

router.use("/api", cacheControl, apiRoutes);
router.use("/components", componentGuideRender);
/*form posts*/
router.post("*", formRouter);

router.get("*", (req, res) => serverRender(req, res));

router.all("*", (req, res) => serverRender(req, res, new NotFoundError()));
