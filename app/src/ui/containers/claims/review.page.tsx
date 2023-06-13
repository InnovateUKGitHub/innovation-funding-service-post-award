import { useNavigate } from "react-router-dom";
import {
  createTypedForm,
  Page,
  PageLoader,
  Content,
  BackLink,
  Renderers,
  Projects,
  UL,
  ValidationMessage,
  Section,
  Claims,
  Accordion,
  AccordionItem,
  Loader,
  Logs,
  SelectOption,
  DocumentGuidance,
  DocumentEdit,
  FormBuilder,
} from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { claimCommentsMaxLength, ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import {
  allowedClaimDocuments,
  ClaimDetailsSummaryDto,
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  CostsSummaryForPeriodDto,
  ForecastDetailsDTO,
  getAuthRoles,
  GOLCostDto,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { useContent } from "@ui/hooks";
import { useMounted } from "@ui/features";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { DropdownOption } from "@ui/components";
import { EnumDocuments } from "./components";
import { Markdown } from "@ui/components/renderers";
import { ReceivedStatus } from "@framework/entities";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";

export interface ReviewClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface ReviewProps {
  content: ReturnType<typeof useReviewContent>;
  claimDetails: Pick<
    CostsSummaryForPeriodDto,
    | "costsClaimedToDate"
    | "costCategoryId"
    | "costsClaimedThisPeriod"
    | "forecastThisPeriod"
    | "offerTotal"
    | "remainingOfferCosts"
  >[];
  forecastDetails: Pending<
    Pick<ForecastDetailsDTO, "id" | "costCategoryId" | "periodEnd" | "periodStart" | "value" | "periodId">[]
  >;
  golCosts: Pending<Pick<GOLCostDto, "costCategoryId" | "value">[]>;
  statusChanges: Pending<Pick<ClaimStatusChangeDto, "newStatusLabel" | "createdBy" | "createdDate" | "comments">[]>;
  project: Pick<
    ProjectDto,
    "projectNumber" | "title" | "id" | "roles" | "competitionType" | "numberOfPeriods" | "periodId"
  >;
  partner: Pick<
    PartnerDto,
    | "competitionName"
    | "competitionType"
    | "isLead"
    | "isWithdrawn"
    | "name"
    | "organisationType"
    | "partnerStatus"
    | "overheadRate"
  >;
  costCategories: Pick<
    CostCategoryDto,
    "id" | "competitionType" | "name" | "organisationType" | "isCalculated" | "type"
  >[];
  claims: Pending<Pick<ClaimDto, "periodId" | "isApproved">[]>;
  claim: Pick<ClaimDto, "isFinalClaim" | "periodId" | "periodEndDate" | "periodStartDate" | "isApproved">;
  pendingClaimDetailsSummary: Pending<
    Pick<ClaimDetailsSummaryDto, "periodStart" | "periodEnd" | "periodId" | "value" | "costCategoryId">[]
  >;
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  documents: Pick<
    DocumentSummaryDto,
    "dateCreated" | "fileName" | "fileSize" | "id" | "link" | "isOwner" | "uploadedBy"
  >[];
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onUpdate: (saving: boolean, dto: ClaimDto) => void;
  onUpload: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const Form = createTypedForm<ClaimDto>();
const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

/**
 * ### useReviewContent
 *
 * hook returns content needed for the review page
 */
export function useReviewContent() {
  const { getContent } = useContent();

  const defaultContent = {
    accordionTitleClaimLog: getContent(x => x.claimsLabels.accordionTitleClaimLog),
    accordionTitleForecast: getContent(x => x.claimsLabels.accordionTitleForecast),
    accordionTitleSupportingDocumentsForm: getContent(x => x.pages.claimReview.accordionTitleSupportingDocumentsForm),
    additionalInfo: getContent(x => x.pages.claimReview.additionalInfo),
    additionalInfoHint: getContent(x => x.pages.claimReview.additionalInfoHint),
    backLink: getContent(x => x.pages.claimReview.backLink),
    buttonSendQuery: getContent(x => x.pages.claimReview.buttonSendQuery),
    buttonSubmit: getContent(x => x.pages.claimReview.buttonSubmit),
    buttonUpload: getContent(x => x.pages.claimReview.buttonUpload),
    claimReviewDeclaration: getContent(x => x.pages.claimReview.claimReviewDeclaration),
    competitionName: getContent(x => x.projectLabels.competitionName),
    competitionType: getContent(x => x.projectLabels.competitionType),
    descriptionLabel: getContent(x => x.pages.claimDocuments.descriptionLabel),
    finalClaim: getContent(x => x.claimsMessages.finalClaim),
    labelInputUpload: getContent(x => x.pages.claimReview.labelInputUpload),
    monitoringReportReminder: getContent(x => x.pages.claimReview.monitoringReportReminder),
    noDocumentsUploaded: getContent(x => x.documentMessages.noDocumentsUploaded),
    noMatchingDocumentsMessage: getContent(x => x.pages.projectDocuments.noMatchingDocumentsMessage),
    optionQueryClaim: getContent(x => x.pages.claimReview.optionQueryClaim),
    optionSubmitClaim: getContent(x => x.pages.claimReview.optionSubmitClaim),
    searchDocumentsMessage: getContent(x => x.pages.projectDocuments.searchDocumentsMessage),
    sectionTitleAdditionalInfo: getContent(x => x.pages.claimReview.sectionTitleAdditionalInfo),
    sectionTitleHowToProceed: getContent(x => x.pages.claimReview.sectionTitleHowToProceed),
    uploadInstruction: getContent(x => x.documentMessages.uploadInstruction),
  };

  return defaultContent;
}

const ReviewComponent = (props: ReviewClaimParams & ReviewProps & BaseProps) => {
  const { isCombinationOfSBRI } = checkProjectCompetition(props.project.competitionType);
  const { isMo } = getAuthRoles(props.project.roles);

      // Disable completing the form if internal impact management and not received PCF
      const impMgmtPcfNotSubmittedForFinalClaim =
      data.project.impactManagementParticipation === ImpactManagementParticipation.Yes
        ? data.claim.isFinalClaim && data.claim.pcfStatus !== ReceivedStatus.Received
        : false;

  const backLinkElement = (
    <BackLink route={props.routes.allClaimsDashboard.getLink({ projectId: props.project.id })}>
      {props.content.backLink}
    </BackLink>
  );

  return (
    <Page
      backLink={backLinkElement}
      error={props.editor.error}
      validator={[props.editor.validator, props.documentsEditor.validator]}
      pageTitle={<Projects.Title projectNumber={props.project.projectNumber} title={props.project.title} />}
    >
      <Renderers.Messages messages={props.messages} />

      {props.claim.isFinalClaim && <ValidationMessage messageType="info" message={props.content.finalClaim} />}

      {props.partner.competitionName && (
        <Renderers.SimpleString className="margin-bottom-none">
          <span className="govuk-!-font-weight-bold">{props.content.competitionName}:</span>{" "}
          {props.partner.competitionName}
        </Renderers.SimpleString>
      )}

      <Renderers.SimpleString>
        <span className="govuk-!-font-weight-bold">{props.content.competitionType}:</span>{" "}
        {props.partner.competitionType}
      </Renderers.SimpleString>

      {isMo && isCombinationOfSBRI && (
        <>
          <Renderers.SimpleString>
            <Content value={x => x.claimsMessages.milestoneContractAchievement} />
          </Renderers.SimpleString>
          <Renderers.SimpleString>
            <Content value={x => x.claimsMessages.milestoneToDo} />
          </Renderers.SimpleString>
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

      <Section title={<Claims.ClaimPeriodDate claim={props.claim} partner={props.partner} />}>
        <Claims.ClaimReviewTable
          {...props}
          validation={props.editor.validator.totalCosts}
          getLink={costCategoryId => getClaimLineItemLink(props, costCategoryId)}
        />
      </Section>

      <Section>
        <Accordion>
          {renderForecastItem(props)}

          <AccordionItem title={props.content.accordionTitleClaimLog} qa="log-accordion">
            {/* Keeping logs inside loader because accordion defaults to closed*/}
            <Loader
              pending={props.statusChanges}
              render={statusChanges => <Logs qa="claim-status-change-table" data={statusChanges} />}
            />
          </AccordionItem>

          <SupportingDocumentsItem {...props} />
        </Accordion>
      </Section>

      <ReviewClaimsForm disabled={impMgmtPcfNotSubmittedForFinalClaim} {...props}  />
    </Page>
  );
};

const renderForecastItem = (props: ReviewProps) => {
  const pendingForecastData = Pending.combine({
    claims: props.claims,
    claimDetails: props.pendingClaimDetailsSummary,
    forecastDetails: props.forecastDetails,
    golCosts: props.golCosts,
  });

  return (
    <AccordionItem qa="forecast-accordion" title={props.content.accordionTitleForecast}>
      <Loader
        pending={pendingForecastData}
        render={forecastData => (
          <Claims.ForecastTable
            hideValidation
            data={{
              ...forecastData,
              project: props.project,
              partner: props.partner,
              claim: props.claim,
              costCategories: props.costCategories,
            }}
          />
        )}
      />
    </AccordionItem>
  );
};

const getClaimLineItemLink = (props: ReviewProps & BaseProps & ReviewClaimParams, costCategoryId: string) => {
  return props.routes.reviewClaimLineItems.getLink({
    partnerId: props.partnerId,
    projectId: props.projectId,
    periodId: props.periodId,
    costCategoryId,
  });
};

const ReviewClaimsForm = (props: ReviewProps & {disabled?: boolean}): JSX.Element => {
  const { isClient } = useMounted();
  const options: SelectOption[] = [
    { id: ClaimStatus.MO_QUERIED, value: props.content.optionQueryClaim },
    { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: props.content.optionSubmitClaim },
  ];

  const validSubmittedClaimStatus = [
    ClaimStatus.MO_QUERIED,
    ClaimStatus.AWAITING_IAR,
    ClaimStatus.AWAITING_IUK_APPROVAL,
  ];

  const isValidStatus = validSubmittedClaimStatus.includes(props.editor.data.status);
  const isInteractive = isClient && !props.editor.data.status;

  const displayInteractiveForm = isValidStatus || !isInteractive;

  return (
    <Form.Form
      editor={props.editor}
      onSubmit={() => handleSubmit(props)}
      onChange={dto => props.onUpdate(false, dto)}
      qa="review-form"
    >
      <Form.Fieldset heading={props.content.sectionTitleHowToProceed}>
        <Form.Radio
          name="status"
          options={options}
          value={dto => options.find(x => x.id === dto.status)}
          update={(dto, val) => updateStatus(dto, val)}
          validation={props.editor.validator.status}
          inline
        />

        {displayInteractiveForm && renderFormHiddenSection(props.editor, Form, props.project, props.content, props.disabled)}
      </Form.Fieldset>
    </Form.Form>
  );
};

const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
  if (!documents.length || !selectedDocument.description) return undefined;

  const targetId = selectedDocument.description.toString();

  return documents.find(x => x.id === targetId);
};

const SupportingDocumentsItem = (props: ReviewProps) => {
  return (
    <AccordionItem
      title={props.content.accordionTitleSupportingDocumentsForm}
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
                <Renderers.Markdown value={props.content.uploadInstruction} />

                <DocumentGuidance />

                <UploadForm.MultipleFileUpload
                  label={props.content.labelInputUpload}
                  name="attachment"
                  labelHidden
                  value={x => x.files}
                  update={(dto, files) => (dto.files = files || [])}
                  validation={props.documentsEditor.validator.files}
                />

                <UploadForm.DropdownList
                  label={props.content.descriptionLabel}
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
                {props.content.buttonUpload}
              </UploadForm.Submit>
            </UploadForm.Form>

            <Section>
              <DocumentEdit
                qa="claim-supporting-documents"
                onRemove={document => props.onDelete(props.documentsEditor.data, document)}
                documents={props.documents}
              />
            </Section>
          </>
        )}
      </EnumDocuments>
    </AccordionItem>
  );
};

const getMOReminderMessage = (competitionType: string, content: ReviewProps["content"]) => {
  const reminderByCompetion = `${competitionType.toLowerCase()}-reminder`;

  return (
    <Renderers.SimpleString key={reminderByCompetion} qa={reminderByCompetion}>
      {content.monitoringReportReminder}
    </Renderers.SimpleString>
  );
};

const renderFormHiddenSection = (
  editor: ReviewProps["editor"],
  Form: FormBuilder<ClaimDto>,
  project: ReviewProps["project"],
  content: ReviewProps["content"],
  disabled: boolean,
) => {
  const moReminderElement = getMOReminderMessage(project.competitionType, content);
  const submitButtonElement = <Form.Submit disabled={disabled} key="button">{getSubmitButtonLabel(editor, content)}</Form.Submit>;
  const declarationElement = (
    <Renderers.SimpleString key="declaration">{content.claimReviewDeclaration}</Renderers.SimpleString>
  );

  // Note: <Fieldset> has not got got support for React.Fragment
  return [
    // Returning array here instead of React.Fragment as Fieldset data will not persist through Fragment,
    <Form.Fieldset
      key="form"
      heading={content.sectionTitleAdditionalInfo}
      qa="additional-info-form"
      headingQa="additional-info-heading"
    >
      <Form.MultilineString
        label={content.additionalInfo}
        labelHidden
        hint={<Markdown value={content.additionalInfoHint} />}
        name="comments"
        value={m => m.comments}
        update={(m, v) => (m.comments = v)}
        validation={editor.validator.comments}
        characterCountOptions={{ type: "descending", maxValue: claimCommentsMaxLength }}
        qa="info-text-area"
      />
    </Form.Fieldset>,
    declarationElement,
    moReminderElement,
    submitButtonElement,
  ];
};

const getSubmitButtonLabel = (editor: ReviewProps["editor"], content: ReviewProps["content"]): string => {
  const showQueryLabel = editor.data.status === ClaimStatus.MO_QUERIED;

  // Note: With SSR remove dynamic text
  return showQueryLabel ? content.buttonSendQuery : content.buttonSubmit;
};

const updateStatus = (dto: ClaimDto, option: SelectOption | null | undefined) => {
  if (option && (option.id === ClaimStatus.MO_QUERIED || option.id === ClaimStatus.AWAITING_IUK_APPROVAL)) {
    dto.status = option.id;
  }
};

const prepareClaimAwaitingIukApproval = (claimToUpdate: ClaimDto): ClaimDto => {
  const isIarReceived: boolean = claimToUpdate.iarStatus !== "Received";
  const isNotReceivedIar: boolean = !!claimToUpdate.isIarRequired && isIarReceived;

  const updatedStatus = isNotReceivedIar ? ClaimStatus.AWAITING_IAR : ClaimStatus.AWAITING_IUK_APPROVAL;

  claimToUpdate.status = updatedStatus;

  return claimToUpdate;
};

const handleSubmit = (props: ReviewProps): void => {
  let claimToUpdate = props.editor.data;

  if (claimToUpdate.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
    claimToUpdate = prepareClaimAwaitingIukApproval(claimToUpdate);
  }

  props.onUpdate(true, claimToUpdate);
};

const initEditor = (dto: ClaimDto) => {
  // if the status hasn't already been set to "MO Queried" or "Awaiting IUK Approval" then set the status to New so that the validation kicks in a forces a change
  if (dto.status !== ClaimStatus.MO_QUERIED && dto.status !== ClaimStatus.AWAITING_IUK_APPROVAL) {
    dto.status = ClaimStatus.UNKNOWN;
  }
};

const ReviewContainer = (props: ReviewClaimParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const reviewContent = useReviewContent();
  const navigate = useNavigate();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partner: stores.partners.getById(props.partnerId),
    costCategories: stores.costCategories.getAllFiltered(props.partnerId),
    claim: stores.claims.get(props.partnerId, props.periodId),
    claimDetails: stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId),
    editor: stores.claims.getClaimEditor(false, props.projectId, props.partnerId, props.periodId, initEditor),
    documents: stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId),
    documentsEditor: stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId),
  });

  const pendingData = {
    claims: stores.claims.getAllClaimsForPartner(props.partnerId),
    statusChanges: stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId),
    forecastDetails: stores.forecastDetails.getAllByPartner(props.partnerId),
    golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
    pendingClaimDetailsSummary: stores.claimDetails.getAllByPartner(props.partnerId),
  };

  const onUpdate = (saving: boolean, dto: ClaimDto) => {
    stores.messages.clearMessages();

    stores.claims.updateClaimEditor(
      false,
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      dto,
      getContent(x =>
        dto.status === ClaimStatus.MO_QUERIED ? x.claimsMessages.claimQueried : x.claimsMessages.claimApproved,
      ),
      () => navigate(props.routes.allClaimsDashboard.getLink({ projectId: props.projectId }).path),
    );
  };

  const onUpload = (saving: boolean, dto: MultipleDocumentUploadDto) => {
    stores.messages.clearMessages();

    stores.claimDocuments.updateClaimDocumentsEditor(
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      dto,
      getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length })),
      () => stores.claims.markClaimAsStale(props.partnerId, props.periodId),
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
      () => stores.claims.markClaimAsStale(props.partnerId, props.periodId),
    );
  };

  return (
    <PageLoader
      pending={combined}
      render={data => (
        <ReviewComponent
          onUpdate={onUpdate}
          onUpload={onUpload}
          onDelete={onDelete}
          content={reviewContent}
          {...pendingData}
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
  container: ReviewContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimReview.title),
});
