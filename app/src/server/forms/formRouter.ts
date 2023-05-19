import express, { RequestHandler } from "express";

import { ProjectChangeRequestCreateFormHandler } from "@server/forms/projectChangeRequest/createProjectChangeRequestFormHandler";
import { ProjectChangeRequestAddTypeFormHandler } from "@server/forms/projectChangeRequest/projectChangeRequestAddTypeFormHandler";
import { ProjectChangeRequestItemDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentDeleteHandler";
import { ProjectChangeRequestItemDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemDocumentUploadHandler";
import { ProjectChangeRequestItemUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestItemUpdateHandler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentDeleteHandler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningDocumentUploadHandler";
import { ProjectChangeRequestReasoningUpdateHandler } from "@server/forms/projectChangeRequest/projectChangeRequestReasoningUpdateHandler";

import { ClaimDocumentsDeleteHandler } from "@server/forms/claimDocuments/claimDocumentsDeleteHandler";
import { ClaimDocumentsUploadHandler } from "@server/forms/claimDocuments/claimDocumentsUploadHandler";
import { ClaimReviewDocumentsDeleteHandler } from "@server/forms/claimDocuments/claimReviewDocumentsDeleteHandler";
import { ClaimReviewDocumentsUploadHandler } from "@server/forms/claimDocuments/claimReviewDocumentsUploadHandler";

import { ClaimSummaryFormHandler } from "@server/forms/claimSummaryFormHandler";
import { MonitoringReportPreparePeriodFormHandler } from "@server/forms/monitoringReport/monitoringReportPreparePeriodFormHandler";
import { PartnerDetailsEditFormHandler } from "@server/forms/partnerDetailsEditFormHandler";
import { OverheadDocumentsDeleteHandler } from "@server/forms/projectChangeRequest/spendProfile/overheadDocuments/overheadDocumentsDeleteHandler";
import { OverheadDocumentsUploadHandler } from "@server/forms/projectChangeRequest/spendProfile/overheadDocuments/overheadDocumentsUploadHandler";
import { ProjectChangeRequestSpendProfileAddCostHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileAddCostHandler";
import { ProjectChangeRequestSpendProfileCostsSummaryHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileCostsHandler";
import { ProjectChangeRequestSpendProfileDeleteCostHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileDeleteCostHandler";
import { ProjectChangeRequestSpendProfileEditCostHandler } from "@server/forms/projectChangeRequest/spendProfile/spendProfileEditCostHandler";
import { VirementCostsUpdateHandler } from "@server/forms/projectChangeRequest/virements/virementCostsUpdateHandler";
import { VirementLoanEditHandler } from "@server/forms/projectChangeRequest/virements/virementLoanEditHandler";
import { ProjectSetupFormHandler } from "@server/forms/projectSetupFormHandler";
import { configuration } from "../features/common";
import { serverRender } from "../serverRender";
import { BadRequestHandler } from "./badRequestHandler";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocument/claimDetailDocumentDeleteHandler";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocument/claimDetailDocumentUploadHandler";
import { ClaimForecastFormHandler } from "./claimForecastFormHandler";
import { DeveloperUserSwitcherHandler } from "./developerUserSwitcherHandler";
import { EditClaimLineItemsFormHandler } from "./editClaimLineItemsFormHandler";
import { IFormHandler } from "./formHandlerBase";
import { MonitoringReportCreateFormHandler } from "./monitoringReport/monitoringReportCreateFormHandler";
import { MonitoringReportDeleteFormHandler } from "./monitoringReport/monitoringReportDeleteFormHandler";
import { MonitoringReportPrepareFormHandler } from "./monitoringReport/monitoringReportPrepareFormHandler";
import { MonitoringReportSummaryFormHandler } from "./monitoringReport/monitoringReportSummaryFormHandler";
import { PrepareClaimFormHandler } from "./prepareClaimFormHandler";
import { ProjectChangeRequestDeleteFormHandler } from "./projectChangeRequest/deleteProjectChangeRequestFormHandler";
import { ProjectChangeRequestPrepareFormHandler } from "./projectChangeRequest/prepareProjectChangeRequestFormHandler";
import { ProjectChangeRequestReviewFormHandler } from "./projectChangeRequest/reviewProjectChangeRequestFormHandler";
import { VirementPartnerCostsUpdateHandler } from "./projectChangeRequest/virements/virementPartnerCostsUpdateHandler";
import { ProjectDocumentDeleteHandler } from "./ProjectDocumentDeleteHandler";
import { ProjectDocumentUploadHandler } from "./projectDocumentFormHandler";
import { UpdateForecastFormHandler } from "./updateForecastFormHandler";

import { upload } from "./diskStorage";
import { ProjectSetupPartnerPostcodeFormHandler } from "./projectSetupPartnerPostcodeFormHandler";
import { ProjectSetupSpendProfileFormHandler } from "./projectSetupSpendProfileFormHandler";
import { ReviewClaimFormHandler } from "./reviewClaimFormHandler";

import { BankSetupStatementDocumentDeleteHandler } from "./project/setup/BankSetupStatementDocumentDeleteHandler";
import { BankSetupStatementDocumentUploadHandler } from "./project/setup/BankSetupStatementDocumentUploadHandler";

import csurf from "csurf";
import { GraphQLSchema } from "graphql";
import { DeveloperPageCrasherHandler } from "./developerPageCrasherHandler";
import { DeveloperProjectCreatorHandler } from "./developerProjectCreatorHandler";
import { LoanRequestDocumentDeleteHandler, LoanRequestDocumentUploadHandler } from "./loan";
import { LoanRequestFormHandler } from "./loan/LoanRequestFormHandler";
import { ProjectSetupBankDetailsHandler } from "./project/setup/ProjectSetupBankDetailsHandler";
import { ProjectSetupBankDetailsVerifyHandler } from "./project/setup/ProjectSetupBankDetailsVerifyHandler";
import { ProjectSetupBankStatementHandler } from "./project/setup/ProjectSetupBankStatementHandler";

export const standardFormHandlers = [
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
] as const;

export const multiFileFormHandlers = [
  new ClaimDetailDocumentUploadHandler(),
  new ClaimDocumentsUploadHandler(),
  new ClaimReviewDocumentsUploadHandler(),
  new OverheadDocumentsUploadHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new ProjectChangeRequestItemDocumentUploadHandler(),
  new ProjectDocumentUploadHandler(),
  new BankSetupStatementDocumentUploadHandler(),
  new LoanRequestDocumentUploadHandler(),
] as const;

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
  ({ schema, csrfProtection }: { schema: GraphQLSchema; csrfProtection: ReturnType<typeof csurf> }) =>
  (handler: IFormHandler) =>
  (err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    csrfProtection(req, res, async () => {
      try {
        // You must await the handle, to transform promise rejections into regular errors.
        // This allows the try-catch block to catch any errors that occur instead of crashing the programme.
        await handler.handle({ err, req, res, next });
      } catch (err: unknown) {
        return serverRender({ schema })({ req, res, err, next });
      }
    });
  };

const handleError =
  ({ schema, csrfProtection }: { schema: GraphQLSchema; csrfProtection: ReturnType<typeof csurf> }) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    csrfProtection(req, res, () => {
      if (error) {
        serverRender({ schema })({ req, res, err: error, next });
      } else {
        next(error);
      }
    });
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

  for (const x of multiFileFormHandlers) {
    result.post(
      getRoute(x),
      ((req, res, next) => {
        // Capture any multer errors and pass them into our form handler.
        upload.array("attachment")(req, res, error => {
          handlePost({ schema, csrfProtection })(x)(error, req, res, next);
        });
      }) as RequestHandler,
      handleError({ schema, csrfProtection }),
    );
  }

  for (const x of standardFormHandlers) {
    result.post(
      getRoute(x),
      ((req, res, next) => handlePost({ schema, csrfProtection })(x)(undefined, req, res, next)) as RequestHandler,
      handleError({ schema, csrfProtection }),
    );
  }

  if (!configuration.sso.enabled) {
    for (const x of developerFormhandlers) {
      result.post(
        getRoute(x),
        ((req, res, next) => handlePost({ schema, csrfProtection })(x)(undefined, req, res, next)) as RequestHandler,
        handleError({ schema, csrfProtection }),
      );
    }
  }

  result.post(
    "*",
    ((req, res, next) =>
      handlePost({ schema, csrfProtection })(badRequestHandler)(undefined, req, res, next)) as RequestHandler,
    handleError({ schema, csrfProtection }),
  );

  return result;
};
