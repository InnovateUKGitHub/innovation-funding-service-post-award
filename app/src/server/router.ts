import express from "express";
import csrf from "csurf";
import { serverRender } from "./serverRender";
import { componentGuideRender } from "./componentGuideRender";
import { router as apiRoutes } from "./apis";
import { configureFormRouter } from "./forms/formRouter";
import { NotFoundError } from "./features/common/appError";

export const router = express.Router();

const csrfProtection = csrf();

router.use("/api", apiRoutes);
router.use("/components", componentGuideRender);
/*form posts*/
router.post("*", configureFormRouter(csrfProtection));

router.get("*", csrfProtection, (req, res) => serverRender(req, res));

router.all("*", (req, res) => serverRender(req, res, new NotFoundError()));
