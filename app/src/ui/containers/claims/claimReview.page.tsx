import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { allowedClaimDocuments } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { ReceivedStatus } from "@framework/entities/received-status";
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
import { ValidationError } from "@ui/rhf-components/ValidationError";
import { Legend } from "@ui/rhf-components/Legend";
import { Label } from "@ui/rhf-components/Label";
import { SubmitButton, Button } from "@ui/rhf-components/Button";
import { FormGroup } from "@ui/rhf-components/FormGroup";
import { RadioList, Radio } from "@ui/rhf-components/Radio";
import {
  useClaimReviewPageData,
  FormValues,
  useOnUpdateClaimReview,
  useReviewContent,
  useOnDeleteClaimDocument,
  useOnUploadClaimDocument,
} from "./claimReview.logic";
import { useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import {
  claimReviewErrorMap,
  claimReviewSchema,
  documentUploadSchema,
  documentUploadErrorMap,
} from "./claimReview.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextAreaField } from "@ui/rhf-components/groups/TextAreaField";
import { FileInput } from "@ui/rhf-components/FileInput";
import { Select } from "@ui/rhf-components/Select";
import { useEnumDocuments } from "./components/allowed-documents.hook";
import { useMessageContext } from "@ui/context/messages";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { claimReviewQuery } from "./ClaimReview.query";

export interface ReviewClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

/**
 * ### useReviewContent
 *
 * hook returns content needed for the review page
 */

const ClaimReviewPage = (props: ReviewClaimParams & BaseProps) => {
  const content = useReviewContent();
  const { isClient } = useMounted();
  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimReviewQuery, {
    projectId: props.projectId,
    projectIdStr: props.projectId,
    partnerId: props.partnerId,
    periodId: props.periodId,
  });

  const data = useClaimReviewPageData(props.projectId, props.partnerId, props.periodId, refreshedQueryOptions);

  const { messages } = useMessageContext();

  const { register, formState, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      status: undefined,
      comments: "",
    },
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });

  const allowedDocumentTypes = useEnumDocuments(allowedClaimDocuments);

  const {
    register: registerDocuments,
    formState: formStateDocuments,
    handleSubmit: handleSubmitDocuments,
  } = useForm<{ attachment: FileList; description: string }>({
    defaultValues: {
      attachment: undefined,
      description: "",
    },
    resolver: zodResolver(documentUploadSchema, { errorMap: documentUploadErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdateClaimReview(
    props.partnerId,
    props.projectId,
    props.periodId,
    props.routes.allClaimsDashboard.getLink({ projectId: props.projectId }).path,
    data.claim,
  );

  const { onUpdate: onDeleteClaimDocument, apiError: deleteApiError } = useOnDeleteClaimDocument(
    props.partnerId,
    props.projectId,
    props.periodId,
    refresh,
  );

  const { onUpdate: onUploadClaimDocuments, apiError: uploadApiError } = useOnUploadClaimDocument(
    props.partnerId,
    props.projectId,
    props.periodId,
    refresh,
  );

  const validatorErrors = useRhfErrors<FormValues>(formState.errors);
  const documentValidatorErrors = useRhfErrors(formStateDocuments.errors);
  const { isCombinationOfSBRI } = checkProjectCompetition(data.project.competitionType);
  const { isMo } = getAuthRoles(data.project.roles);

  console.log("documentFormState.errors", formStateDocuments.errors);

  console.log("documentValidatorErrors", documentValidatorErrors);
  // Disable completing the form if internal impact management and not received PCF
  const impactManagementPcfNotSubmittedForFinalClaim =
    data.project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? data.claim.isFinalClaim && data.claim.pcfStatus !== ReceivedStatus.Received
      : false;

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
      apiError={apiError || deleteApiError || uploadApiError}
      validationErrors={Object.assign({}, validatorErrors, documentValidatorErrors)}
      pageTitle={<Title projectNumber={data.project.projectNumber} title={data.project.title} />}
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
            <Form
              encType="multipart"
              onSubmit={handleSubmitDocuments(onUploadClaimDocuments)}
              data-qa="projectDocumentUpload"
            >
              <Fieldset>
                <Markdown value={content.uploadInstruction} />

                <DocumentGuidance />

                <FormGroup hasError={!!documentValidatorErrors?.attachment}>
                  <ValidationError error={documentValidatorErrors?.attachment} />
                  <FileInput
                    aria-label={content.labelInputUpload}
                    id="attachment"
                    {...registerDocuments("attachment")}
                    multiple
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">{content.descriptionLabel}</Label>
                  <Select id="description" {...registerDocuments("description")}>
                    <option data-qa="placeholder-option" aria-selected={false} value="">
                      {"-- No description --"}
                    </option>
                    {allowedDocumentTypes.map(doc => (
                      <option key={doc.id}>{doc.value}</option>
                    ))}
                  </Select>
                </FormGroup>
              </Fieldset>

              <FormGroup hasError={!!documentValidatorErrors?.attachment}>
                <ValidationError error={documentValidatorErrors?.attachment} />
                <Button type="submit" secondary name="button_reviewDocuments">
                  {content.buttonUpload}
                </Button>
              </FormGroup>
            </Form>

            <Section>
              <DocumentEdit
                qa="claim-supporting-documents"
                // onRemove={document => props.onDelete(props.documentsEditor.data, document)}
                onRemove={doc => onDeleteClaimDocument(doc)}
                documents={data.documents}
              />
            </Section>
          </AccordionItem>
        </Accordion>
      </Section>

      <Form onSubmit={handleSubmit(onUpdate)} data-qa="review-form">
        <Fieldset>
          <Legend>{content.sectionTitleHowToProceed}</Legend>
          <FormGroup>
            <RadioList inline name="status" register={register}>
              <Radio id={ClaimStatus.MO_QUERIED} label={content.optionQueryClaim} disabled={isFetching} />
              <Radio id={ClaimStatus.AWAITING_IUK_APPROVAL} label={content.optionSubmitClaim} disabled={isFetching} />
            </RadioList>
          </FormGroup>
        </Fieldset>

        {displayAdditionalInformationForm && (
          <>
            <Fieldset>
              <Legend>{content.sectionTitleAdditionalInfo}</Legend>
              <TextAreaField
                {...register("comments")}
                hint={content.additionalInfoHint}
                id="comments"
                disabled={isFetching}
                error={formState?.errors?.comments}
                characterCount={watchedComments?.length ?? 0}
              />
            </Fieldset>

            <P>{content.claimReviewDeclaration}</P>

            <P data-qa={`${data.project.competitionType.toLowerCase()}-reminder`}>{content.monitoringReportReminder}</P>

            <SubmitButton disabled={impactManagementPcfNotSubmittedForFinalClaim || isFetching}>
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

// const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
//   if (!documents.length || !selectedDocument.description) return undefined;

//   const targetId = selectedDocument.description.toString();

//   return documents.find(x => x.id === targetId);
// };

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
