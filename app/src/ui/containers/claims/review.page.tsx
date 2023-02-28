import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
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

export interface ReviewClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: number;
}

interface ReviewData {
  content: ReturnType<typeof useReviewContent>;
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  claims: Pending<ClaimDto[]>;
  claimDetails: Pending<ClaimDetailsSummaryDto[]>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  forecastDetails: Pending<ForecastDetailsDTO[]>;
  golCosts: Pending<GOLCostDto[]>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
}

const Form = ACC.createTypedForm<ClaimDto>();
const UploadForm = ACC.createTypedForm<MultipleDocumentUploadDto>();

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

interface ReviewCallbacks {
  onUpdate: (saving: boolean, dto: ClaimDto) => void;
  onUpload: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  documents: DocumentSummaryDto[];
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

const ReviewComponent = ({ content, ...props }: ReviewClaimParams & ReviewData & ReviewCallbacks & BaseProps) => {
  const { isClient } = useMounted();

  const renderContents = (data: CombinedData) => {
    const { isCombinationOfSBRI } = checkProjectCompetition(data.project.competitionType);
    const { isMo } = getAuthRoles(data.project.roles);

    const backLinkElement = (
      <ACC.BackLink route={props.routes.allClaimsDashboard.getLink({ projectId: data.project.id })}>
        {content.backLink}
      </ACC.BackLink>
    );

    return (
      <ACC.Page
        backLink={backLinkElement}
        error={data.editor.error}
        validator={[data.editor.validator, data.documentsEditor.validator]}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        <ACC.Renderers.Messages messages={props.messages} />

        {data.claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message={content.finalClaim} />}

        {data.partner.competitionName && (
          <ACC.Renderers.SimpleString className="margin-bottom-none">
            <span className="govuk-!-font-weight-bold">{content.competitionName}:</span> {data.partner.competitionName}
          </ACC.Renderers.SimpleString>
        )}

        <ACC.Renderers.SimpleString>
          <span className="govuk-!-font-weight-bold">{content.competitionType}:</span> {data.partner.competitionType}
        </ACC.Renderers.SimpleString>

        {isMo && isCombinationOfSBRI && (
          <>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.claimsMessages.milestoneContractAchievement} />
            </ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.claimsMessages.milestoneToDo} />
            </ACC.Renderers.SimpleString>
            <ACC.UL>
              <li>
                <ACC.Content value={x => x.claimsMessages.milestoneBullet1} />
              </li>
              <li>
                <ACC.Content value={x => x.claimsMessages.milestoneBullet2} />
              </li>
              <li>
                <ACC.Content value={x => x.claimsMessages.milestoneBullet3} />
              </li>
              <li>
                <ACC.Content value={x => x.claimsMessages.milestoneBullet4} />
              </li>
            </ACC.UL>
          </>
        )}

        <ACC.Section title={<ACC.Claims.ClaimPeriodDate {...data} />}>
          <ACC.Claims.ClaimReviewTable
            {...data}
            standardOverheadRate={props.config.options.standardOverheadRate}
            validation={data.editor.validator.totalCosts}
            getLink={costCategoryId => getClaimLineItemLink(costCategoryId)}
          />
        </ACC.Section>

        <ACC.Section>
          <ACC.Accordion>
            {renderForecastItem()}

            <ACC.AccordionItem title={content.accordionTitleClaimLog} qa="log-accordion">
              {/* Keeping logs inside loader because accordion defaults to closed*/}
              <ACC.Loader
                pending={props.statusChanges}
                render={statusChanges => <ACC.Logs qa="claim-status-change-table" data={statusChanges} />}
              />
            </ACC.AccordionItem>

            {renderSupportingDocumentsItem(data)}
          </ACC.Accordion>
        </ACC.Section>

        {renderForm(data)}
      </ACC.Page>
    );
  };

  const renderForecastItem = () => {
    const pendingForecastData: Pending<ACC.Claims.ForecastData> = Pending.combine({
      project: props.project,
      partner: props.partner,
      claim: props.claim,
      claims: props.claims,
      claimDetails: props.claimDetails,
      forecastDetails: props.forecastDetails,
      golCosts: props.golCosts,
      costCategories: props.costCategories,
    });

    return (
      <ACC.AccordionItem qa="forecast-accordion" title={content.accordionTitleForecast}>
        <ACC.Loader
          pending={pendingForecastData}
          render={forecastData => <ACC.Claims.ForecastTable hideValidation data={forecastData} />}
        />
      </ACC.AccordionItem>
    );
  };

  const getClaimLineItemLink = (costCategoryId: string) => {
    return props.routes.reviewClaimLineItems.getLink({
      partnerId: props.partnerId,
      projectId: props.projectId,
      periodId: props.periodId,
      costCategoryId,
    });
  };

  const renderForm = (data: CombinedData): JSX.Element => {
    const options: ACC.SelectOption[] = [
      { id: ClaimStatus.MO_QUERIED, value: content.optionQueryClaim },
      { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: content.optionSubmitClaim },
    ];

    const validSubmittedClaimStatus = [
      ClaimStatus.MO_QUERIED,
      ClaimStatus.AWAITING_IAR,
      ClaimStatus.AWAITING_IUK_APPROVAL,
    ];

    const isValidStatus = validSubmittedClaimStatus.includes(data.editor.data.status);
    const isInteractive = isClient && !data.editor.data.status;

    const displayInteractiveForm = isValidStatus || !isInteractive;

    return (
      <Form.Form
        editor={data.editor}
        onSubmit={() => handleSubmit(data)}
        onChange={dto => props.onUpdate(false, dto)}
        qa="review-form"
      >
        <Form.Fieldset heading={content.sectionTitleHowToProceed}>
          <Form.Radio
            name="status"
            options={options}
            value={dto => options.find(x => x.id === dto.status)}
            update={(dto, val) => updateStatus(dto, val)}
            validation={data.editor.validator.status}
            inline
          />

          {displayInteractiveForm && renderFormHiddenSection(data.editor, Form, data.project)}
        </Form.Fieldset>
      </Form.Form>
    );
  };

  const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
    if (!documents.length || !selectedDocument.description) return undefined;

    const targetId = selectedDocument.description.toString();

    return documents.find(x => x.id === targetId);
  };

  const renderSupportingDocumentsItem = ({ documentsEditor, documents }: CombinedData) => {
    return (
      <ACC.AccordionItem
        title={content.accordionTitleSupportingDocumentsForm}
        qa="upload-supporting-documents-form-accordion"
      >
        <EnumDocuments documentsToCheck={allowedClaimDocuments}>
          {docs => (
            <>
              <UploadForm.Form
                enctype="multipart"
                editor={documentsEditor}
                onChange={dto => props.onUpload(false, dto)}
                onSubmit={() => props.onUpload(true, documentsEditor.data)}
                qa="projectDocumentUpload"
              >
                <UploadForm.Fieldset>
                  <ACC.Renderers.Markdown value={content.uploadInstruction} />

                  <ACC.DocumentGuidance />

                  <UploadForm.MultipleFileUpload
                    label={content.labelInputUpload}
                    name="attachment"
                    labelHidden
                    value={x => x.files}
                    update={(dto, files) => (dto.files = files || [])}
                    validation={documentsEditor.validator.files}
                  />

                  <UploadForm.DropdownList
                    label={content.descriptionLabel}
                    labelHidden={false}
                    hasEmptyOption
                    placeholder="-- No description --"
                    name="description"
                    validation={documentsEditor.validator.files}
                    options={docs}
                    value={selectedOption => filterDropdownList(selectedOption, docs)}
                    update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
                  />
                </UploadForm.Fieldset>

                <UploadForm.Submit name="reviewDocuments" styling="Secondary">
                  {content.buttonUpload}
                </UploadForm.Submit>
              </UploadForm.Form>

              <ACC.Section>
                <ACC.DocumentEdit
                  qa="claim-supporting-documents"
                  onRemove={document => props.onDelete(documentsEditor.data, document)}
                  documents={documents}
                />
              </ACC.Section>
            </>
          )}
        </EnumDocuments>
      </ACC.AccordionItem>
    );
  };

  const getMOReminderMessage = (competitionType: string) => {
    const reminderByCompetion = `${competitionType.toLowerCase()}-reminder`;

    return (
      <ACC.Renderers.SimpleString key={reminderByCompetion} qa={reminderByCompetion}>
        {content.monitoringReportReminder}
      </ACC.Renderers.SimpleString>
    );
  };

  const renderFormHiddenSection = (
    editor: IEditorStore<ClaimDto, ClaimDtoValidator>,
    Form: ACC.FormBuilder<ClaimDto>,
    project: ProjectDto,
  ) => {
    const moReminderElement = getMOReminderMessage(project.competitionType);
    const submitButtonElement = <Form.Submit key="button">{getSubmitButtonLabel(editor)}</Form.Submit>;
    const declarationElement = (
      <ACC.Renderers.SimpleString key="declaration">{content.claimReviewDeclaration}</ACC.Renderers.SimpleString>
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

  const getSubmitButtonLabel = (editor: IEditorStore<ClaimDto, ClaimDtoValidator>): string => {
    const showQueryLabel = editor.data.status === ClaimStatus.MO_QUERIED;

    // Note: With SSR remove dynamic text
    return showQueryLabel ? content.buttonSendQuery : content.buttonSubmit;
  };

  const updateStatus = (dto: ClaimDto, option: ACC.SelectOption | null | undefined) => {
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

  const handleSubmit = (payload: CombinedData): void => {
    let claimToUpdate = payload.editor.data;

    if (claimToUpdate.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
      claimToUpdate = prepareClaimAwaitingIukApproval(claimToUpdate);
    }

    props.onUpdate(true, claimToUpdate);
  };

  const combined = Pending.combine({
    project: props.project,
    partner: props.partner,
    costCategories: props.costCategories,
    claim: props.claim,
    claimDetails: props.costsSummaryForPeriod,
    editor: props.editor,
    documents: props.documents,
    documentsEditor: props.documentsEditor,
  });

  return <ACC.PageLoader pending={combined} render={data => renderContents(data)} />;
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

  return (
    <ReviewComponent
      {...props}
      content={reviewContent}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      claims={stores.claims.getAllClaimsForPartner(props.partnerId)}
      costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
      claimDetails={stores.claimDetails.getAllByPartner(props.partnerId)}
      forecastDetails={stores.forecastDetails.getAllByPartner(props.partnerId)}
      golCosts={stores.forecastGolCosts.getAllByPartner(props.partnerId)}
      statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
      editor={stores.claims.getClaimEditor(false, props.projectId, props.partnerId, props.periodId, initEditor)}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      documentsEditor={stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId)}
      onUpdate={(saving, dto) => {
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
      }}
      onUpload={(saving, dto) => {
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
      }}
      onDelete={(dto, document) => {
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
      }}
    />
  );
};

export const ReviewClaimRoute = defineRoute({
  routeName: "reviewClaim",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
  container: ReviewContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimReview.title),
});
