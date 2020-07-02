import React from "react";
import * as ACC from "@ui/components";
import { ClaimDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ContentConsumer, IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { DocumentDescription } from "@framework/constants";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDescriptionDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DropdownOption } from "@ui/components";
import { getAllEnumValues } from "@shared/enumHelper";

export interface ClaimDocumentsPageParams {
  projectId: string;
  periodId: number;
  partnerId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
  documentDescriptions: Pending<DocumentDescriptionDto[]>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class ClaimDocumentsComponent extends ContainerBase<ClaimDocumentsPageParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      documents: this.props.documents,
      claim: this.props.claim,
      documentDescriptions: this.props.documentDescriptions,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.documents, x.claim, x.documentDescriptions)} />;
  }

  private readonly allowedDocuments = [
    DocumentDescription.IAR,
    DocumentDescription.StatementOfExpenditure,
    DocumentDescription.EndOfProjectSurvey,
    DocumentDescription.Evidence
  ];

  renderContents(project: ProjectDto, editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[], claim: ClaimDto, documentDescriptions: DocumentDescriptionDto[]) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    const documentTypeOptions: DropdownOption[] = documentDescriptions
      .filter(x => this.allowedDocuments.indexOf(x.id) >= 0 )
      .map(x => ({ id: x.id.toString(), value: x.label }));

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project} />}
        error={(editor.error)}
        validator={editor.validator}
        backLink={
          <ACC.BackLink route={this.props.routes.prepareClaim.getLink({projectId: this.props.projectId, partnerId: this.props.partnerId, periodId:this.props.periodId})}>
            <ACC.Content value={x => x.claimDocuments.backLink()} />
          </ACC.BackLink>
        }
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {claim.isFinalClaim && <ACC.ValidationMessage messageType="info" messageContent={x => x.claimDocuments.messages.finalClaim()}/>}
        <ACC.Section>
          {this.renderGuidanceText(claim)}
        </ACC.Section>
        <ACC.Section titleContent={x => x.claimDocuments.uploadSectionTitle()}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            qa="claimDocumentsForm"
            onChange={(dto) => this.props.onChange(false, dto)}
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance />
              <UploadForm.MulipleFileUpload
                label="Upload documents"
                labelHidden={true}
                name="attachment"
                validation={editor.validator.files}
                value={data => data.files}
                update={(dto, files) => dto.files = files || []}
              />
              <UploadForm.DropdownList
                label="Description"
                labelHidden={false}
                hasEmptyOption={true}
                placeholder="-- No description --"
                name="description"
                validation={editor.validator.description}
                options={documentTypeOptions}
                value={data => data.description ? documentTypeOptions.find(x => x.id === data.description!.toString()) : undefined}
                update={(dto, value) => dto.description = value ? parseInt(value.id, 10) : undefined}
              />
            </UploadForm.Fieldset>
            {/*TODO @documents-content make button label consistent*/}
            <UploadForm.Button styling="Secondary" name="upload" onClick={() => this.props.onChange(true, editor.data)}>Upload documents</UploadForm.Button>
          </UploadForm.Form>
        </ACC.Section>
        <ACC.Section titleContent={x => x.claimDocuments.documentsListSectionTitle()}>
          {this.renderDocuments(editor, documents)}
        </ACC.Section>
        <ACC.Section qa="buttons">
          {this.renderNextStepLink(claim)}
          <ACC.Link styling="SecondaryButton" id="save-claim" route={this.getDashboardLink(project)}><ACC.Content value={x => x.claimDocuments.saveAndReturnButton()} /></ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderNextStepLink(claim: ClaimDto) {
    if (claim.isFinalClaim) {
      return (
        <ACC.Link styling="PrimaryButton" id="continue-claim" route={this.props.routes.claimSummary.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>
          <ACC.Content value={x => x.claimDocuments.saveAndContinueToSummaryButton()}/>
        </ACC.Link>
      );
    }
    return (
      <ACC.Link styling="PrimaryButton" id="continue-claim" route={this.props.routes.claimForecast.getLink({projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId})}>
        <ACC.Content value={x => x.claimDocuments.saveAndContinueToForecastButton()}/>
      </ACC.Link>
    );
  }

  private getDashboardLink(project: ProjectDto) {
    const isPmOrMo = (project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    return isPmOrMo
      ? this.props.routes.allClaimsDashboard.getLink({ projectId: project.id })
      : this.props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: this.props.partnerId });
  }

  private renderGuidanceText(claim: ClaimDto) {
    if (claim.isIarRequired && claim.isFinalClaim) {
      return (
        <span data-qa="iarText"><ACC.Content value={x => x.claimDocuments.messages.finalClaimGuidance()}/></span>
      );
    }

    if (claim.isIarRequired) {
      return <ACC.Renderers.SimpleString qa="iarText"><ACC.Content value={x => x.claimDocuments.messages.iarRequired()} /></ACC.Renderers.SimpleString>;
    }

    return null;
  }

  private renderDocuments(editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (!documents.length) {
      return (
        <ACC.Section>
          <ACC.ValidationMessage messageContent={x => x.claimDocuments.documentMessages.noDocumentsUploaded()} messageType="info" />
        </ACC.Section>
      );
    }

    return (
      <ACC.Section subtitle="All documents open in a new window">
        {documents.length ? <ACC.DocumentTableWithDelete hideRemove={x => this.allowedDocuments.indexOf(x.description!) < 0} onRemove={(document) => this.props.onDelete(editor.data, document)} documents={documents} qa="claim-supporting-documents"/> : null}
      </ACC.Section>
    );
  }
}

const ClaimDocumentsContainer = (props: ClaimDocumentsPageParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ContentConsumer>{
          content => (
            <ClaimDocumentsComponent
              project={stores.projects.getById(props.projectId)}
              editor={stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId)}
              documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
              // TODO temporary measure until we get the description types from SF
              documentDescriptions={Pending.done( getAllEnumValues(DocumentDescription).map(x => ({ id: x, label: content.claimDocuments.documents.labels().documentDescriptionLabel(x).content })) )}
              claim={stores.claims.get(props.partnerId, props.periodId)}
              onChange={(saving, dto) => {
                stores.messages.clearMessages();
                const successMessage = dto.files.length === 1
                  ? content.claimDocuments.documentMessages.documentUploadedSuccess().content
                  : content.claimDocuments.documentMessages.documentsUploadedSuccess(dto.files.length).content;
                stores.claimDocuments.updateClaimDocumentsEditor(saving, props.projectId, props.partnerId, props.periodId, dto, successMessage);
              }}
              onDelete={(dto, document) => {
                stores.messages.clearMessages();
                stores.claimDocuments.deleteClaimDocument(props.projectId, props.partnerId, props.periodId, dto, document);
              }}
              {...props}
            />
          )
        }</ContentConsumer>
      )
    }
  </StoresConsumer>
);

export const ClaimDocumentsRoute = defineRoute({
  routeName: "claimDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/documents",
  container: ClaimDocumentsContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({content}) => content.claimDocuments.title(),
});
