import express from "express";
import multer from "multer";
import { IFormHandler } from "./formHandlerBase";
import { ClaimForcastFormHandler } from "./claimForcastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";
import { ClaimDetailDocumentHandler } from "./claimDetailDocument";
import { ViewForecastFormHandler } from "./viewForecastFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";
import { ClaimDashboardDocumentDeleteHandler } from "./claimDashboardDocumentDeleteHandler";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const formRouter = express.Router();

const handlers: IFormHandler[] = [
  new ClaimForcastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new UpdateForecastFormHandler(),
  new ViewForecastFormHandler(),
  new ClaimDashboardDocumentDeleteHandler(),
  // TODO revisit how we set middleware
  new ClaimDetailDocumentHandler([upload.single("attachment")]),
  new HomeFormHandler(),
];

handlers.forEach(x => {
  formRouter.post(x.routePath, ...x.middleware, (req: express.Request, res: express.Response, next: express.NextFunction) => x.handle(req, res, next));
});
