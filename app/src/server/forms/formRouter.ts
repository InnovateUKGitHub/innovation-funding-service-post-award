import express from "express";
import multer from "multer";
import { IFormHandler } from "./formHandlerBase";
import { ClaimForcastFormHandler } from "./claimForcastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";
import { ClaimDetailFormHandler } from "./claimDetailFormHandler";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const formRouter = express.Router();

const handlers: IFormHandler[] = [
  new ClaimForcastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new HomeFormHandler(),
];

handlers.forEach(x => {
  formRouter.post(x.routePath, async (req: express.Request, res: express.Response) => x.handle(req, res));
});

const claimDetailFormHandler = new ClaimDetailFormHandler();
formRouter.post(claimDetailFormHandler.routePath, upload.single("attachment"), async (req: express.Request, res: express.Response) => claimDetailFormHandler.handle(req, res));
