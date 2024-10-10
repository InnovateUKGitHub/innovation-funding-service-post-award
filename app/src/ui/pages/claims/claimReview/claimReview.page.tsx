import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Accordion } from "@ui/components/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atoms/Accordion/AccordionItem";
import { BackLink } from "@ui/components/atoms/Links/links";
import { UL } from "@ui/components/atoms/List/list";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Content } from "@ui/components/molecules/Content/content";
import { Logs } from "@ui/components/molecules/Logs/logs.standalone";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { ClaimPeriodDate } from "@ui/components/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { ClaimReviewTable } from "@ui/components/organisms/claims/ClaimReviewTable/claimReviewTable";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useRoutes } from "@ui/context/routesProvider";
import { ClaimLevelUploadSchemaType, documentsErrorMap, getClaimLevelUpload } from "@ui/zod/documentValidators.zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { claimReviewQuery } from "./ClaimReview.query";
import { ClaimReviewApproval } from "./ClaimReviewApproval";
import { ClaimReviewDocuments } from "./ClaimReviewDocuments";
import { ClaimReviewForecastTable } from "./ClaimReviewForecastTable";
import { useClaimReviewPageData, useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { ClaimReviewSchemaType, claimReviewErrorMap, claimReviewSchema } from "./claimReview.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

export interface ReviewClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const ClaimReviewPage = ({ projectId, partnerId, periodId, messages }: ReviewClaimParams & BaseProps) => {
  const routes = useRoutes();
  const content = useReviewContent();
  const { options } = useClientConfig();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimReviewQuery, {
    projectId,
    projectIdStr: projectId,
    partnerId,
    periodId,
  });

  const { project, claim, claimDetails, costCategories, documents, partner, fragmentRef } = useClaimReviewPageData({
    projectId,
    partnerId,
    periodId,
    queryOptions: refreshedQueryOptions,
  });

  const documentForm = useForm<z.output<ClaimLevelUploadSchemaType>>({
    resolver: zodResolver(getClaimLevelUpload({ config: options, project }), { errorMap: documentsErrorMap }),
  });
  const claimReviewForm = useForm<z.output<ClaimReviewSchemaType>>({
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });

  useFormRevalidate(claimReviewForm.watch, claimReviewForm.trigger);

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const claimDocumentErrors = useZodErrors<z.output<ClaimLevelUploadSchemaType>>(
    documentForm.setError,
    documentForm.formState.errors,
  );
  const claimReviewErrors = useZodErrors<z.output<ClaimReviewSchemaType>>(
    claimReviewForm.setError,
    claimReviewForm.formState.errors,
  );

  const {
    onUpdate: onUploadUpdate,
    apiError: onUploadApiError,
    isProcessing: onUploadProcessing,
  } = useOnUpload({
    async onSuccess() {
      await refresh();
      documentForm.reset();
    },
  });
  const {
    onUpdate: onDeleteUpdate,
    apiError: onDeleteApiError,
    isProcessing: onDeleteProcessing,
  } = useOnDelete({ onSuccess: refresh });

  const { onUpdate, apiError, isProcessing } = useOnUpdateClaimReview({
    claim,
  });

  const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);
  const { isMo } = getAuthRoles(project.roles);

  const disabled = isProcessing || onUploadProcessing || onDeleteProcessing;

  return (
    <Page
      backLink={<BackLink route={routes.allClaimsDashboard.getLink({ projectId })}>{content.backLink}</BackLink>}
      apiError={apiError ?? onUploadApiError ?? onDeleteApiError}
      fragmentRef={fragmentRef}
      validationErrors={Object.assign({}, claimReviewErrors, claimDocumentErrors)}
    >
      <Messages messages={messages} />

      {claim.isFinalClaim && <ValidationMessage messageType="info" message={content.finalClaim} />}

      {project.competitionName && (
        <P className="margin-bottom-none">
          <span className="govuk-!-font-weight-bold">{content.competitionName}:</span> {project.competitionName}
        </P>
      )}

      <P>
        <span className="govuk-!-font-weight-bold">{content.competitionType}:</span> {project.competitionType}
      </P>

      {isMo && isCombinationOfSBRI && (
        <>
          <P>
            <Content value={x => x.claimsMessages.milestoneContractAchievement} />
          </P>
          <P>
            <Content value={x => x.claimsMessages.milestoneToDo} />
          </P>
          <UL>
            <li>
              <Content value={x => x.claimsMessages.milestoneBullet1} />
            </li>
            <li>
              <Content value={x => x.claimsMessages.milestoneBullet2} />
            </li>
            <li>
              <Content value={x => x.claimsMessages.milestoneBullet3} />
            </li>
            <li>
              <Content value={x => x.claimsMessages.milestoneBullet4} />
            </li>
          </UL>
        </>
      )}

      <Section title={<ClaimPeriodDate claim={claim} partner={partner} />}>
        <ClaimReviewTable
          project={project}
          partner={partner}
          claimDetails={claimDetails}
          costCategories={costCategories}
          getLink={costCategoryId =>
            routes.reviewClaimLineItems.getLink({
              partnerId,
              projectId,
              periodId,
              costCategoryId,
            })
          }
        />
      </Section>

      <Section>
        <Accordion>
          <ClaimReviewForecastTable
            projectId={projectId}
            partnerId={partnerId}
            periodId={periodId}
            refreshedQueryOptions={refreshedQueryOptions}
          />

          <AccordionItem title={content.accordionTitleClaimLog} qa="log-accordion">
            <Logs
              qa="claim-status-change-table"
              projectId={projectId}
              partnerId={partnerId}
              periodId={periodId}
              queryOptions={refreshedQueryOptions}
            />
          </AccordionItem>

          <ClaimReviewDocuments
            projectId={projectId}
            partnerId={partnerId}
            periodId={periodId}
            onUploadUpdate={onUploadUpdate}
            onDeleteUpdate={onDeleteUpdate}
            project={project}
            disabled={disabled}
            documents={documents}
            documentForm={documentForm}
          />
        </Accordion>

        <ClaimReviewApproval
          projectId={projectId}
          partnerId={partnerId}
          periodId={periodId}
          claimId={claim.id}
          disabled={disabled}
          onUpdate={onUpdate}
          claimReviewForm={claimReviewForm}
        />
      </Section>
    </Page>
  );
};

export const ReviewClaimRoute = defineRoute({
  routeName: "reviewClaim",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
  container: ClaimReviewPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimReview.title),
});
