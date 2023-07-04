import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { allowedClaimDocuments } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Accordion } from "@ui/components/accordion/Accordion";
import { AccordionItem } from "@ui/components/accordion/AccordionItem";
import { Content } from "@ui/components/content";
import { DocumentGuidance } from "@ui/components/documents/DocumentGuidance";
import { DocumentEdit } from "@ui/components/documents/DocumentView";
import { UL } from "@ui/components/layout/list";
import { Page } from "@ui/rhf-components/Page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { Logs } from "@ui/components/logs";
import { ValidationMessage } from "@ui/components/validationMessage";
import { useMounted } from "@ui/features/has-mounted/Mounted";
import { Title } from "@ui/components/projects/title";
import { Messages } from "@ui/components/renderers/messages";
import { ClaimPeriodDate } from "@ui/components/claims/claimPeriodDate";
import { ClaimReviewTable } from "@ui/components/claims/claimReviewTable";
import { ForecastTable } from "@ui/components/claims/forecastTable";
import { Markdown } from "@ui/components/renderers/markdown";
import { P } from "@ui/rhf-components/Typography";
import { Form } from "@ui/rhf-components/Form";
import { Fieldset } from "@ui/rhf-components/Fieldset";
import { Legend } from "@ui/rhf-components/Legend";
import { SubmitButton } from "@ui/rhf-components/Button";
import { FormGroup } from "@ui/rhf-components/FormGroup";
import { RadioList, Radio } from "@ui/rhf-components/Radio";
import { useClaimReviewPageData, FormValues, useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { useForm } from "react-hook-form";
import { convertResultErrorsToReactHookFormFormat, useRhfErrors } from "@framework/util/errorHelpers";
import { claimReviewErrorMap, claimReviewSchema } from "./claimReview.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextAreaField } from "@ui/rhf-components/groups/TextAreaField";
import { RefreshedQueryOptions, useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { claimReviewQuery } from "./ClaimReview.query";
import { PageLoader } from "@ui/components/loading";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Pending } from "@shared/pending";
import { useStores } from "@ui/redux/storesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { DropdownOption, createTypedForm } from "@ui/components/form";
import { EnumDocuments } from "./components/EnumDocuments";

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

/**
 * ### useReviewContent
 *
 * hook returns content needed for the review page
 */

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

const ClaimReviewPage = (props: ReviewClaimParams & BaseProps & ReviewClaimContainerProps) => {
  const content = useReviewContent();
  const { isClient } = useMounted();

  const data = useClaimReviewPageData(props.projectId, props.partnerId, props.periodId, props.refreshedQueryOptions);

  const { register, formState, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      status: undefined,
      comments: "",
    },
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdateClaimReview(
    props.partnerId,
    props.projectId,
    props.periodId,
    props.routes.allClaimsDashboard.getLink({ projectId: props.projectId }).path,
    data.claim,
  );

  console.log("documentSEditor", props.documentsEditor);

  const validatorErrors = useRhfErrors<FormValues>(formState.errors);
  const documentValidatorErrors = props.documentsEditor?.validator?.showValidationErrors
    ? convertResultErrorsToReactHookFormFormat(props.documentsEditor?.validator?.errors)
    : [];
  const { isCombinationOfSBRI } = checkProjectCompetition(data.project.competitionType);
  const { isMo } = getAuthRoles(data.project.roles);

  const backLinkElement = (
    <BackLink route={props.routes.allClaimsDashboard.getLink({ projectId: data.project.id })}>
      {content.backLink}
    </BackLink>
  );

  const validSubmittedClaimStatus = [
    ClaimStatus.MO_QUERIED,
    ClaimStatus.AWAITING_IAR,
    ClaimStatus.AWAITING_IUK_APPROVAL,
  ];

  const watchedStatus = watch("status");
  const watchedComments = watch("comments");

  const isValidStatus = validSubmittedClaimStatus.includes(watchedStatus);
  const isInteractive = isClient && !watchedStatus;

  const displayAdditionalInformationForm = isValidStatus || !isInteractive;
  const submitLabel = watchedStatus === ClaimStatus.MO_QUERIED ? content.buttonSendQuery : content.buttonSubmit;

  return (
    <Page
      backLink={backLinkElement}
      apiError={apiError}
      validationErrors={Object.assign({}, validatorErrors, documentValidatorErrors) as RhfErrors}
      pageTitle={<Title projectNumber={data.project.projectNumber} title={data.project.title} />}
    >
      <Messages messages={props.messages} />

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
        <ClaimReviewTable {...data} getLink={costCategoryId => getClaimLineItemLink(props, costCategoryId)} />
      </Section>

      <Section>
        <Accordion>
          <AccordionItem qa="forecast-accordion" title={content.accordionTitleForecast}>
            <ForecastTable
              hideValidation
              data={{
                ...data.forecastData,
                project: data.project,
                partner: data.partner,
                claim: data.claim,
                costCategories: data.costCategories,
              }}
            />
          </AccordionItem>

          <AccordionItem title={content.accordionTitleClaimLog} qa="log-accordion">
            <Logs qa="claim-status-change-table" data={data.statusChanges} />
          </AccordionItem>

          <AccordionItem
            title={content.accordionTitleSupportingDocumentsForm}
            qa="upload-supporting-documents-form-accordion"
          >
            <EnumDocuments documentsToCheck={allowedClaimDocuments}>
              {docs => (
                <>
                  <UploadForm.Form
                    enctype="multipart"
                    editor={props.documentsEditor}
                    onChange={dto => props.onUpload(false, dto)}
                    onSubmit={() => props.onUpload(true, props.documentsEditor.data)}
                    qa="projectDocumentUpload"
                  >
                    <UploadForm.Fieldset>
                      <Markdown value={content.uploadInstruction} />

                      <DocumentGuidance />

                      <UploadForm.MultipleFileUpload
                        label={content.labelInputUpload}
                        name="attachment"
                        labelHidden
                        value={x => x.files}
                        update={(dto, files) => (dto.files = files || [])}
                        validation={props.documentsEditor.validator.files}
                      />

                      <UploadForm.DropdownList
                        label={content.descriptionLabel}
                        labelHidden={false}
                        hasEmptyOption
                        placeholder="-- No description --"
                        name="description"
                        validation={props.documentsEditor.validator.files}
                        options={docs}
                        value={selectedOption => filterDropdownList(selectedOption, docs)}
                        update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
                      />
                    </UploadForm.Fieldset>

                    <UploadForm.Submit name="reviewDocuments" styling="Secondary">
                      {content.buttonUpload}
                    </UploadForm.Submit>
                  </UploadForm.Form>

                  <Section>
                    <DocumentEdit
                      qa="claim-supporting-documents"
                      onRemove={document => props.onDelete(props.documentsEditor.data, document)}
                      documents={data.documents}
                    />
                  </Section>
                </>
              )}
            </EnumDocuments>
          </AccordionItem>
        </Accordion>
      </Section>

      <Form onSubmit={handleSubmit(data => onUpdate({ data }))} data-qa="review-form">
        <Fieldset>
          <Legend>{content.sectionTitleHowToProceed}</Legend>
          <FormGroup>
            <RadioList inline name="status" register={register}>
              <Radio
                data-qa={`status_${ClaimStatus.MO_QUERIED}`}
                id={ClaimStatus.MO_QUERIED}
                label={content.optionQueryClaim}
                disabled={isFetching}
              />
              <Radio
                data-qa={`status_${ClaimStatus.AWAITING_IUK_APPROVAL}`}
                id={ClaimStatus.AWAITING_IUK_APPROVAL}
                label={content.optionSubmitClaim}
                disabled={isFetching}
              />
            </RadioList>
          </FormGroup>
        </Fieldset>

        {displayAdditionalInformationForm && (
          <>
            <Fieldset>
              <Legend data-qa="additional-information-title">{content.sectionTitleAdditionalInfo}</Legend>
              <TextAreaField
                {...register("comments")}
                hint={content.additionalInfoHint}
                id="comments"
                disabled={isFetching}
                error={formState?.errors?.comments}
                characterCount={watchedComments?.length ?? 0}
                data-qa="comments"
              />
            </Fieldset>

            <P>{content.claimReviewDeclaration}</P>

            <P data-qa={`${data.project.competitionType.toLowerCase()}-reminder`}>{content.monitoringReportReminder}</P>

            <SubmitButton data-qa="claim-form-submit" disabled={isFetching}>
              {submitLabel}
            </SubmitButton>
          </>
        )}
      </Form>
    </Page>
  );
};

const getClaimLineItemLink = (props: BaseProps & ReviewClaimParams, costCategoryId: string) => {
  return props.routes.reviewClaimLineItems.getLink({
    partnerId: props.partnerId,
    projectId: props.projectId,
    periodId: props.periodId,
    costCategoryId,
  });
};

const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
  if (!documents.length || !selectedDocument.description) return undefined;

  const targetId = selectedDocument.description.toString();

  return documents.find(x => x.id === targetId);
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
