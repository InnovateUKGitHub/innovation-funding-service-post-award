import { ProjectChangeRequestItemDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentDeleteHandler";
import { ProjectChangeRequestItemDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentUploadHandler";
import { ProjectChangeRequestItemUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemUpdateHandler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentDeleteHandler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentUploadHandler";
import { ProjectChangeRequestReasoningUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningUpdateHandler";
import { BadRequestHandler } from "./badRequestHandler";
import express from "express";
import { ClaimForecastFormHandler } from "./claimForecastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";
import { ViewForecastFormHandler } from "./viewForecastFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";
import { IFormHandler } from "./formHandlerBase";
import { serverRender } from "../serverRender";
import { ClaimDashboardDocumentDeleteHandler } from "./claimDashboard/claimDashboardDocumentDeleteHandler";
import { ClaimDashboardDocumentUploadHandler } from "./claimDashboard/claimDashboardDocumentUploadHandler";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocument/claimDetailDocumentDeleteHandler";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocument/claimDetailDocumentUploadHandler";
import { ProjectDocumentUploadHandler } from "./projectDocumentFormHandler";
import { Configuration } from "../features/common";
import { MonitoringReportCreateFormHandler } from "./monitoringReportCreateFormHandler";
import { MonitoringReportDeleteFormHandler } from "./monitoringReportDeleteFormHandler";
import { MonitoringReportPrepareFormHandler } from "./monitoringReportPrepareFormHandler";
import { AllClaimDashboardDocumentUploadHandler } from "./allClaimsDashboard/allClaimsDashboardDocumentUploadHandler";
import { AllClaimDashboardDocumentDeleteHandler } from "./allClaimsDashboard/allClaimsDashboardDocumentDeleteHandler";
import { ProjectChangeRequestCreateFormHandler } from "@server/forms/projectChangeRequest/createProjectChangeRequestFormHandler";

export const formRouter = express.Router();

const handlers: IFormHandler[] = [
  new AllClaimDashboardDocumentUploadHandler(),
  new AllClaimDashboardDocumentDeleteHandler(),
  new ClaimForecastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new UpdateForecastFormHandler(),
  new ViewForecastFormHandler(),
  new ClaimDetailDocumentDeleteHandler(),
  new ClaimDetailDocumentUploadHandler(),
  new ClaimDashboardDocumentDeleteHandler(),
  new ClaimDashboardDocumentUploadHandler(),
  new MonitoringReportCreateFormHandler(),
  new MonitoringReportDeleteFormHandler(),
  new MonitoringReportPrepareFormHandler(),
  new ProjectChangeRequestCreateFormHandler(),
  new ProjectChangeRequestItemDocumentDeleteHandler(),
  new ProjectChangeRequestItemDocumentUploadHandler(),
  new ProjectChangeRequestItemUpdateHandler(),
  new ProjectChangeRequestReasoningDocumentDeleteHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new ProjectChangeRequestReasoningUpdateHandler(),
  new ProjectDocumentUploadHandler(),
];

// @TODO remove once we have local sso in dev
if (!Configuration.sso.enabled) {
  handlers.push(new HomeFormHandler());
}

handlers.push(new BadRequestHandler());

handlers.forEach(x => {
  formRouter.post(x.routePath, ...x.middleware, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await x.handle(req, res, next);
    } catch (e) {
      console.log(e);
      return serverRender(req, res, e);
    }
  });
});
