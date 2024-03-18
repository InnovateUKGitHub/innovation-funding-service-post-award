import { ProjectRole } from "@framework/constants/project";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { convertResultErrorsToReactHookFormFormat, useRhfErrors } from "@framework/util/errorHelpers";
import { RefreshedQueryOptions, useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pending } from "@shared/pending";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Logs } from "@ui/components/atomicDesign/molecules/Logs/logs.standalone";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { ClaimReviewTable } from "@ui/components/atomicDesign/organisms/claims/ClaimReviewTable/claimReviewTable";
import { ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable.standalone";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { PageLoader } from "@ui/components/bjss/loading";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useRoutes } from "@ui/redux/routesProvider";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { claimReviewQuery } from "./ClaimReview.query";
import { useClaimReviewPageData, useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { claimReviewErrorMap, claimReviewSchema } from "./claimReview.zod";
import { ClaimReviewForm } from "./claimReviewForm";
import { ClaimReviewDocuments } from "./claimReviewDocuments";

export interface ReviewClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface ReviewClaimContainerProps {
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onUpload: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
  refreshedQueryOptions: RefreshedQueryOptions;
}

const ClaimReviewPage = ({
  projectId,
  partnerId,
  periodId,
  documentsEditor,
  refreshedQueryOptions,
  onUpload,
  onDelete,
  messages,
}: ReviewClaimParams & BaseProps & ReviewClaimContainerProps) => {
  const content = useReviewContent();
  const routes = useRoutes();
  const data = useClaimReviewPageData(projectId, partnerId, periodId, refreshedQueryOptions);

  const documentValidatorErrors = documentsEditor?.validator?.showValidationErrors
    ? convertResultErrorsToReactHookFormFormat(documentsEditor?.validator?.errors)
    : [];
  const { isCombinationOfSBRI } = checkProjectCompetition(data.project.competitionType);
  const { isMo } = getAuthRoles(data.project.roles);

  const { onUpdate, apiError, isFetching } = useOnUpdateClaimReview(
    partnerId,
    projectId,
    periodId,
    routes.allClaimsDashboard.getLink({ projectId }).path,
    data.claim,
  );

  const form = useForm<z.output<typeof claimReviewSchema>>({
    defaultValues: {
      status: undefined,
      comments: "",
    },
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });
  const { formState } = form;

  const validatorErrors = useRhfErrors<z.output<typeof claimReviewSchema>>(formState.errors);

  return (
    <Page
      backLink={<BackLink route={routes.allClaimsDashboard.getLink({ projectId })}>{content.backLink}</BackLink>}
      apiError={apiError}
      validationErrors={Object.assign({}, validatorErrors, documentValidatorErrors) as RhfErrors}
      pageTitle={<Title />}
      fragmentRef={data.fragmentRef}
    >
      <Messages messages={messages} />

      {data.claim.isFinalClaim && <ValidationMessage messageType="info" message={content.finalClaim} />}

      {data.project.competitionName && (
        <P className="margin-bottom-none">
          <span className="govuk-!-font-weight-bold">{content.competitionName}:</span> {data.project.competitionName}
        </P>
      )}

      <P>
        <span className="govuk-!-font-weight-bold">{content.competitionType}:</span> {data.project.competitionType}
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

      <Section title={<ClaimPeriodDate claim={data.claim} partner={data.partner} />}>
        <ClaimReviewTable
          {...data}
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
          <AccordionItem qa="forecast-accordion" title={content.accordionTitleForecast}>
            <ForecastTable
              projectId={projectId}
              partnerId={partnerId}
              hideValidation
              periodId={periodId}
              queryOptions={refreshedQueryOptions}
            />
          </AccordionItem>

          <AccordionItem title={content.accordionTitleClaimLog} qa="log-accordion">
            <Logs
              qa="claim-status-change-table"
              projectId={projectId}
              partnerId={partnerId}
              periodId={periodId}
              queryOptions={refreshedQueryOptions}
            />
          </AccordionItem>

          <AccordionItem
            title={content.accordionTitleSupportingDocumentsForm}
            qa="upload-supporting-documents-form-accordion"
          >
            <ClaimReviewDocuments
              data={data}
              content={content}
              documentsEditor={documentsEditor}
              isFetching={isFetching}
              onUpload={onUpload}
              onDelete={onDelete}
            />
          </AccordionItem>
        </Accordion>
      </Section>

      <ClaimReviewForm
        data={data}
        content={content}
        validatorErrors={validatorErrors}
        form={form}
        isFetching={isFetching}
        onUpdate={onUpdate}
      />
    </Page>
  );
};

const ClaimReviewContainer = (props: ReviewClaimParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimReviewQuery, {
    projectId: props.projectId,
    projectIdStr: props.projectId,
    partnerId: props.partnerId,
    periodId: props.periodId,
  });

  const combined = Pending.combine({
    documentsEditor: stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId),
  });

  const onUpload = (saving: boolean, dto: MultipleDocumentUploadDto) => {
    stores.messages.clearMessages();

    stores.claimDocuments.updateClaimDocumentsEditor(
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      dto,
      getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length })),
      () => {
        stores.claims.markClaimAsStale(props.partnerId, props.periodId);
        refresh();
      },
    );
  };

  const onDelete = (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => {
    stores.messages.clearMessages();

    stores.claimDocuments.deleteClaimDocument(
      props.projectId,
      props.partnerId,
      props.periodId,
      dto,
      document,
      getContent(x => x.documentMessages.deletedDocument({ deletedFileName: document.fileName })),
      () => {
        stores.claims.markClaimAsStale(props.partnerId, props.periodId);
        refresh();
      },
    );
  };

  return (
    <PageLoader
      pending={combined}
      render={data => (
        <ClaimReviewPage
          refreshedQueryOptions={refreshedQueryOptions}
          onUpload={onUpload}
          onDelete={onDelete}
          {...props}
          {...data}
        />
      )}
    />
  );
};

export const ReviewClaimRoute = defineRoute({
  routeName: "reviewClaim",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
  container: ClaimReviewContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimReview.title),
});
