import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
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
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { Content } from "@content/content";
import { DropdownOption, IDocumentMessages } from "@ui/components";

import { EnumDocuments } from "./components";

export interface ReviewClaimParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface ReviewData {
  content: ReviewContent;
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

type ReviewContentKeys =
  | "competitionNameLabel"
  | "competitionTypeLabel"
  | "backlinkMessage"
  | "finalClaimMessage"
  | "logItemTitle"
  | "additionalInfoHint"
  | "forecastItemTitle"
  | "queryClaimOption"
  | "approveClaimOption"
  | "howToProceedSectionTitle"
  | "submitButton"
  | "sendQueryButton"
  | "uploadSupportingDocumentsFormAccordionTitle"
  | "uploadInputLabel"
  | "uploadButton"
  | "claimReviewDeclaration"
  | "monitoringReportReminder"
  | "additionalInfoSectionTitle"
  | "additionalInfoLabel"
  | "uploadInstruction1"
  | "uploadInstruction2"
  | "noDocumentsUploaded"
  | "descriptionLabel"
  | "noMatchingDocumentsMessage"
  | "searchDocumentsMessage";

type ReviewContentKTPKeys =
  | "additionalInfoHintIfYou"
  | "additionalInfoHintQueryClaim"
  | "additionalInfoHintSubmitClaim";

interface ReviewContent {
  default: Record<ReviewContentKeys, string>;
  document: IDocumentMessages;
  getCompetitionContent: (competitionType: string) => Record<ReviewContentKTPKeys, string> | undefined;
}

export function useReviewContent(): ReviewContent {
  const { getContent } = useContent();

  const defaultContent = {
    competitionNameLabel: getContent(x => x.projectDetails.projectLabels.competitionNameLabel),
    competitionTypeLabel: getContent(x => x.projectDetails.projectLabels.competitionTypeLabel),
    additionalInfoHint: getContent(x => x.claimReview.additionalInfoHint),
    backlinkMessage: getContent(x => x.claimReview.backLink),
    queryClaimOption: getContent(x => x.claimReview.queryClaimOption),
    approveClaimOption: getContent(x => x.claimReview.approveClaimOption),
    howToProceedSectionTitle: getContent(x => x.claimReview.howToProceedSectionTitle),
    submitButton: getContent(x => x.claimReview.submitButton),
    sendQueryButton: getContent(x => x.claimReview.sendQueryButton),
    uploadSupportingDocumentsFormAccordionTitle: getContent(
      x => x.claimReview.uploadSupportingDocumentsFormAccordionTitle,
    ),
    uploadInputLabel: getContent(x => x.claimReview.uploadInputLabel),
    uploadButton: getContent(x => x.claimReview.uploadButton),
    claimReviewDeclaration: getContent(x => x.claimReview.claimReviewDeclaration),
    monitoringReportReminder: getContent(x => x.claimReview.monitoringReportReminder),
    additionalInfoSectionTitle: getContent(x => x.claimReview.additionalInfoSectionTitle),
    additionalInfoLabel: getContent(x => x.claimReview.additionalInfoLabel),
    finalClaimMessage: getContent(x => x.claimReview.messages.finalClaimMessage),
    forecastItemTitle: getContent(x => x.claimReview.labels.forecastAccordionTitle),
    logItemTitle: getContent(x => x.claimReview.labels.claimLogAccordionTitle),
    uploadInstruction1: getContent(x => x.claimReview.documentMessages.uploadInstruction1),
    uploadInstruction2: getContent(x => x.claimReview.documentMessages.uploadInstruction2),
    noDocumentsUploaded: getContent(x => x.claimReview.documentMessages.noDocumentsUploaded),
    descriptionLabel: getContent(x => x.claimDocuments.descriptionLabel),
    noMatchingDocumentsMessage: getContent(x => x.projectDocuments.noMatchingDocumentsMessage),
    searchDocumentsMessage: getContent(x => x.projectDocuments.searchDocumentsMessage),
  };

  const document = (x: Content) => x.claimReview.documentMessages;

  const ktpContent: Record<ReviewContentKTPKeys, string> = {
    additionalInfoHintQueryClaim: getContent(x => x.claimReview.additionalInfoHintQueryClaim),
    additionalInfoHintSubmitClaim: getContent(x => x.claimReview.additionalInfoHintSubmitClaim),
    additionalInfoHintIfYou: getContent(x => x.claimReview.additionalInfoHintIfYou),
  };

  const getCompetitionContent = (competitionType: string) => {
    const { isKTP } = checkProjectCompetition(competitionType);

    return isKTP ? ktpContent : undefined;
  };

  return {
    getCompetitionContent,
    default: defaultContent,
    document,
  };
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

class ReviewComponent extends ContainerBase<ReviewClaimParams, ReviewData, ReviewCallbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      editor: this.props.editor,
      documents: this.props.documents,
      documentsEditor: this.props.documentsEditor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const { content } = this.props;
    const { isCombinationOfSBRI } = checkProjectCompetition(data.project.competitionType);
    const { isMo } = getAuthRoles(data.project.roles);

    const backLinkElement = (
      <ACC.BackLink route={this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id })}>
        {content.default.backlinkMessage}
      </ACC.BackLink>
    );

    return (
      <ACC.Page
        backLink={backLinkElement}
        error={data.editor.error}
        validator={[data.editor.validator, data.documentsEditor.validator]}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        {data.claim.isFinalClaim && (
          <ACC.ValidationMessage messageType="info" message={this.props.content.default.finalClaimMessage} />
        )}

        {data.partner.competitionName && (
          <ACC.Renderers.SimpleString className="margin-bottom-none">
            <span className="govuk-!-font-weight-bold">{content.default.competitionNameLabel}:</span>{" "}
            {data.partner.competitionName}
          </ACC.Renderers.SimpleString>
        )}

        <ACC.Renderers.SimpleString>
          <span className="govuk-!-font-weight-bold">{content.default.competitionTypeLabel}:</span>{" "}
          {data.partner.competitionType}
        </ACC.Renderers.SimpleString>

        {isMo && isCombinationOfSBRI && (
          <>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.claimReview.messages.milestoneContractAchievement} />
            </ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.claimReview.messages.milestoneToDo} />
            </ACC.Renderers.SimpleString>
            <ACC.UL>
              <li>
                <ACC.Content value={x => x.claimReview.messages.milestoneBullet1} />
              </li>
              <li>
                <ACC.Content value={x => x.claimReview.messages.milestoneBullet2} />
              </li>
              <li>
                <ACC.Content value={x => x.claimReview.messages.milestoneBullet3} />
              </li>
              <li>
                <ACC.Content value={x => x.claimReview.messages.milestoneBullet4} />
              </li>
            </ACC.UL>
          </>
        )}

        <ACC.Section title={<ACC.Claims.ClaimPeriodDate {...data} />}>
          <ACC.Claims.ClaimReviewTable
            {...data}
            standardOverheadRate={this.props.config.options.standardOverheadRate}
            validation={data.editor.validator.totalCosts}
            getLink={costCategoryId => this.getClaimLineItemLink(costCategoryId)}
          />
        </ACC.Section>

        <ACC.Section>
          <ACC.Accordion>
            {this.renderForecastItem()}

            <ACC.AccordionItem title={this.props.content.default.logItemTitle} qa="log-accordion">
              {/* Keeping logs inside loader because accordion defaults to closed*/}
              <ACC.Loader
                pending={this.props.statusChanges}
                render={statusChanges => <ACC.Logs qa="claim-status-change-table" data={statusChanges} />}
              />
            </ACC.AccordionItem>

            {this.renderSupportingDocumentsItem(data)}
          </ACC.Accordion>
        </ACC.Section>

        {this.renderForm(data)}
      </ACC.Page>
    );
  }

  private renderForecastItem() {
    const pendingForecastData: Pending<ACC.Claims.ForecastData> = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claim: this.props.claim,
      claims: this.props.claims,
      claimDetails: this.props.claimDetails,
      forecastDetails: this.props.forecastDetails,
      golCosts: this.props.golCosts,
      costCategories: this.props.costCategories,
    });

    return (
      <ACC.AccordionItem qa="forecast-accordion" title={this.props.content.default.forecastItemTitle}>
        <ACC.Loader
          pending={pendingForecastData}
          render={forecastData => <ACC.Claims.ForecastTable hideValidation data={forecastData} />}
        />
      </ACC.AccordionItem>
    );
  }

  private getClaimLineItemLink(costCategoryId: string) {
    return this.props.routes.reviewClaimLineItems.getLink({
      partnerId: this.props.partnerId,
      projectId: this.props.projectId,
      periodId: this.props.periodId,
      costCategoryId,
    });
  }

  private renderForm(data: CombinedData): JSX.Element {
    const { content } = this.props;
    const Form = ACC.TypedForm<ClaimDto>();

    const options: ACC.SelectOption[] = [
      { id: ClaimStatus.MO_QUERIED, value: content.default.queryClaimOption },
      { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: content.default.approveClaimOption },
    ];

    const validSubmittedClaimStatus = [
      ClaimStatus.MO_QUERIED,
      ClaimStatus.AWAITING_IAR,
      ClaimStatus.AWAITING_IUK_APPROVAL,
    ];
    const isValidStatus = validSubmittedClaimStatus.includes(data.editor.data.status);
    const isInteractive = this.props.isClient && !data.editor.data.status;

    const displayInteractiveForm = isValidStatus || !isInteractive;

    return (
      <Form.Form
        editor={data.editor}
        onSubmit={() => this.handleSubmit(data)}
        onChange={dto => this.props.onUpdate(false, dto)}
        qa="review-form"
      >
        <Form.Fieldset heading={content.default.howToProceedSectionTitle}>
          <Form.Radio
            name="status"
            options={options}
            value={dto => options.find(x => x.id === dto.status)}
            update={(dto, val) => this.updateStatus(dto, val)}
            validation={data.editor.validator.status}
            inline
          />

          {displayInteractiveForm && this.renderFormHiddenSection(data.editor, Form, data.project)}
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private filterDropdownList(selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) {
    if (!documents.length || !selectedDocument.description) return undefined;

    const targetId = selectedDocument.description.toString();

    return documents.find(x => x.id === targetId);
  }

  private renderSupportingDocumentsItem({ documentsEditor, documents }: CombinedData): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <EnumDocuments documentsToCheck={allowedClaimDocuments}>
        {docs => (
          <ACC.AccordionItem
            title={this.props.content.default.uploadSupportingDocumentsFormAccordionTitle}
            qa="upload-supporting-documents-form-accordion"
          >
            <UploadForm.Form
              enctype="multipart"
              editor={documentsEditor}
              onChange={dto => this.props.onUpload(false, dto)}
              onSubmit={() => this.props.onUpload(true, documentsEditor.data)}
              qa="projectDocumentUpload"
            >
              <UploadForm.Fieldset>
                <ACC.Renderers.SimpleString>{this.props.content.default.uploadInstruction1}</ACC.Renderers.SimpleString>
                <ACC.Renderers.SimpleString>{this.props.content.default.uploadInstruction2}</ACC.Renderers.SimpleString>

                <ACC.DocumentGuidance />

                <UploadForm.MultipleFileUpload
                  label={this.props.content.default.uploadInputLabel}
                  name="attachment"
                  labelHidden
                  value={x => x.files}
                  update={(dto, files) => (dto.files = files || [])}
                  validation={documentsEditor.validator.files}
                />

                <UploadForm.DropdownList
                  label={this.props.content.default.descriptionLabel}
                  labelHidden={false}
                  hasEmptyOption
                  placeholder="-- No description --"
                  name="description"
                  validation={documentsEditor.validator.files}
                  options={docs}
                  value={selectedOption => this.filterDropdownList(selectedOption, docs)}
                  update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
                />
              </UploadForm.Fieldset>

              <UploadForm.Submit name="reviewDocuments" styling="Secondary">
                {this.props.content.default.uploadButton}
              </UploadForm.Submit>
            </UploadForm.Form>

            <ACC.Section>
              <ACC.DocumentEdit
                qa="claim-supporting-documents"
                onRemove={document => this.props.onDelete(documentsEditor.data, document)}
                documents={documents}
              />
            </ACC.Section>
          </ACC.AccordionItem>
        )}
      </EnumDocuments>
    );
  }

  private getCompetitionHintContent(competitionType: string) {
    const { content } = this.props;

    const ktpContent = content.getCompetitionContent(competitionType);

    return ktpContent ? (
      <>
        {ktpContent.additionalInfoHintIfYou}
        <li>{ktpContent.additionalInfoHintQueryClaim}</li>
        <li>{ktpContent.additionalInfoHintSubmitClaim}</li>
      </>
    ) : (
      content.default.additionalInfoHint
    );
  }

  private getMOReminderMessage(competitionType: string) {
    const { content } = this.props;

    const reminderByCompetion = `${competitionType.toLowerCase()}-reminder`;

    return (
      <ACC.Renderers.SimpleString key={reminderByCompetion} qa={reminderByCompetion}>
        {content.default.monitoringReportReminder}
      </ACC.Renderers.SimpleString>
    );
  }

  private renderFormHiddenSection(
    editor: IEditorStore<ClaimDto, ClaimDtoValidator>,
    Form: ACC.FormBuilder<ClaimDto>,
    project: ProjectDto,
  ) {
    const moReminderElement = this.getMOReminderMessage(project.competitionType);
    const submitButtonElement = <Form.Submit key="button">{this.getSubmitButtonLabel(editor)}</Form.Submit>;
    const declarationElement = (
      <ACC.Renderers.SimpleString key="declaration">
        {this.props.content.default.claimReviewDeclaration}
      </ACC.Renderers.SimpleString>
    );

    // Note: <Fieldset> has not got got support for React.Fragment
    return [
      // Returning array here instead of React.Fragment as Fieldset data will not persist through Fragment,
      <Form.Fieldset
        key="form"
        heading={this.props.content.default.additionalInfoSectionTitle}
        qa="additional-info-form"
        headingQa="additional-info-heading"
      >
        <Form.MultilineString
          label={this.props.content.default.additionalInfoLabel}
          labelHidden
          hint={this.getCompetitionHintContent(project.competitionType)}
          name="comments"
          value={m => m.comments}
          update={(m, v) => (m.comments = v)}
          validation={editor.validator.comments}
          qa="info-text-area"
        />
      </Form.Fieldset>,
      declarationElement,
      moReminderElement,
      submitButtonElement,
    ];
  }

  private getSubmitButtonLabel(editor: IEditorStore<ClaimDto, ClaimDtoValidator>): string {
    const showQueryLabel = editor.data.status === ClaimStatus.MO_QUERIED;

    // Note: With SSR remove dynamic text
    return showQueryLabel ? this.props.content.default.sendQueryButton : this.props.content.default.submitButton;
  }

  private updateStatus(dto: ClaimDto, option: ACC.SelectOption | null | undefined) {
    if (option && (option.id === ClaimStatus.MO_QUERIED || option.id === ClaimStatus.AWAITING_IUK_APPROVAL)) {
      dto.status = option.id;
    }
  }

  private prepareClaimAwaitingIukApproval = (claimToUpdate: ClaimDto): ClaimDto => {
    const isIarReceived: boolean = claimToUpdate.iarStatus !== "Received";
    const isNotReceivedIar: boolean = !!claimToUpdate.isIarRequired && isIarReceived;

    const updatedStatus = isNotReceivedIar ? ClaimStatus.AWAITING_IAR : ClaimStatus.AWAITING_IUK_APPROVAL;

    claimToUpdate.status = updatedStatus;

    return claimToUpdate;
  };

  private handleSubmit = (payload: CombinedData): void => {
    let claimToUpdate = payload.editor.data;

    if (claimToUpdate.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
      claimToUpdate = this.prepareClaimAwaitingIukApproval(claimToUpdate);
    }

    this.props.onUpdate(true, claimToUpdate);
  };
}

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
            dto.status === ClaimStatus.MO_QUERIED
              ? x.claimReview.messages.claimQueried
              : x.claimReview.messages.claimApproved,
          ),
          () => stores.navigation.navigateTo(props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })),
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
          getContent(x => x.claimDocuments.documentMessages.getDocumentUploadedMessage(dto.files.length)),
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
          getContent(x => x.claimDocuments.documentMessages.documentDeleted(document)),
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
  getTitle: ({ content }) => content.claimReview.title(),
});
