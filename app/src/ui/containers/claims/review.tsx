import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "@ui/containers/containerBase";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import {
  ClaimDetailsSummaryDto,
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  CostsSummaryForPeriodDto,
  DocumentDescription,
  ForecastDetailsDTO,
  GOLCostDto,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { projectCompetition, useContent } from "@ui/hooks";
import { Content } from "@content/content";
import { DropdownOption, IDocumentMessages } from "@ui/components";
import { noop } from "@ui/helpers/noop";

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
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

type ReviewContentKeys =
  | "backlinkMessage"
  | "isFinalClaimMessage"
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
  | "uploadInstruction"
  | "noDocumentsUploaded"
  | "descriptionLabel"
  | "newWindow"
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
    isFinalClaimMessage: getContent(x => x.claimReview.messages.finalClaim),
    forecastItemTitle: getContent(x => x.claimReview.labels.forecastAccordionTitle),
    logItemTitle: getContent(x => x.claimReview.labels.claimLogAccordionTitle),
    uploadInstruction: getContent(x => x.claimReview.documentMessages.uploadInstruction),
    noDocumentsUploaded: getContent(x => x.claimReview.documentMessages.noDocumentsUploaded),
    newWindow: getContent(x => x.claimReview.documentMessages.newWindow),
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
    const { isKTP } = projectCompetition(competitionType);

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
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
}

interface ReviewState {
  documentFilter: string;
}

class ReviewComponent extends ContainerBaseWithState<ReviewClaimParams, ReviewData, ReviewCallbacks, ReviewState> {
  constructor(props: ContainerProps<ReviewClaimParams, ReviewData, ReviewCallbacks>) {
    super(props);
    this.state = {
      documentFilter: "",
    };
  }

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

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private renderContents(data: CombinedData) {
    const { content } = this.props;

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
          <ACC.ValidationMessage messageType="info" message={this.props.content.default.isFinalClaimMessage} />
        )}

        {this.renderClaimReviewSection(data)}

        <ACC.Section>
          <ACC.Accordion>
            {this.renderForecastItem()}

            {this.renderLogsItem()}

            {this.renderSupportingDocumentsItem(data)}
          </ACC.Accordion>
        </ACC.Section>

        {this.renderForm(data)}
      </ACC.Page>
    );
  }

  private renderClaimReviewSection(data: CombinedData) {
    return (
      <ACC.Section title={this.getClaimPeriodTitle(data)}>
        <ACC.Claims.ClaimReviewTable
          {...data}
          standardOverheadRate={this.props.config.options.standardOverheadRate}
          validation={data.editor.validator.totalCosts}
          getLink={costCategoryId => this.getClaimLineItemLink(costCategoryId)}
        />
      </ACC.Section>
    );
  }

  private renderForecastItem() {
    const { content } = this.props;
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
      <ACC.AccordionItem title={content.default.forecastItemTitle} qa="forecast-accordion">
        <ACC.Loader
          pending={pendingForecastData}
          render={forecastData => <ACC.Claims.ForecastTable data={forecastData} hideValidation={true} />}
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

  private renderForm(data: CombinedData) {
    const { content } = this.props;
    const Form = ACC.TypedForm<ClaimDto>();

    const options: ACC.SelectOption[] = [
      { id: ClaimStatus.MO_QUERIED, value: content.default.queryClaimOption },
      { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: content.default.approveClaimOption },
    ];

    return (
      <Form.Form
        editor={data.editor}
        onSubmit={() => this.props.onUpdate(true, data.editor.data)}
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
            inline={true}
          />

          {this.renderFormHiddenSection(data.editor, Form, data.project)}
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private filterDropdownList(selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) {
    if (!documents.length || !selectedDocument.description) return undefined;

    const targetId = selectedDocument.description.toString();

    return documents.find(x => x.id === targetId);
  }

  private readonly claimAllowedDocuments: DocumentDescription[] = [
    DocumentDescription.IAR,
    DocumentDescription.Evidence,
    DocumentDescription.EndOfProjectSurvey,
    DocumentDescription.StatementOfExpenditure,
    DocumentDescription.LMCMinutes,
    DocumentDescription.ScheduleThree,
  ];

  renderSupportingDocumentsItem({ documentsEditor, documents }: CombinedData): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <EnumDocuments documentsToCheck={this.claimAllowedDocuments}>
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
                <ACC.Renderers.SimpleString>{this.props.content.default.uploadInstruction}</ACC.Renderers.SimpleString>

                <ACC.DocumentGuidance />

                <UploadForm.MulipleFileUpload
                  label={this.props.content.default.uploadInputLabel}
                  name="attachment"
                  labelHidden={true}
                  value={x => x.files}
                  update={(dto, files) => (dto.files = files || [])}
                  validation={documentsEditor.validator.files}
                />

                <UploadForm.DropdownList
                  label={this.props.content.default.descriptionLabel}
                  labelHidden={false}
                  hasEmptyOption={true}
                  placeholder="-- No description --"
                  name="description"
                  validation={documentsEditor.validator.files}
                  options={docs}
                  value={selectedOption => this.filterDropdownList(selectedOption, docs)}
                  update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
                />
              </UploadForm.Fieldset>

              <UploadForm.Submit styling="Secondary">{this.props.content.default.uploadButton}</UploadForm.Submit>
            </UploadForm.Form>

            {this.renderDocumentsFilterSection(documents, documentsEditor)}
          </ACC.AccordionItem>
        )}
      </EnumDocuments>
    );
  }

  private renderDocumentsFilterSection(
    documents: DocumentSummaryDto[],
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
  ) {
    const { isClient } = this.props;
    const documentFilterText = this.state.documentFilter;
    const hasTextToFilter = !!documentFilterText.length;

    const documentsToDisplay =
    isClient && hasTextToFilter
        ? documents.filter(document => new RegExp(documentFilterText, "gi").test(document.fileName))
        : documents;

    return (
      <>
        {isClient && this.renderDocumentSearchField(documents)}

        {!documentsToDisplay.length && !!documents.length ? (
          <ACC.Renderers.SimpleString qa="noDocuments">
            {this.props.content.default.noMatchingDocumentsMessage}
          </ACC.Renderers.SimpleString>
        ) : (
          this.renderDocumentResultsTable(documentsEditor, documentsToDisplay)
        )}
      </>
    );
  }

  private renderDocumentSearchField(documents: DocumentSummaryDto[]) {
    if (documents.length === 0) {
      return (
        <ACC.ValidationMessage
          qa={"noDocuments"}
          message={<ACC.Content value={x => x.projectDocuments.documentMessages.noDocumentsUploaded} />}
          messageType="info"
        />
      );
    }

    const FilterForm = ACC.TypedForm<ReviewState>();

    const handleOnSearch = ({ documentFilter }: ReviewState) => {
      const filteredQuery = documentFilter.trim();
      const newValue = !!filteredQuery.length ? filteredQuery : "";

      this.setState({ documentFilter: newValue });
    };

    return (
      <>
        <ACC.Renderers.SimpleString>{this.props.content.default.newWindow}</ACC.Renderers.SimpleString>
        <FilterForm.Form data={this.state} onSubmit={noop} onChange={handleOnSearch} qa="document-mo-search-form">
          <FilterForm.Search
            name="document-filter"
            labelHidden={true}
            value={x => x.documentFilter}
            update={(x, v) => (x.documentFilter = v || "")}
            placeholder={this.props.content.default.searchDocumentsMessage}
          />
        </FilterForm.Form>
      </>
    );
  }

  private renderDocumentResultsTable(
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
    documents: DocumentSummaryDto[],
  ) {

    return documents.length ? (
      <ACC.Section>
        <ACC.DocumentTableWithDelete
          onRemove={document => this.props.onDelete(documentsEditor.data, document)}
          documents={documents}
          qa="claim-supporting-documents"
        />
      </ACC.Section>
    ) : null;
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

  private getMODeclarationMessage(competitionType: string) {
    const { isKTP } = projectCompetition(competitionType);

    if (isKTP) return null;

    return (
      <ACC.Renderers.SimpleString key="declaration">
        {this.props.content.default.claimReviewDeclaration}
      </ACC.Renderers.SimpleString>
    );
  }

  private getMOReminderMessage(competitionType: string) {
    const { isKTP } = projectCompetition(competitionType);
    const reminderMessage = this.props.content.default.monitoringReportReminder;

    if (isKTP) {
      return <ACC.ValidationMessage qa="ktp-mo-report-reminder" messageType="info" message={reminderMessage} />;
    }

    return <ACC.Renderers.SimpleString key="reminder">{reminderMessage}</ACC.Renderers.SimpleString>;
  }

  private renderFormHiddenSection(
    editor: IEditorStore<ClaimDto, ClaimDtoValidator>,
    Form: ACC.FormBuilder<ClaimDto>,
    project: ProjectDto,
  ) {
    // on client if the status hasn't yet been set by the radio buttons then don't show
    // if server rendering we need to always show
    if (!editor.data.status && this.props.isClient) {
      return null;
    }

    const submitButtonLabel = this.getSubmitButtonLabel(editor);

    const hintValue = this.getCompetitionHintContent(project.competitionType);
    const declarationMessage = this.getMODeclarationMessage(project.competitionType);
    const reminderMessage = this.getMOReminderMessage(project.competitionType);

    // Note: <Fieldset> has not got got support for React.Fragment
    return [
      // Returning array here instead of React.Fragment as Fieldset data will not persist through Fragment,
      // tslint:disable-next-line: jsx-wrap-multiline
      <Form.Fieldset
        key="form"
        heading={this.props.content.default.additionalInfoSectionTitle}
        qa="additional-info-form"
        headingQa="additional-info-heading"
      >
        <Form.MultilineString
          label={this.props.content.default.additionalInfoLabel}
          labelHidden={true}
          hint={hintValue}
          name="comments"
          value={m => m.comments}
          update={(m, v) => (m.comments = v)}
          validation={editor.validator.comments}
          qa="info-text-area"
        />
      </Form.Fieldset>,
      declarationMessage,
      reminderMessage,
      !!submitButtonLabel ? <Form.Submit key="button">{submitButtonLabel}</Form.Submit> : null,
    ];
  }

  private getSubmitButtonLabel(editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {
    // If rendering from the server then always use "Submit"
    if (!this.props.isClient || editor.data.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
      return this.props.content.default.submitButton;
    }

    if (editor.data.status === ClaimStatus.MO_QUERIED) {
      return this.props.content.default.sendQueryButton;
    }

    return null;
  }

  private updateStatus(dto: ClaimDto, option: ACC.SelectOption | null | undefined) {
    if (option && (option.id === ClaimStatus.MO_QUERIED || option.id === ClaimStatus.AWAITING_IUK_APPROVAL)) {
      dto.status = option.id;
    }
  }

  private renderLogsItem() {
    return (
      <ACC.AccordionItem title={this.props.content.default.logItemTitle} qa="log-accordion">
        {/* Keeping logs inside loader because accordion defaults to closed*/}
        <ACC.Loader
          pending={this.props.statusChanges}
          render={statusChanges => <ACC.Logs qa="claim-status-change-table" data={statusChanges} />}
        />
      </ACC.AccordionItem>
    );
  }
}

const initEditor = (dto: ClaimDto) => {
  // if the status hasn't already been set to "MO Queried" or "Awaiting IUK Approval" then set the status to New so that the validation kicks in a forces a change
  if (dto.status !== ClaimStatus.MO_QUERIED && dto.status !== ClaimStatus.AWAITING_IUK_APPROVAL) {
    dto.status = ClaimStatus.UNKNOWN;
  }
};

const ReviewContainer = (props: ReviewClaimParams & BaseProps) => {
  const stores = useStores();
  const { content } = useContent();
  const reviewContent = useReviewContent();

  return (
    <ReviewComponent
      content={reviewContent}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      costCategories={stores.costCategories.getAll()}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      claims={stores.claims.getAllClaimsForPartner(props.partnerId)}
      costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
      claimDetails={stores.claimDetails.getAllByPartner(props.partnerId)}
      forecastDetails={stores.forecastDetails.getAllByPartner(props.partnerId)}
      golCosts={stores.forecastGolCosts.getAllByPartner(props.partnerId)}
      statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
      editor={stores.claims.getClaimEditor(props.projectId, props.partnerId, props.periodId, initEditor)}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      documentsEditor={stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId)}
      onUpdate={(saving, dto) => {
        stores.messages.clearMessages();
        const message =
          dto.status === ClaimStatus.MO_QUERIED
            ? content.claimReview.messages.claimQueried
            : content.claimReview.messages.claimApproved;
        stores.claims.updateClaimEditor(
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          message.content,
          () => stores.navigation.navigateTo(props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })),
        );
      }}
      onUpload={(saving, dto) => {
        stores.messages.clearMessages();
        const successMessage = content.claimDocuments.documentMessages.getDocumentUploadedMessage(dto.files.length);
        stores.claimDocuments.updateClaimDocumentsEditor(
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          successMessage.content,
        );
      }}
      onDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.claimDocuments.deleteClaimDocument(props.projectId, props.partnerId, props.periodId, dto, document);
      }}
      {...props}
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
