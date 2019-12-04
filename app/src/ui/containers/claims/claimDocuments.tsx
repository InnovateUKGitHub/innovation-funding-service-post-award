import React from "react";
import * as ACC from "@ui/components";
import { ClaimDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

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
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.documents, x.claim)} />;
  }

  renderContents(project: ProjectDto, editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[], claim: ClaimDto) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project} />}
        error={(editor.error)}
        validator={editor.validator}
        backLink={<ACC.BackLink route={this.props.routes.prepareClaim.getLink({ periodId: this.props.periodId, projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back to costs to be claimed</ACC.BackLink>}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message="This is your final claim"/>}
        <ACC.Section>
          <ACC.Renderers.SimpleString>Guidance text</ACC.Renderers.SimpleString>
        </ACC.Section>
        <ACC.Section title="Upload">
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
            </UploadForm.Fieldset>
            <UploadForm.Button styling="Secondary" name="upload" onClick={() => this.props.onChange(true, editor.data)}>Upload documents</UploadForm.Button>
          </UploadForm.Form>
        </ACC.Section>
        <ACC.Section title="List of documents">
          {this.renderDocuments(editor, documents)}
        </ACC.Section>
        <ACC.Section qa="buttons">
          <ACC.Link styling="PrimaryButton" id="continue-claim" route={this.props.routes.claimForecast.getLink({projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId})}>Continue to update forecast</ACC.Link>
          <ACC.Link styling="SecondaryButton" id="save-claim" route={this.props.routes.allClaimsDashboard.getLink({projectId: this.props.projectId})}>Save and return to claims</ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderDocuments(editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (!documents.length) {
      return (
        <ACC.Section>
          <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
        </ACC.Section>
      );
    }

    return (
      <ACC.Section subtitle="All documents open in a new window">
        <ACC.DocumentListWithDelete onRemove={(document) => this.props.onDelete(editor.data, document)} documents={documents} qa="claim-documents"/>
      </ACC.Section>
    );
  }
}

const ClaimDocumentsContainer = (props: ClaimDocumentsPageParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ClaimDocumentsComponent
          project={stores.projects.getById(props.projectId)}
          editor={stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId)}
          documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
          claim={stores.claims.get(props.partnerId, props.periodId)}
          onChange={(saving, dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.claimDocuments.updateClaimDocumentsEditor(saving, props.projectId, props.partnerId, props.periodId, dto, successMessage);
          }}
          onDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.claimDocuments.deleteClaimDocument(props.projectId, props.partnerId, props.periodId, dto, document);
          }}
          {...props}
        />
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
  getTitle: () => ({
    htmlTitle: "Claim documents",
    displayTitle: "Claim documents"
  })
});
