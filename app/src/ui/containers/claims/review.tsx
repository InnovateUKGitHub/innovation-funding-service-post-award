import React from "react";
import * as ACC from "@ui/components";
import { ContentConsumer, IEditorStore, StoresConsumer } from "@ui/redux";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
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
  ProjectRole
} from "@framework/types";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export interface ReviewClaimParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
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

interface Callbacks {
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

class ReviewComponent extends ContainerBase<ReviewClaimParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      editor: this.props.editor,
      documents: this.props.documents,
      documentsEditor: this.props.documentsEditor
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private renderContents(data: CombinedData) {

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id })}><ACC.Content value={x => x.claimReview.backLink}/></ACC.BackLink>}
        error={data.editor.error}
        validator={[data.editor.validator, data.documentsEditor.validator]}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {data.claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message={x => x.claimReview.messages.finalClaim}/>}
        {this.renderClaimReviewSection(data)}
        <ACC.Section>
          <ACC.Accordion>
            {this.renderForecastItem()}
            {this.renderLogsItem()}
            {this.renderUploadClaimValidationForm(data)}
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
    const pendingForecastData: Pending<ACC.Claims.ForecastData> = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claim: this.props.claim,
      claims: this.props.claims,
      claimDetails: this.props.claimDetails,
      forecastDetails: this.props.forecastDetails,
      golCosts: this.props.golCosts,
      costCategories: this.props.costCategories
    });

    return (
      <ACC.AccordionItem titleContent={x => x.claimReview.labels.forecastAccordionTitle} qa="forecast-accordion">
        <ACC.Loader
          pending={pendingForecastData}
          render={(forecastData) => (<ACC.Claims.ForecastTable data={forecastData} hideValidation={true} />)}
        />
      </ACC.AccordionItem>
    );
  }

  private getClaimLineItemLink(costCategoryId: string) {
    return this.props.routes.reviewClaimLineItems.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId });
  }

  private renderForm(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const options: ACC.SelectOption[] = [
      { id: ClaimStatus.MO_QUERIED, value: <ACC.Content value={x => x.claimReview.queryClaimOption} /> },
      { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: <ACC.Content value={x => x.claimReview.approveClaimOption} /> },
    ];

    return (
      <Form.Form
        editor={data.editor}
        onSubmit={() => this.props.onUpdate(true, data.editor.data)}
        onChange={(dto) => this.props.onUpdate(false, dto)}
        qa="review-form"
      >
        <Form.Fieldset headingContent={x => x.claimReview.howToProceedSectionTitle}>
          <Form.Radio
            name="status"
            options={options}
            value={(dto) => options.find(x => x.id === dto.status)}
            update={(dto, val) => this.updateStatus(dto, val)}
            validation={data.editor.validator.status}
            inline={true}
          />
          {this.renderFormHiddenSection(data.editor, Form)}
        </Form.Fieldset>
      </Form.Form>
    );
  }

  renderUploadClaimValidationForm(data: CombinedData): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.AccordionItem titleContent={x => x.claimReview.uploadClaimValidationFormAccordionTitle} qa="upload-claims-validation-form-accordion">
        <UploadForm.Form
          enctype="multipart"
          editor={data.documentsEditor}
          onChange={dto => this.props.onUpload(false, {...dto, description: DocumentDescription.ClaimValidationForm})}
          onSubmit={() => this.props.onUpload(true, {...data.documentsEditor.data, description: DocumentDescription.ClaimValidationForm})}
          qa="projectDocumentUpload"
        >
          <UploadForm.Fieldset>
            <ACC.Content value={x => x.claimReview.messages.uploadClaimValidationFormInstructions} />
            <ACC.DocumentGuidanceWithContent documentMessages={x => x.claimReview.documentMessages} />
            <UploadForm.MulipleFileUpload
              labelContent={x => x.claimReview.uploadInputLabel}
              name="attachment"
              labelHidden={true}
              value={x => x.files}
              update={(dto, files) => dto.files = files || []}
              validation={data.documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Submit styling="Secondary"><ACC.Content value={x => x.claimReview.uploadButton} /></UploadForm.Submit>
        </UploadForm.Form>
        {this.renderDocumentList(data.documentsEditor, data.documents)}
      </ACC.AccordionItem>
    );
  }

  private renderDocumentList(editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (!documents.length) {
      return (
        <ACC.ValidationMessage message={x => x.claimDocuments.documentMessages.noDocumentsUploaded} messageType="info" />
      );
    }

    const claimValidationFormDocuments = documents.filter(x => x.description === DocumentDescription.ClaimValidationForm);
    const claimSupportingDocuments = documents.filter(x => x.description !== DocumentDescription.ClaimValidationForm);

    return (
      <React.Fragment>
        {claimValidationFormDocuments.length ? <ACC.DocumentListWithDelete documents={claimValidationFormDocuments} onRemove={(document) => this.props.onDelete(editor.data, document)} qa="claim-validation-form-documents"/> : null}
        {claimSupportingDocuments.length ? <ACC.DocumentList documents={claimSupportingDocuments} qa="claim-supporting-documents" /> : null}
      </React.Fragment>
    );
  }

  private renderFormHiddenSection(editor: IEditorStore<ClaimDto, ClaimDtoValidator>, Form: ACC.FormBuilder<ClaimDto>) {
    // on client if the status hasn't yet been set by the radio buttons then don't show
    // if server rendering we need to always show
    if (!editor.data.status && this.props.isClient) {
      return null;
    }

    const submitButtonLabel = this.getSubmitButtonLabel(editor);

    return [
      // Returning array here instead of React.Fragment as Fieldset data will not persist through Fragment,
      (
      <Form.Fieldset key="form" headingContent={x => x.claimReview.additionalInfoSectionTitle} qa="additional-info-form" headingQa="additional-info-heading">
        <Form.MultilineString
          label="additional-info"
          labelHidden={true}
          hintContent={x => x.claimReview.additionalInfoHint}
          name="comments"
          value={m => m.comments}
          update={(m, v) => m.comments = v}
          validation={editor.validator.comments}
          qa="info-text-area"
        />
      </Form.Fieldset>
      ),
      (
        <ACC.Renderers.SimpleString key="reminder">
          <ACC.Content value={x => x.claimReview.monitoringReportReminder} />
        </ACC.Renderers.SimpleString>
      ),
      !!submitButtonLabel ? <Form.Submit key="button">{submitButtonLabel}</Form.Submit> : null
    ];
}

  private getSubmitButtonLabel(editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {
  // If rendering from the server then always use "Submit"
  if (!this.props.isClient || editor.data.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
    return <ACC.Content value={x => x.claimReview.submitButton} />;
  }

  if (editor.data.status === ClaimStatus.MO_QUERIED) {
    return <ACC.Content value={x => x.claimReview.sendQueryButton} />;
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
    <ACC.AccordionItem titleContent={x => x.claimReview.labels.claimLogAccordionTitle} qa="log-accordion">
      {/* Keeping logs inside loader because accordion defaults to closed*/}
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => (
          <ACC.Logs qa="claim-status-change-table" data={statusChanges} />
        )}
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

const ReviewContainer = (props: ReviewClaimParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ContentConsumer>
          {
            content => (
              <ReviewComponent
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
                  const message = dto.status === ClaimStatus.MO_QUERIED ? content.claimReview.messages.claimQueried : content.claimReview.messages.claimApproved;
                  stores.claims.updateClaimEditor(saving, props.projectId, props.partnerId, props.periodId, dto, message.content, () => stores.navigation.navigateTo(props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })));
                }}
                onUpload={(saving, dto) => {
                  stores.messages.clearMessages();
                  const successMessage = dto.files.length === 1 ? content.claimDocuments.documentMessages.documentUploaded : content.claimDocuments.documentMessages.documentsUploaded(dto.files.length);
                  stores.claimDocuments.updateClaimDocumentsEditor(saving, props.projectId, props.partnerId, props.periodId, dto, successMessage.content);
                }}
                onDelete={(dto, document) => {
                  stores.messages.clearMessages();
                  stores.claimDocuments.deleteClaimDocument(props.projectId, props.partnerId, props.periodId, dto, document);
                }}
                {...props}
              />
            )
          }
        </ContentConsumer>
      )
    }
  </StoresConsumer>
);

export const ReviewClaimRoute = defineRoute({
  routeName: "reviewClaim",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
  container: ReviewContainer,
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({content}) => content.claimReview.title(),
});
