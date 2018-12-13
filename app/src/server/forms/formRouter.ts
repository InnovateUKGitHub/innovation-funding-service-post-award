import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { ClaimForcastFormHandler } from "./claimForcastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";

export const formRouter = express.Router();

const handlers: IFormHandler[] = [
  new ClaimForcastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new HomeFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
];

handlers.forEach(x => {
  formRouter.post(x.routePath, async (req: express.Request, res: express.Response) => x.handle(req, res));
});
