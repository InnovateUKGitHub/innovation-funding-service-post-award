import React from "react";

import * as ACC from "@ui/components";

import { ContainerBase } from "../../containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { ReasoningStepProps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { PCRDto } from "@framework/dtos";

interface Data {
  documents: Pending<DocumentSummaryDto[]>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface Callbacks {
  onFileChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class PrepareReasoningFilesStepComponent extends ContainerBase<ReasoningStepProps, Data, Callbacks> {
  render(): React.ReactNode {
    const combined = Pending.combine({
      documents: this.props.documents,
      documentsEditor: this.props.documentsEditor
    });
    return (
      <ACC.Loader
        pending={combined}
        render={({ documents, documentsEditor }) => (
          <React.Fragment>
            {this.renderFiles(documentsEditor, documents)}
            {this.renderForm(documentsEditor)}
          </React.Fragment>
        )}
      />
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    const PCRForm = ACC.TypedForm<PCRDto>();
    return (
      <ACC.Section qa="uploadFileSection">
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange(true, documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange(false, dto)}
          qa="projectChangeRequestItemUpload"
        >
          <UploadForm.Fieldset heading="Upload">
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              label="Upload files"
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => dto.files = files || []}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Button name="uploadFile" styling="Secondary">Upload documents</UploadForm.Button>
        </UploadForm.Form>

        <PCRForm.Form
          editor={this.props.editor}
          onChange={dto => this.props.onChange(dto)}
          onSubmit={() => this.props.onSave(this.props.editor.data)}
        >
          <PCRForm.Button name="filesStep" styling="Primary" onClick={() => this.props.onSave(this.props.editor.data)}>Save and continue</PCRForm.Button>
        </PCRForm.Form>

      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section title="Files uploaded" subtitle="All documents open in a new window.">
          <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" />
        </ACC.Section>
      );
    }
    return (
      <ACC.Section title="Files uploaded">
        <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
      </ACC.Section>
    );
  }
}

export const PCRPrepareReasoningFilesStep = (props: ReasoningStepProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareReasoningFilesStepComponent
          documents={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
          documentsEditor={stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(props.projectId, props.pcrId)}
          onFileChange={(saving, dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(saving, props.projectId, props.pcrId, dto, successMessage);
          }}
          onFileDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(props.projectId, props.pcrId, dto, document, "Your document has been removed.");
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);
