import React from "react";

import * as ACC from "@ui/components";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { PCRItemType } from "@framework/constants";

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  pcrItemType: Pending<PCRItemTypeDto>;
  documents: Pending<DocumentSummaryDto[]>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface Callbacks {
  onChange: (saveing: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class PrepareItemFilesComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      pcrItem: this.props.pcrItem,
      pcrItemType: this.props.pcrItemType,
      documents: this.props.documents,
      documentsEditor: this.props.documentsEditor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.pcrItemType, x.documents, x.documentsEditor)} />;

  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, pcrItemType: PCRItemTypeDto, documents: DocumentSummaryDto[], documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: this.props.itemId })}>Back to {pcrItem.typeName}</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={documentsEditor.error}
        validator={documentsEditor.validator}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>
        {this.renderTemplateLinks(pcrItemType)}
        {this.renderFiles(documentsEditor, documents)}
        {this.renderForm(pcrItem, documentsEditor)}
      </ACC.Page>
    );
  }

  private renderForm(pcrItem: PCRItemDto, documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    switch (pcrItem.type) {
      case PCRItemType.AccountNameChange:
      case PCRItemType.PartnerAddition:
      case PCRItemType.PartnerWithdrawal:
      case PCRItemType.ProjectTermination:
      case PCRItemType.MultiplePartnerFinancialVirement:
      case PCRItemType.SinglePartnerFinancialVirement:
        return this.renderMultipleUploads(documentsEditor);
      default:
        return <ACC.ValidationMessage message="Cannot upload documents to this item" messageType="error" />;
    }
  }

  private renderMultipleUploads(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
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
          <UploadForm.Button name="uploadFile">Upload</UploadForm.Button>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderTemplateLinks(itemType: PCRItemTypeDto) {
    if(!itemType.files || !itemType.files.length) {
      return null;
    }
    return(
      <ACC.Section title="Templates" qa="templates">
        <ACC.LinksList links={itemType.files.map(x => ({text: x.name, url: x.relativeUrl}))}/>
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

const PrepareItemFilesContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareItemFilesComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
          pcrItemType={stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId)}
          documents={stores.documents.pcrOrPcrItemDocuments(props.projectId, props.itemId)}
          documentsEditor={stores.documents.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId)}
          onChange={(saving, dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.documents.updatePcrOrPcrItemDocumentsEditor(saving, props.projectId, props.itemId, dto, successMessage);
          }}
          onDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.documents.deletePcrOrPcrItemDocumentsEditor(props.projectId, props.itemId, dto, document, "Your document has been removed.");
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareItemFilesRoute = defineRoute({
  routeName: "prepare-item-files",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/files",
  container: PrepareItemFilesContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getTitle: (store, params, stores) => {
    const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Upload files to ${typeName}` : "Upload files to project change request item",
      displayTitle: typeName ? `Upload files to ${typeName}` : "Upload files to project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
