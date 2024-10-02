import { configuration } from "@server/features/common/config";
import { IFormHandler } from "@server/htmlFormHandler/formHandlerBase";
import csurf from "csurf";
import express, { RequestHandler } from "express";
import { GraphQLSchema } from "graphql";
import { serverRender } from "../serverRender";
import { upload } from "./diskStorage";
import { DeveloperPageCrasherHandler } from "./handlers/developer/crash/developerPageCrasher.handler";
import { DeveloperUserSwitcherHandler } from "./handlers/developer/userswitcher/developerUserSwitcher.handler";
import { LoanRequestDocumentDeleteHandler } from "./handlers/loans/[projectId]/[loanId]/LoanRequestDocumentDelete.handler";
import { LoanRequestDocumentUploadHandler } from "./handlers/loans/[projectId]/[loanId]/LoanRequestDocumentUpload.handler";
import { LoanRequestFormHandler } from "./handlers/loans/[projectId]/[loanId]/LoanRequestForm.handler";
import { ClaimSummaryFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/forecast/[periodId]/summary/claimSummaryFormHandler";
import { EditClaimLineItemsFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/costs/[costCategoryId]/EditClaimLineItemsForm.handler";
import { ClaimLevelDocumentShareDeleteHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/documents/ClaimLevelDocumentShareDelete.handler";
import { ClaimLevelDocumentShareUploadHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/documents/ClaimLevelDocumentShareUpload.handler";
import { PrepareClaimFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/prepareClaimFormHandler";
import { ClaimReviewLevelFormHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/review/[periodId]/ClaimReviewLevelForm.handler";
import { ProjectLevelDocumentShareDeleteHandler } from "./handlers/projects/[projectId]/documents/ProjectLevelDocumentShareDelete.handler";
import { ProjectLevelDocumentShareUploadHandler } from "./handlers/projects/[projectId]/documents/ProjectLevelDocumentShareUpload.handler";
import { MonitoringReportCreateFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/create/monitoringReportCreateForm.handler";
import { MonitoringReportDeleteFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/delete/monitoringReportDeleteForm.handler";
import { MonitoringReportPreparePeriodFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/prepare-period/monitoringReportPeriodForm.handler";
import { MonitoringReportPrepareFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/[mode]/monitoringReportPrepareForm.handler";
import { MonitoringReportSummaryFormHandler } from "./handlers/projects/[projectId]/monitoring-reports/[monitoringReportId]/[mode]/monitoringReportSummaryForm.handler";
import { ProjectChangeRequestCreateHandler } from "./handlers/projects/[projectId]/pcrs/create/ProjectChangeRequestCreate.handler";
import { ProjectChangeRequestDeleteFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/delete/deleteProjectChangeRequestFormHandler";
import { ProjectChangeRequestAddTypeHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/add/ProjectChangeRequestAddType.handler";
import { VirementCostsUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/financial/[partnerId]/virementCostsUpdateHandler";
import { ChangeRemainingGrantUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/partner/reallocateCostsChangeRemainingGrantUpdate.handler";
import { OverheadDocumentsDeleteHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/documents/overheadDocumentsDeleteHandler";
import { OverheadDocumentsUploadHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/documents/overheadDocumentsUploadHandler";
import { ProjectChangeRequestSpendProfileAddCostHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/spendProfileAddCostHandler";
import { ProjectChangeRequestSpendProfileCostsSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/spendProfileCostsHandler";
import { VirementLoanEditHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/virementLoanEditHandler";
import { ProjectChangeRequestPrepareFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/prepareProjectChangeRequestForm.handler";
import { ProjectChangeRequestReasoningDocumentDeleteHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/reasoning/projectChangeRequestReasoningDocumentDelete.handler";
import { ProjectChangeRequestReasoningDocumentUploadHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/reasoning/projectChangeRequestReasoningDocumentUpload.handler";
import { ProjectChangeRequestReasoningUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/reasoning/projectChangeRequestReasoningUpdate.handler";
import { ProjectChangeRequestReviewFormHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/review/reviewProjectChangeRequestFormHandler";
import { ProjectSetupBankDetailsVerifyHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-details-verify/ProjectSetupBankDetailsVerify.handler";
import { ProjectSetupBankDetailsHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-details/ProjectSetupBankDetails.handler";
import { BankSetupStatementDocumentUploadHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-statement/BankSetupStatementDocumentUpload.handler";
import { ProjectSetupBankStatementHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-statement/ProjectSetupBankStatement.handler";
import { BankSetupStatementDocumentDeleteHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/bank-statement/BankSetupStatementDocumentDelete.handler";
import { ProjectSetupPartnerPostcodeFormHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/project-location/projectSetupPartnerPostcodeForm.handler";
import { ProjectSetupFormHandler } from "./handlers/projects/[projectId]/setup/[partnerId]/projectSetupForm.handler";
import { FallbackFormHandler } from "./FallbackFormHandler";
import { ClaimDetailLevelDocumentShareUploadHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/costs/[costCategoryId]/documents/ClaimDetailLevelDocumentShareUpload.handler";
import { ClaimDetailLevelDocumentShareDeleteHandler } from "./handlers/projects/[projectId]/claims/[partnerId]/prepare/[periodId]/costs/[costCategoryId]/documents/ClaimDetailLevelDocumentShareDelete.handler";
import { ProjectChangeRequestItemReallocateCostsSummaryUpdate } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemReallocateCostsSummaryUpdate.handler";
import { ProjectChangeRequestItemApproveNewSubcontractorSummaryUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemApproveNewSubcontractorSummaryUpdate.handler";
import { ProjectChangeRequestItemApproveNewSubcontractorStepUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemApproveNewSubcontractorStepUpdate.handler";
import { ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerCompaniesHouseStepUpdate.handler";
import { ProjectChangeRequestItemReallocateCostsCostCategoryUpdate } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemReallocateCostsCostCategoryUpdate.handler";
import { ProjectSetupContactAssociateHandler } from "./handlers/projects/[projectId]/setup/associate/projectSetupContactAssociate.handler";
import { ProjectChangeRequestItemChangeProjectScopeProposedPublicDescriptionStepUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemChangeProjectScopeProposedPublicDescriptionStepUpdate.handler";
import { ProjectChangeRequestItemChangeProjectScopeProposedProjectSummaryStepUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemChangeProjectScopeProposedProjectSummaryStepUpdate.handler";
import { ProjectChangeRequestItemChangeProjectScopeSummaryUpdateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemChangeProjectScopeSummaryUpdate.handler";
import { ForecastHandler } from "./handlers/projects/Forecast.handler";
import { PcrItemChangeRenamePartnerHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemRenamePartner.handler";
import { PcrItemChangeRenamePartnerSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemRenamePartnerSummary.handler";
import { PcrItemLevelDocumentUploadHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemLevelDocumentUpload.handler";
import { PcrLevelDocumentDeleteHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemLevelDocumentDelete.handler";
import { PcrItemFilesStepHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemFilesStep.handler";
import { PcrItemChangeRemovePartnerSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemRemovePartnerSummary.handler";
import { PcrItemChangeRemovePartnerHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemRemovePartner.handler";
import { PcrItemPutProjectOnHoldHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemPutProjectOnHold.handler";
import { PcrItemPutProjectOnHoldSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemPutProjectOnHoldSummary.handler";
import { PcrChangeDurationSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemChangeProjectDurationSummary.handler";
import { PcrChangeDurationHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemChangeProjectDuration.handler";
import { PcrItemAddPartnerRoleAndOrganisationHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerRoleAndOrganisation.handler";
import { PcrItemAddPartnerOrganisationDetailsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerOrganisationDetails.handler";
import { PcrItemAddPartnerFinancialDetailsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerFinancialDetails.handler";
import { PcrItemAddPartnerProjectLocationHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerProjectLocation.handler";
import { PcrItemAddPartnerFinanceContactHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerFinanceContact.handler";
import { PcrItemAddPartnerOtherFundingHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerOtherFunding.handler";
import { PcrItemAddPartnerOtherSourcesOfFundingHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcritemAddPartnerOtherSourcesOfFunding.handler";
import { PcrItemAddPartnerProjectManagerHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerProjectManager.handler";
import { PcrItemAddPartnerAwardRateHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerAwardRate.handler";
import { PcrItemAddPartnerAcademicOrganisationStepHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerAcademicOrganisationStep.handler";
import { PcrItemAddPartnerAcademicOrganisationSearchStepHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerAcademicOrganisationSearchStep.handler";
import { PcrItemAddPartnerAcademicCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerAcademicCostsStep.handler";
import { PcrAddPartnerSummaryHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/pcrItemAddPartnerSummary.handler";
import { PcrItemAddPartnerSpendProfileLabourCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileLabourCost.handler";
import { PcrItemAddPartnerSpendProfileOverheadCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileOverheadCost.handler";
import { PcrItemAddPartnerSpendProfileMaterialsCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileMaterialsCost.handler";
import { PcrItemAddPartnerSpendProfileCapitalUsageCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileCapitalUsageCost.handler";
import { PcrItemAddPartnerSpendProfileSubcontractingCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileSubcontractingCosts.handler";
import { PcrItemAddPartnerSpendProfileTravelAndSubsCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileTravelAndSubs.handler";
import { PcrItemAddPartnerSpendProfileOtherCostsHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileOtherCosts.handler";
import { PcrItemAddPartnerSpendProfileDeleteItemHandler } from "./handlers/projects/[projectId]/pcrs/[pcrId]/prepare/item/[itemId]/spendProfile/[costCategoryId]/cost/[costId]/spendProfileDeleteItem.handler";
import { PartnerDetailsEditFormHandler } from "./handlers/projects/[projectId]/postcode/[partnerId]/editPartnerDetailsPostcode.handler";

export const standardFormHandlers = [
  // Zod
  new ProjectLevelDocumentShareDeleteHandler(),
  new ClaimLevelDocumentShareDeleteHandler(),
  new ClaimDetailLevelDocumentShareDeleteHandler(),
  new ProjectSetupContactAssociateHandler(),
  new ProjectSetupBankDetailsHandler(),
  new PcrLevelDocumentDeleteHandler(),

  // Zod PCRs
  new PcrItemFilesStepHandler(),
  new ProjectChangeRequestCreateHandler(),
  new ProjectChangeRequestAddTypeHandler(),
  new ProjectChangeRequestItemReallocateCostsSummaryUpdate(),
  new ProjectChangeRequestItemReallocateCostsCostCategoryUpdate(),
  new ProjectChangeRequestItemApproveNewSubcontractorSummaryUpdateHandler(),
  new ProjectChangeRequestItemApproveNewSubcontractorStepUpdateHandler(),
  new ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler(),
  new PcrItemAddPartnerAcademicOrganisationSearchStepHandler(),
  new PcrItemAddPartnerRoleAndOrganisationHandler(),
  new PcrItemAddPartnerFinancialDetailsHandler(),
  new PcrItemAddPartnerProjectLocationHandler(),
  new PcrItemAddPartnerFinanceContactHandler(),
  new PcrItemAddPartnerProjectManagerHandler(),
  new PcrItemAddPartnerOtherFundingHandler(),
  new PcrItemAddPartnerAwardRateHandler(),
  new PcrItemAddPartnerAcademicCostsHandler(),
  new PcrItemAddPartnerOtherSourcesOfFundingHandler(),
  new PcrAddPartnerSummaryHandler(),
  new PcrItemAddPartnerSpendProfileLabourCostsHandler(),
  new PcrItemAddPartnerSpendProfileOverheadCostsHandler(),
  new PcrItemAddPartnerSpendProfileMaterialsCostsHandler(),
  new PcrItemAddPartnerSpendProfileCapitalUsageCostsHandler(),
  new PcrItemAddPartnerSpendProfileSubcontractingCostsHandler(),
  new PcrItemAddPartnerSpendProfileTravelAndSubsCostsHandler(),
  new PcrItemAddPartnerSpendProfileOtherCostsHandler(),
  new PcrItemAddPartnerSpendProfileDeleteItemHandler(),
  new ProjectChangeRequestItemChangeProjectScopeProposedPublicDescriptionStepUpdateHandler(),
  new PcrItemChangeRemovePartnerHandler(),
  new PcrItemChangeRemovePartnerSummaryHandler(),
  new PcrItemChangeRenamePartnerHandler(),
  new PcrItemChangeRenamePartnerSummaryHandler(),
  new PcrItemAddPartnerOrganisationDetailsHandler(),
  new PcrItemPutProjectOnHoldHandler(),
  new PcrItemPutProjectOnHoldSummaryHandler(),
  new PcrItemAddPartnerAcademicOrganisationStepHandler(),
  new PcrChangeDurationSummaryHandler(),
  new PcrChangeDurationHandler(),
  new ProjectChangeRequestItemChangeProjectScopeProposedProjectSummaryStepUpdateHandler(),
  new ProjectChangeRequestItemChangeProjectScopeSummaryUpdateHandler(),
  new ProjectSetupBankDetailsHandler(),
  new EditClaimLineItemsFormHandler(),
  new ForecastHandler(),
  new ClaimSummaryFormHandler(),
  new PrepareClaimFormHandler(),
  new ClaimReviewLevelFormHandler(),
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
  new ProjectChangeRequestSpendProfileAddCostHandler(),
  new ProjectChangeRequestSpendProfileCostsSummaryHandler(),
  new VirementCostsUpdateHandler(),
  new VirementLoanEditHandler(),
  new ChangeRemainingGrantUpdateHandler(),
  new ProjectSetupFormHandler(),
  new PartnerDetailsEditFormHandler(),
  new ProjectSetupPartnerPostcodeFormHandler(),
  new ProjectSetupBankDetailsVerifyHandler(),
  new ProjectSetupBankStatementHandler(),
  new LoanRequestDocumentDeleteHandler(),
  new BankSetupStatementDocumentDeleteHandler(),
] as const;

export const multiFileFormHandlers = [new OverheadDocumentsUploadHandler()] as const;

export const developerFormHandlers = [new DeveloperUserSwitcherHandler(), new DeveloperPageCrasherHandler()] as const;

export const zodFormHandlers = [
  new BankSetupStatementDocumentUploadHandler(),
  new ProjectLevelDocumentShareUploadHandler(),
  new ClaimLevelDocumentShareUploadHandler(),
  new ClaimDetailLevelDocumentShareUploadHandler(),
  new ProjectChangeRequestReasoningDocumentUploadHandler(),
  new LoanRequestDocumentUploadHandler(),
  new PcrItemLevelDocumentUploadHandler(),
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
  const finalHandler = new FallbackFormHandler({ schema });

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
