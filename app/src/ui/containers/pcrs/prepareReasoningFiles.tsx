import React from "react";

import * as ACC from "@ui/components";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { Pending } from "@shared/pending";
import { PCRDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  documents: Pending<DocumentSummaryDto[]>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface Callbacks {
  onChange: (saveing: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class PrepareReasoningFilesComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      documents: this.props.documents,
      documentsEditor: this.props.documentsEditor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.documents, x.documentsEditor)} />;

  }

  private renderContents(project: ProjectDto, pcr: PCRDto, documents: DocumentSummaryDto[], documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrPrepareReasoning.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={documentsEditor.error}
        validator={documentsEditor.validator}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>
        {this.renderFiles(documentsEditor, documents)}
        {this.renderForm(documentsEditor)}
      </ACC.Page>
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onChange(true, documentsEditor.data)}
          onChange={(dto) => this.props.onChange(false, dto)}
          qa="projectChangeRequestItemUpload"
        >
          <UploadForm.Fieldset heading="Upload">
            <ACC.Renderers.SimpleString>You can upload up to 10 files of any type, as long as their combined file size is less than 10MB.</ACC.Renderers.SimpleString>
            <UploadForm.MulipleFileUpload
              label="Upload files"
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => dto.files = files || []}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Button name="uploadFile" styling="Primary">Upload documents</UploadForm.Button>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section  title="Files uploaded" subtitle="All documents open in a new window.">
          <ACC.DocumentListWithDelete onRemove={(document) => this.props.onDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" />
        </ACC.Section>
      );
    }
    return (
      <ACC.Section  title="Files uploaded">
        <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
      </ACC.Section>
    );
  }
}

const PrepareReasoningFilesContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareReasoningFilesComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          documents={stores.documents.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
          documentsEditor={stores.documents.getPcrOrPcrItemDocumentsEditor(props.projectId, props.pcrId)}
          onChange={(saving, dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.documents.updatePcrOrPcrItemDocumentsEditor(saving, props.projectId, props.pcrId, dto, successMessage);
          }}
          onDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.documents.deletePcrOrPcrItemDocumentsEditor(props.projectId, props.pcrId, dto, document, "Your document has been removed.");
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareReasoningFilesRoute = defineRoute({
  routeName: "prepare-reasoning-files",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning/files",
  container: PrepareReasoningFilesContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Upload files to provide reasoning to Innovate UK",
    displayTitle: "Upload files to provide reasoning to Innovate UK"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
