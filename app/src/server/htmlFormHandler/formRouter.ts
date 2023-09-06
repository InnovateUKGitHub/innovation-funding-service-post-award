import { configuration } from "@server/features/common/config";
import { IFormHandler } from "@server/htmlFormHandler/formHandlerBase";
import csurf from "csurf";
import express, { RequestHandler } from "express";
import { GraphQLSchema } from "graphql";
import { serverRender } from "../serverRender";
import { upload } from "./diskStorage";
import { DeveloperPageCrasherHandler } from "./handlers/developer/crash/developerPageCrasherHandler";
import { DeveloperProjectCreatorHandler } from "./handlers/developer/projectcreator/developerProjectCreatorHandler";
import { DeveloperUserSwitcherHandler } from "./handlers/developer/userswitcher/developerUserSwitcherHandler";
import { LoanRequestDocumentDeleteHandler } from "./handlers/loans/[projectId]/[loanId]/LoanRequestDocumentDeleteHandler";
import { LoanRequestDocumentUploadHandler } from "./handlers/loans/[projectId]/[loanId]/LoanRequestDocumentUploadHandler";
import { LoanRequestFormHandler } from "./handlers/loans/[projectId]/[loanId]/LoanRequestFormHandler";
import { ClaimForecastFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/forecast/[periodId]/claimForecastFormHandler";
import { ClaimSummaryFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/forecast/[periodId]/summary/claimSummaryFormHandler";
import { ClaimDetailDocumentDeleteHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/costs/[costCategoryId]/documents/claimDetailDocumentDeleteHandler";
import { ClaimDetailDocumentUploadHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/costs/[costCategoryId]/documents/claimDetailDocumentUploadHandler";
import { EditClaimLineItemsFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/costs/[costCategoryId]/editClaimLineItemsFormHandler";
import { ClaimLevelDocumentShareDeleteHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/documents/ClaimLevelDocumentShareDeleteHandler.handler";
import { ClaimLevelDocumentShareUploadHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/documents/ClaimLevelDocumentShareUploadHandler.handler";
import { PrepareClaimFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/prepareClaimFormHandler";
import { ClaimReviewDocumentsDeleteHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/review/[periodId]/claimReviewDocumentsDeleteHandler";
import { ClaimReviewDocumentsUploadHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/review/[periodId]/claimReviewDocumentsUploadHandler";
import { ReviewClaimFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/review/[periodId]/reviewClaimFormHandler";
import { UpdateForecastFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/updateForecast/[periodId]/updateForecastFormHandler";
import { ProjectLevelDocumentShareDeleteHandler } from "./handlers/projects/[projectId]/documents/ProjectLevelDocumentShareDeleteHandler.handler";
import { ProjectLevelDocumentShareUploadHandler } from "./handlers/projects/[projectId]/documents/ProjectLevelDocumentShareUploadHandler.handler";
import { MonitoringReportCreateFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/create/monitoringReportCreateFormHandler";
import { MonitoringReportDeleteFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/delete/monitoringReportDeleteFormHandler";
import { MonitoringReportPreparePeriodFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/prepare-period/monitoringReportPeriodFormHandler";
import { MonitoringReportPrepareFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/[mode]/monitoringReportPrepareFormHandler";
import { MonitoringReportSummaryFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/[mode]/monitoringReportSummaryFormHandler";
import { ProjectChangeRequestCreateHandler } from "./handlers/projects/[projectId]/pcrs/create/ProjectChangeRequestCreateHandler.handler";
import { ProjectChangeRequestDeleteFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/delete/deleteProjectChangeRequestFormHandler";
import { ProjectChangeRequestAddTypeHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/add/ProjectChangeRequestAddTypeHandler.handler";
// import { ProjectChangeRequestAddTypeFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/add/projectChangeRequestAddTypeFormHandler";
import { VirementCostsUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/financial/[partnerId]/virementCostsUpdateHandler";
import { VirementPartnerCostsUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/partner/virementPartnerCostsUpdateHandler";
import { ProjectChangeRequestItemDocumentDeleteHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/projectChangeRequestItemDocumentDeleteHandler";
import { ProjectChangeRequestItemDocumentUploadHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/projectChangeRequestItemDocumentUploadHandler";
import { ProjectChangeRequestItemUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/projectChangeRequestItemUpdateHandler";
import { OverheadDocumentsDeleteHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/documents/overheadDocumentsDeleteHandler";
import { OverheadDocumentsUploadHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/documents/overheadDocumentsUploadHandler";
import { ProjectChangeRequestSpendProfileAddCostHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/spendProfileAddCostHandler";
import { ProjectChangeRequestSpendProfileDeleteCostHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileDeleteCostHandler";
import { ProjectChangeRequestSpendProfileEditCostHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileEditCostHandler";
import { ProjectChangeRequestSpendProfileCostsSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/spendProfileCostsHandler";
import { VirementLoanEditHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/virementLoanEditHandler";
import { ProjectChangeRequestPrepareFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/prepareProjectChangeRequestFormHandler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/reasoning/projectChangeRequestReasoningDocumentDeleteHandler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/reasoning/projectChangeRequestReasoningDocumentUploadHandler";
import { ProjectChangeRequestReasoningUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/reasoning/projectChangeRequestReasoningUpdateHandler";
import { ProjectChangeRequestReviewFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/review/reviewProjectChangeRequestFormHandler";
import { ProjectSetupPartnerPostcodeFormHandler } from "./handlers/projects/[projectId]/postcode/[partnerId]/projectSetupPartnerPostcodeFormHandler";
import { ProjectSetupBankDetailsVerifyHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-details-verify/ProjectSetupBankDetailsVerifyHandler";
import { ProjectSetupBankDetailsHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-details/ProjectSetupBankDetailsHandler";
import { BankSetupStatementDocumentDeleteHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-statement/BankSetupStatementDocumentDeleteHandler";
import { BankSetupStatementDocumentUploadHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-statement/BankSetupStatementDocumentUploadHandler";
import { ProjectSetupBankStatementHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-statement/ProjectSetupBankStatementHandler";
import { PartnerDetailsEditFormHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/project-location/partnerDetailsEditFormHandler";
import { ProjectSetupFormHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/projectSetupFormHandler";
import { ProjectSetupSpendProfileFormHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/projectSetupSpendProfile/projectSetupSpendProfileFormHandler";
import { PostFormHandleHandler } from "./postFormHandleHandler";

export const standardFormHandlers = [
  new ClaimForecastFormHandler(),
  new EditClaimLineItemsFormHandler(),
  new ClaimSummaryFormHandler(),
  new PrepareClaimFormHandler(),
  new ReviewClaimFormHandler(),
  new UpdateForecastFormHandler(),
  new ClaimDetailDocumentDeleteHandler(),
  new ClaimReviewDocumentsDeleteHandler(),
  new MonitoringReportCreateFormHandler(),
  new MonitoringReportDeleteFormHandler(),
  new MonitoringReportPreparePeriodFormHandler(),
  new MonitoringReportSummaryFormHandler(),
  // MonitoringReportPrepareFormHandler must be after other MonitoringReport handlers
  // This is because the handler uses `:mode` to capture "view"/"prepare" state, but may miscatch "prepare-period" as well.
  new MonitoringReportPrepareFormHandler(),
  new OverheadDocumentsDeleteHandler(),
  new LoanRequestFormHandler(),
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

  // Zod
  new ProjectLevelDocumentShareDeleteHandler(),
  new ClaimLevelDocumentShareDeleteHandler(),
  new ProjectChangeRequestCreateHandler(),
  new ProjectChangeRequestAddTypeHandler(),
] as const;

export const multiFileFormHandlers = [
  new ClaimDetailDocumentUploadHandler(),
  new ClaimReviewDocumentsUploadHandler(),
  new OverheadDocumentsUploadHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new ProjectChangeRequestItemDocumentUploadHandler(),
  new BankSetupStatementDocumentUploadHandler(),
  new LoanRequestDocumentUploadHandler(),
] as const;

export const developerFormHandlers = [
  new DeveloperUserSwitcherHandler(),
  new DeveloperProjectCreatorHandler(),
  new DeveloperPageCrasherHandler(),
] as const;

export const zodFormHandlers = [
  new ProjectLevelDocumentShareUploadHandler(),
  new ClaimLevelDocumentShareUploadHandler(),
];

const getRoute = (handler: IFormHandler) => {
  return handler.routePath;
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
  const finalHandler = new PostFormHandleHandler({ schema });

  for (const x of zodFormHandlers) {
    result.post(
      getRoute(x),
      ((req, res, next) => {
        // Capture any multer errors and pass them into our form handler.
        upload.array("files")(req, res, error => {
          handlePost({ schema, csrfProtection })(x)(error, req, res, next);
        });
      }) as RequestHandler,
      handleError({ schema, csrfProtection }),
    );
  }

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
    for (const x of developerFormHandlers) {
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
      handlePost({ schema, csrfProtection })(finalHandler)(undefined, req, res, next)) as RequestHandler,
    handleError({ schema, csrfProtection }),
  );

  return result;
};
