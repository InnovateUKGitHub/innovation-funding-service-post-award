import express, { RequestHandler } from "express";

import { ProjectChangeRequestItemDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentDeleteHandler";
import { ProjectChangeRequestItemUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemUpdateHandler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentDeleteHandler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentUploadHandler";
import { ProjectChangeRequestReasoningUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningUpdateHandler";
import { ProjectChangeRequestCreateFormHandler } from "@server/forms/projectChangeRequest/createProjectChangeRequestFormHandler";
import { ProjectChangeRequestAddTypeFormHandler } from "@server/forms/projectChangeRequest/projectChangeRequestAddTypeFormHandler";
import { ProjectChangeRequestItemDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentUploadHandler";

import { ClaimDocumentsDeleteHandler } from "@server/forms/claimDocuments/claimDocumentsDeleteHandler";
import { ClaimDocumentsUploadHandler } from "@server/forms/claimDocuments/claimDocumentsUploadHandler";
import { ClaimReviewDocumentsDeleteHandler } from "@server/forms/claimDocuments/claimReviewDocumentsDeleteHandler";
import { ClaimReviewDocumentsUploadHandler } from "@server/forms/claimDocuments/claimReviewDocumentsUploadHandler";

import { ClaimSummaryFormHandler } from "@server/forms/claimSummaryFormHandler";
import { MonitoringReportPreparePeriodFormHandler } from "@server/forms/monitoringReport/monitoringReportPreparePeriodFormHandler";
import { VirementCostsUpdateHandler } from "@server/forms/projectChangeRequest/virements/virementCostsUpdateHandler";
import { VirementLoanEditHandler } from "@server/forms/projectChangeRequest/virements/virementLoanEditHandler";
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
import { configuration } from "../features/common";
import { ProjectChangeRequestReviewFormHandler } from "./projectChangeRequest/reviewProjectChangeRequestFormHandler";
import { ProjectChangeRequestPrepareFormHandler } from "./projectChangeRequest/prepareProjectChangeRequestFormHandler";
import { ProjectChangeRequestDeleteFormHandler } from "./projectChangeRequest/deleteProjectChangeRequestFormHandler";
import { BadRequestHandler } from "./badRequestHandler";
import { ClaimForecastFormHandler } from "./claimForecastFormHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { DeveloperUserSwitcherHandler } from "./developerUserSwitcherHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";
import {
  IFormHandler,
  MultipleFileFormHandlerBase,
  SingleFileFormHandlerBase,
  StandardFormHandlerBase,
} from "./formHandlerBase";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocument/claimDetailDocumentDeleteHandler";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocument/claimDetailDocumentUploadHandler";
import { ProjectDocumentDeleteHandler } from "./ProjectDocumentDeleteHandler";
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

import { BankSetupStatementDocumentUploadHandler } from "./project/setup/BankSetupStatementDocumentUploadHandler";
import { BankSetupStatementDocumentDeleteHandler } from "./project/setup/BankSetupStatementDocumentDeleteHandler";

import { LoanRequestDocumentDeleteHandler, LoanRequestDocumentUploadHandler } from "./loan";
import { LoanRequestFormHandler } from "./loan/LoanRequestFormHandler";
import { ProjectSetupBankDetailsHandler } from "./project/setup/ProjectSetupBankDetailsHandler";
import { ProjectSetupBankDetailsVerifyHandler } from "./project/setup/ProjectSetupBankDetailsVerifyHandler";
import { ProjectSetupBankStatementHandler } from "./project/setup/ProjectSetupBankStatementHandler";
import { GraphQLSchema } from "graphql";
import { DeveloperProjectCreatorHandler } from "./developerProjectCreatorHandler";
import { DeveloperPageCrasherHandler } from "./developerPageCrasherHandler";

export const standardFormHandlers: StandardFormHandlerBase<AnyObject, EditorStateKeys>[] = [
  new ClaimForecastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new ClaimSummaryFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new UpdateForecastFormHandler(),
  new ClaimDetailDocumentDeleteHandler(),
  new ClaimDocumentsDeleteHandler(),
  new ClaimReviewDocumentsDeleteHandler(),
  new MonitoringReportCreateFormHandler(),
  new MonitoringReportDeleteFormHandler(),
  new MonitoringReportPrepareFormHandler(),
  new MonitoringReportPreparePeriodFormHandler(),
  new MonitoringReportSummaryFormHandler(),
  new OverheadDocumentsDeleteHandler(),
  new LoanRequestFormHandler(),
  new ProjectDocumentDeleteHandler(),
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
  new VirementLoanEditHandler(),
  new VirementPartnerCostsUpdateHandler(),
  new ProjectSetupFormHandler(),
  new PartnerDetailsEditFormHandler(),
  new ProjectSetupSpendProfileFormHandler(),
  new ProjectSetupPartnerPostcodeFormHandler(),
  new BankSetupStatementDocumentDeleteHandler(),
  new ProjectSetupBankDetailsHandler(),
  new ProjectSetupBankDetailsVerifyHandler(),
  new ProjectSetupBankStatementHandler(),
  new LoanRequestDocumentDeleteHandler(),
];

export const singleFileFormHandlers: SingleFileFormHandlerBase<AnyObject, EditorStateKeys>[] = [];

export const multiFileFormHandlers: MultipleFileFormHandlerBase<AnyObject, EditorStateKeys>[] = [
  new ClaimDetailDocumentUploadHandler(),
  new ClaimDocumentsUploadHandler(),
  new ClaimReviewDocumentsUploadHandler(),
  new OverheadDocumentsUploadHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new ProjectChangeRequestItemDocumentUploadHandler(),
  new ProjectDocumentUploadHandler(),
  new BankSetupStatementDocumentUploadHandler(),
  new LoanRequestDocumentUploadHandler(),
];

export const developerFormhandlers = [
  new DeveloperUserSwitcherHandler(),
  new DeveloperProjectCreatorHandler(),
  new DeveloperPageCrasherHandler(),
] as const;

const getRoute = (handler: IFormHandler) => {
  // map router 5 to express syntax - remove < & >
  return handler.routePath.replace(/(<|>)/g, "");
};

const handlePost =
  ({ schema }: { schema: GraphQLSchema }) =>
  (handler: IFormHandler) =>
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await handler.handle(req, res, next);
    } catch (err: unknown) {
      return serverRender({ schema })({ req, res, err, next });
    }
  };

const handleError =
  ({ schema }: { schema: GraphQLSchema }) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (error) {
      serverRender({ schema })({ req, res, err: error, next });
    } else {
      next(error);
    }
  };

export const configureFormRouter = ({
  schema,
  csrfProtection,
}: {
  schema: GraphQLSchema;
  csrfProtection: RequestHandler;
}) => {
  const result = express.Router();
  const badRequestHandler = new BadRequestHandler();

  singleFileFormHandlers.forEach(x => {
    result.post(
      getRoute(x),
      upload.single("attachment"),
      csrfProtection,
      handlePost({ schema })(x),
      handleError({ schema }),
    );
  });

  multiFileFormHandlers.forEach(x => {
    result.post(
      getRoute(x),
      upload.array("attachment"),
      csrfProtection,
      handlePost({ schema })(x),
      handleError({ schema }),
    );
  });

  standardFormHandlers.forEach(x => {
    result.post(getRoute(x), csrfProtection, handlePost({ schema })(x), handleError({ schema }));
  });

  if (!configuration.sso.enabled) {
    for (const x of developerFormhandlers) {
      result.post(getRoute(x), handlePost({ schema })(x), handleError({ schema }));
    }
  }

  result.post("*", badRequestHandler.handle, handleError({ schema }));

  return result;
};
