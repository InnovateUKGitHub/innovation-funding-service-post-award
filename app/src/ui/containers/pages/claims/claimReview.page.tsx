import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { allowedClaimDocuments, allowedImpactManagementClaimDocuments } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { Select } from "@ui/components/atomicDesign/atoms/form/Select/Select";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Logs } from "@ui/components/atomicDesign/molecules/Logs/logs.standalone";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { ClaimReviewTable } from "@ui/components/atomicDesign/organisms/claims/ClaimReviewTable/claimReviewTable";
import { ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable.standalone";
import { DocumentEditMemo } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";
import { useValidDocumentDropdownOptions } from "@ui/hooks/useValidDocumentDropdownOptions.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { ClaimLevelUploadSchemaType, documentsErrorMap, getClaimLevelUpload } from "@ui/zod/documentValidators.zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { claimReviewQuery } from "./ClaimReview.query";
import { useClaimReviewPageData, useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { claimReviewErrorMap, claimReviewSchema } from "./claimReview.zod";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";

export interface ReviewClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const ClaimReviewPage = ({ projectId, partnerId, periodId, messages }: ReviewClaimParams & BaseProps) => {
  const routes = useRoutes();
  const content = useReviewContent();
  const config = useClientConfig();
  const { getContent } = useContent();
  const { isClient } = useMounted();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimReviewQuery, {
    projectId,
    projectIdStr: projectId,
    partnerId,
    periodId,
  });

  const { project, claim, claimDetails, costCategories, documents, partner, fragmentRef } = useClaimReviewPageData(
    projectId,
    partnerId,
    periodId,
    refreshedQueryOptions,
  );

  const claimReviewForm = useForm<z.output<typeof claimReviewSchema>>({
    defaultValues: {
      status: undefined,
      comments: "",
    },
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });

  const documentForm = useForm<z.output<ClaimLevelUploadSchemaType>>({
    resolver: zodResolver(getClaimLevelUpload({ config: config.options, project }), { errorMap: documentsErrorMap }),
  });

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

  const { onUpdate, apiError, isFetching } = useOnUpdateClaimReview(
    partnerId,
    projectId,
    periodId,
    routes.allClaimsDashboard.getLink({ projectId }).path,
    claim,
  );

  const documentDropdownOptions = useValidDocumentDropdownOptions(
    project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? allowedImpactManagementClaimDocuments
      : allowedClaimDocuments,
  );

  const validatorErrors = useRhfErrors<z.output<typeof claimReviewSchema>>(claimReviewForm.formState.errors);
  const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);
  const { isMo } = getAuthRoles(project.roles);

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ClaimLevelUploadSchemaType>>(
    documentForm.setError,
    documentForm.formState.errors,
  );
  const defaults = useServerInput<z.output<ClaimLevelUploadSchemaType>>();

  const validSubmittedClaimStatus = [
    ClaimStatus.MO_QUERIED,
    ClaimStatus.AWAITING_IAR,
    ClaimStatus.AWAITING_IUK_APPROVAL,
  ];

  const watchedStatus = claimReviewForm.watch("status");
  const watchedComments = claimReviewForm.watch("comments");

  const isValidStatus = validSubmittedClaimStatus.includes(watchedStatus);
  const isInteractive = isClient && !watchedStatus;
  const displayAdditionalInformationForm = isValidStatus || !isInteractive;
  const submitLabel = watchedStatus === ClaimStatus.MO_QUERIED ? content.buttonSendQuery : content.buttonSubmit;

  const disabled = isFetching || onUploadProcessing || onDeleteProcessing;

  return (
    <Page
      backLink={<BackLink route={routes.allClaimsDashboard.getLink({ projectId })}>{content.backLink}</BackLink>}
      apiError={apiError ?? onUploadApiError ?? onDeleteApiError}
      pageTitle={<Title />}
      fragmentRef={fragmentRef}
      validationErrors={allErrors}
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
            <Markdown trusted value={content.uploadInstruction} />
            <DocumentGuidance />

            <Form onSubmit={documentForm.handleSubmit(data => onUploadUpdate({ data }))} data-qa="upload-form">
              <input type="hidden" value={FormTypes.ClaimReviewLevelUpload} {...documentForm.register("form")} />
              <input type="hidden" value={projectId} {...documentForm.register("projectId")} />
              <input type="hidden" value={partnerId} {...documentForm.register("partnerId")} />
              <input type="hidden" value={periodId} {...documentForm.register("periodId")} />

              {/* File uploads */}
              <Fieldset>
                <FormGroup hasError={!!documentForm.getFieldState("files").error}>
                  <ValidationError error={documentForm.getFieldState("files").error} />
                  <FileInput
                    disabled={disabled}
                    id="files"
                    hasError={!!documentForm.getFieldState("files").error}
                    multiple
                    {...documentForm.register("files")}
                  />
                </FormGroup>
              </Fieldset>

              {/* Description selection */}
              <Fieldset>
                <FormGroup hasError={!!documentForm.getFieldState("description").error}>
                  <Label htmlFor="description">{getContent(x => x.documentLabels.descriptionLabel)}</Label>
                  <ValidationError error={documentForm.getFieldState("description").error} />
                  <Select
                    disabled={disabled}
                    id="description"
                    defaultValue={defaults?.description}
                    {...documentForm.register("description")}
                  >
                    {documentDropdownOptions.map(x => (
                      <option value={x.value} key={x.id} data-qa={x.qa}>
                        {x.displayName}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </Fieldset>

              <Fieldset>
                <Button disabled={disabled} name="button_default" styling="Secondary" type="submit">
                  {getContent(x => x.documentMessages.uploadDocuments)}
                </Button>
              </Fieldset>
            </Form>

            <DocumentEditMemo
              qa="claim-documents"
              onRemove={document =>
                onDeleteUpdate({
                  data: {
                    form: FormTypes.ClaimReviewLevelDelete,
                    documentId: document.id,
                    projectId,
                    partnerId,
                    periodId,
                  },
                  context: document,
                })
              }
              documents={documents}
              formType={FormTypes.ProjectLevelDelete}
              disabled={disabled}
            />
          </AccordionItem>
        </Accordion>
      </Section>

      <Form onSubmit={claimReviewForm.handleSubmit(data => onUpdate({ data }))} data-qa="review-form">
        <Fieldset>
          <Legend>{content.sectionTitleHowToProceed}</Legend>
          <FormGroup>
            <RadioList inline name="status" register={claimReviewForm.register}>
              <Radio
                data-qa={`status_${ClaimStatus.MO_QUERIED}`}
                id="MO_Queried"
                value={ClaimStatus.MO_QUERIED}
                label={content.optionQueryClaim}
                disabled={disabled}
              />
              <Radio
                data-qa={`status_${ClaimStatus.AWAITING_IUK_APPROVAL}`}
                id="Awaiting_IUK_Approval"
                value={ClaimStatus.AWAITING_IUK_APPROVAL}
                label={content.optionSubmitClaim}
                disabled={disabled}
              />
            </RadioList>
          </FormGroup>
        </Fieldset>

        {displayAdditionalInformationForm && (
          <>
            <Fieldset>
              <Legend data-qa="additional-information-title">{content.sectionTitleAdditionalInfo}</Legend>
              <TextAreaField
                {...claimReviewForm.register("comments")}
                hint={content.additionalInfoHint}
                id="comments"
                disabled={disabled}
                error={validatorErrors?.comments as RhfError}
                characterCount={watchedComments?.length ?? 0}
                data-qa="comments"
              />
            </Fieldset>

            <P>{content.claimReviewDeclaration}</P>

            <P data-qa={`${project.competitionType.toLowerCase()}-reminder`}>{content.monitoringReportReminder}</P>

            <SubmitButton data-qa="claim-form-submit" disabled={disabled}>
              {submitLabel}
            </SubmitButton>
          </>
        )}
      </Form>
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimReview.title),
});
