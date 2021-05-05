import { ProjectChangeRequestItemDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentDeleteHandler";
import { ProjectChangeRequestItemUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemUpdateHandler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentDeleteHandler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentUploadHandler";
import { ProjectChangeRequestReasoningUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningUpdateHandler";
import { ProjectChangeRequestCreateFormHandler } from "@server/forms/projectChangeRequest/createProjectChangeRequestFormHandler";
import { ProjectChangeRequestAddTypeFormHandler } from "@server/forms/projectChangeRequest/projectChangeRequestAddTypeFormHandler";
import express, { RequestHandler } from "express";
import { ProjectChangeRequestItemDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentUploadHandler";
import { ClaimDocumentsDeleteHandler } from "@server/forms/claimDocuments/claimDocumentsDeleteHandler";
import { ClaimDocumentsUploadHandler } from "@server/forms/claimDocuments/claimDocumentsUploadHandler";
import { ClaimSummaryFormHandler } from "@server/forms/claimSummaryFormHandler";
import { MonitoringReportPreparePeriodFormHandler } from "@server/forms/monitoringReport/monitoringReportPreparePeriodFormHandler";
import { VirementCostsUpdateHandler } from "@server/forms/projectChangeRequest/virements/virementCostsUpdateHandler";
import { EditorStateKeys } from "@ui/redux";
import { ProjectChangeRequestSpendProfileAddCostHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileAddCostHandler";
import { ProjectChangeRequestSpendProfileCostsSummaryHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileCostsHandler";
import { ProjectChangeRequestSpendProfileDeleteCostHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileDeleteCostHandler";
import { ProjectChangeRequestSpendProfileEditCostHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileEditCostHandler";
import { ProjectSetupFormHandler } from "@server/forms/projectSetupFormHandler";
import { PartnerDetailsEditFormHandler } from "@server/forms/partnerDetailsEditFormHandler";
import { OverheadDocumentsUploadHandler } from "@server/forms/projectChangeRequest/spendProfile/overheadDocuments/overheadDocumentsUploadHandler";
import { OverheadDocumentsDeleteHandler } from "@server/forms/projectChangeRequest/spendProfile/overheadDocuments/overheadDocumentsDeleteHandler";
import { serverRender } from "../serverRender";
import { Configuration } from "../features/common";
import { ProjectChangeRequestReviewFormHandler } from "./projectChangeRequest/reviewProjectChangeRequestFormHandler";
import { ProjectChangeRequestPrepareFormHandler } from "./projectChangeRequest/prepareProjectChangeRequestFormHandler";
import { ProjectChangeRequestDeleteFormHandler } from "./projectChangeRequest/deleteProjectChangeRequestFormHandler";
import { BadRequestHandler } from "./badRequestHandler";
import { ClaimForecastFormHandler } from "./claimForecastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { HomeFormHandler } from "./homeFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";
import { IFormHandler, MultipleFileFormHandlerBase, SingleFileFormHandlerBase, StandardFormHandlerBase } from "./formHandlerBase";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocument/claimDetailDocumentDeleteHandler";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocument/claimDetailDocumentUploadHandler";
import { ProjectDocumentUploadHandler } from "./projectDocumentFormHandler";
import { MonitoringReportCreateFormHandler } from "./monitoringReport/monitoringReportCreateFormHandler";
import { MonitoringReportDeleteFormHandler } from "./monitoringReport/monitoringReportDeleteFormHandler";
import { MonitoringReportPrepareFormHandler } from "./monitoringReport/monitoringReportPrepareFormHandler";
import { MonitoringReportSummaryFormHandler } from "./monitoringReport/monitoringReportSummaryFormHandler";
import { VirementPartnerCostsUpdateHandler } from "./projectChangeRequest/virements/virementPartnerCostsUpdateHandler";

import { upload } from "./memoryStorage";
import { ProjectSetupSpendProfileFormHandler } from "./projectSetupSpendProfileFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";
import { ProjectSetupPartnerPostcodeFormHandler } from "./projectSetupPartnerPostcodeFormHandler";

export const standardFormHandlers: (StandardFormHandlerBase<{}, EditorStateKeys>)[] = [
  new ClaimForecastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new ClaimSummaryFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new UpdateForecastFormHandler(),
  new ClaimDetailDocumentDeleteHandler(),
  new ClaimDocumentsDeleteHandler(),
  new MonitoringReportCreateFormHandler(),
  new MonitoringReportDeleteFormHandler(),
  new MonitoringReportPrepareFormHandler(),
  new MonitoringReportPreparePeriodFormHandler(),
  new MonitoringReportSummaryFormHandler(),
  new OverheadDocumentsDeleteHandler(),
  new ProjectChangeRequestAddTypeFormHandler(),
  new ProjectChangeRequestCreateFormHandler(),
  new ProjectChangeRequestDeleteFormHandler(),
  // ProjectChangeRequestReasoningUpdateHandler should be before ProjectChangeRequestItemUpdateHandler
  new ProjectChangeRequestReasoningUpdateHandler(),
  new ProjectChangeRequestPrepareFormHandler(),
  new ProjectChangeRequestReviewFormHandler(),
  new ProjectChangeRequestReasoningDocumentDeleteHandler(),
  new ProjectChangeRequestItemUpdateHandler(),
  new ProjectChangeRequestSpendProfileAddCostHandler(),
  new ProjectChangeRequestSpendProfileDeleteCostHandler(),
  new ProjectChangeRequestSpendProfileEditCostHandler(),
  new ProjectChangeRequestSpendProfileCostsSummaryHandler(),
  new ProjectChangeRequestItemDocumentDeleteHandler(),
  new VirementCostsUpdateHandler(),
  new VirementPartnerCostsUpdateHandler(),
  new ProjectSetupFormHandler(),
  new PartnerDetailsEditFormHandler(),
  new ProjectSetupSpendProfileFormHandler(),
  new ProjectSetupPartnerPostcodeFormHandler(),
];

export const singleFileFormHandlers: (SingleFileFormHandlerBase<{}, EditorStateKeys>)[] = [
];

export const multiFileFormHandlers: (MultipleFileFormHandlerBase<{}, EditorStateKeys>)[] = [
  new ClaimDetailDocumentUploadHandler(),
  new ClaimDocumentsUploadHandler(),
  new OverheadDocumentsUploadHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new ProjectChangeRequestItemDocumentUploadHandler(),
  new ProjectDocumentUploadHandler(),
];

const getRoute = (handler: IFormHandler) => {
  // map router 5 to express syntax - remove < & >
  return handler.routePath.replace(/(<|>)/g, "");
};

const handlePost = (handler: IFormHandler) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    await handler.handle(req, res, next);
  } catch (e) {
    console.log(e);
    return serverRender(req, res, e);
  }
};

const handleError = (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error) {
    serverRender(req, res, error);
  } else {
    next();
  }
};

export const configureFormRouter = (csrfProtection: RequestHandler) => {
  const result = express.Router();
  const badRequestHandler = new BadRequestHandler();

  singleFileFormHandlers.forEach(x => {
    result.post(getRoute(x), upload.single("attachment"), csrfProtection, handlePost(x), handleError);
  });

  multiFileFormHandlers.forEach(x => {
    result.post(getRoute(x), upload.array("attachment"), csrfProtection, handlePost(x), handleError);
  });

  standardFormHandlers.forEach(x => {
    result.post(getRoute(x), csrfProtection, handlePost(x), handleError);
  });

  if (!Configuration.sso.enabled) {
    const homeFormHandler = new HomeFormHandler();
    result.post(getRoute(homeFormHandler), csrfProtection, homeFormHandler.handle, handleError);
  }

  result.post("*", badRequestHandler.handle, handleError);

  return result;
};
