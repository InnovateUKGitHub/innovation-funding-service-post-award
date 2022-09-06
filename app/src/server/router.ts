import { Router } from "express";
import csrf from "csurf";

import { healthRouter } from "@server/health";
import { router as apiRoutes } from "@server/apis";

import { configureFormRouter } from "@server/forms/formRouter";
import { NotFoundError } from "@shared/appError";
import { serverRender } from "@server/serverRender";
import { componentGuideRender } from "@server/componentGuideRender";

export const noAuthRouter = Router();

// Support routes
noAuthRouter.use("/api/health", healthRouter);

export const router = Router();

const csrfProtection = csrf();

// App routes
router.use("/api", apiRoutes);

// TODO: should scope this for dev access only (e.g. check for sso enabled)
router.use("/components", csrfProtection, componentGuideRender);

// Form posts
router.post("*", configureFormRouter(csrfProtection));
router.get("*", csrfProtection, (req, res) => serverRender(req, res));

// Fallback route
router.all("*", (req, res) => serverRender(req, res, new NotFoundError()));
