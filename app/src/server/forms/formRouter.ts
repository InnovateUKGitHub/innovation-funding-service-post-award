import { ProjectChangeRequestItemDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentDeleteHandler";
import { ProjectChangeRequestItemDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentUploadHandler";
import { ProjectChangeRequestItemUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemUpdateHandler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentDeleteHandler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentUploadHandler";
import { ProjectChangeRequestReasoningUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningUpdateHandler";
import { ProjectChangeRequestCreateFormHandler } from "@server/forms/projectChangeRequest/createProjectChangeRequestFormHandler";
import { ProjectChangeRequestReviewFormHandler } from "./projectChangeRequest/reviewProjectChangeRequestFormHandler";
import { ProjectChangeRequestPrepareFormHandler } from "./projectChangeRequest/prepareProjectChangeRequestFormHandler";
import { ProjectChangeRequestDeleteFormHandler } from "./projectChangeRequest/deleteProjectChangeRequestFormHandler";
import { ProjectChangeRequestAddTypeFormHandler } from "@server/forms/projectChangeRequest/projectChangeRequestAddTypeFormHandler";
import { BadRequestHandler } from "./badRequestHandler";
import express from "express";
import { ClaimForecastFormHandler } from "./claimForecastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";
import { IFormHandler } from "./formHandlerBase";
import { serverRender } from "../serverRender";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocument/claimDetailDocumentDeleteHandler";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocument/claimDetailDocumentUploadHandler";
import { ProjectDocumentUploadHandler } from "./projectDocumentFormHandler";
import { Configuration } from "../features/common";
import { MonitoringReportCreateFormHandler } from "./monitoringReport/monitoringReportCreateFormHandler";
import { MonitoringReportDeleteFormHandler } from "./monitoringReport/monitoringReportDeleteFormHandler";
import { MonitoringReportPrepareFormHandler } from "./monitoringReport/monitoringReportPrepareFormHandler";
import { MonitoringReportSummaryFormHandler } from "./monitoringReport/monitoringReportSummaryFormHandler";
import { ClaimDocumentsDeleteHandler } from "@server/forms/claimDocuments/claimDocumentsDeleteHandler";
import { ClaimDocumentsUploadHandler } from "@server/forms/claimDocuments/claimDocumentsUploadHandler";
import { ClaimSummaryFormHandler } from "@server/forms/claimSummaryFormHandler";
import { MonitoringReportPreparePeriodFormHandler } from "@server/forms/monitoringReport/monitoringReportPreparePeriodFormHandler";
import { VirementCostsUpdateHandler } from "@server/forms/projectChangeRequest/virements/virementCostsUpdateHandler";
import { VirementPartnerCostsUpdateHandler } from "./projectChangeRequest/virements/virementPartnerCostsUpdateHandler";

export const formRouter = express.Router();

const handlers: IFormHandler[] = [
  new ClaimForecastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new ClaimSummaryFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new UpdateForecastFormHandler(),
  new ClaimDetailDocumentDeleteHandler(),
  new ClaimDetailDocumentUploadHandler(),
  new ClaimDocumentsDeleteHandler(),
  new ClaimDocumentsUploadHandler(),
  new MonitoringReportCreateFormHandler(),
  new MonitoringReportDeleteFormHandler(),
  new MonitoringReportPrepareFormHandler(),
  new MonitoringReportPreparePeriodFormHandler(),
  new MonitoringReportSummaryFormHandler(),
  new ProjectChangeRequestAddTypeFormHandler(),
  new ProjectChangeRequestCreateFormHandler(),
  new ProjectChangeRequestDeleteFormHandler(),
  // ProjectChangeRequestReasoningUpdateHandler should be before ProjectChangeRequestItemUpdateHandler
  new ProjectChangeRequestReasoningUpdateHandler(),
  new ProjectChangeRequestPrepareFormHandler(),
  new ProjectChangeRequestReviewFormHandler(),
  new ProjectChangeRequestReasoningDocumentDeleteHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new ProjectChangeRequestItemUpdateHandler(),
  new ProjectChangeRequestItemDocumentDeleteHandler(),
  new ProjectChangeRequestItemDocumentUploadHandler(),
  new VirementCostsUpdateHandler(),
  new VirementPartnerCostsUpdateHandler(),
  new ProjectDocumentUploadHandler(),
];

// @TODO remove once we have local sso in dev
if (!Configuration.sso.enabled) {
  handlers.push(new HomeFormHandler());
}

handlers.push(new BadRequestHandler());

const getRoute = (handler: IFormHandler) => {
  // map router 5 to express syntax - remove < & >
  return handler.routePath.replace(/(<|>)/g, "");
};

handlers.forEach(x => {
  formRouter.post(getRoute(x), ...x.middleware, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await x.handle(req, res, next);
    } catch (e) {
      console.log(e);
      return serverRender(req, res, e);
    }
  });
});
