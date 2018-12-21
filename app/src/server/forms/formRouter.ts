import express from "express";
import multer from "multer";
import { IFormHandler } from "./formHandlerBase";
import { ClaimForcastFormHandler } from "./claimForcastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocumentUploadHandler";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocumentDeleteHandler";
import { ViewForecastFormHandler } from "./viewForecastFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";

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
  new ClaimDetailDocumentDeleteHandler(),
  // TODO revisit how we set middleware
  new ClaimDetailDocumentUploadHandler([upload.single("attachment")]),

  new HomeFormHandler(),
];

handlers.forEach(x => {
  formRouter.post(x.routePath, ...x.middleware, async (req: express.Request, res: express.Response, next: express.NextFunction) => x.handle(req, res, next));
});
