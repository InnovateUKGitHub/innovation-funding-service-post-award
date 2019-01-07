import express from "express";
import { serverRender } from "./serverRender";
import { componentGuideRender } from "./componentGuideRender";
import { router as apiRoutes } from "./apis";
import { formRouter } from "./forms/formRouter";

export const router = express.Router();

router.use("/api", apiRoutes);
router.use("/components", componentGuideRender);
/*form posts*/
router.post("*", formRouter);

router.get("*", (req, res) => serverRender(req, res));

router.get("*", (req, res) => res.status(404).send("Not found"));
