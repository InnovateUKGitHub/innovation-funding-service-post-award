import React, { Component } from "react";

import * as ACC from "@ui/components";

import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { ReasoningStepProps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface InnerProps {
  documents: Pending<DocumentSummaryDto[]>;
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}
class PrepareReasoningFilesStepComponent extends Component<ReasoningStepProps & InnerProps> {
  render(): React.ReactNode {

    return (
      <ACC.Loader
        pending={this.props.documents}
        render={(documents) => (
          <React.Fragment>
            {this.renderFiles(this.props.documentsEditor, documents)}
            {this.renderForm(this.props.documentsEditor)}
          </React.Fragment>
        )}
      />
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.Section qa="uploadFileSection">
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange("DontSave", dto)}
          qa="projectChangeRequestItemUpload"
        >
          <UploadForm.Fieldset headingContent={x => x.pcrReasoningPrepareFiles.documentLabels.uploadButtonLabel}>
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              labelContent={x => x.pcrReasoningPrepareFiles.documentLabels.uploadInputLabel}
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => dto.files = files || []}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}><ACC.Content value={x => x.pcrReasoningPrepareFiles.documentLabels.uploadDocumentsLabel}/></UploadForm.Button>
            <UploadForm.Button name="uploadFileAndContinue" styling="Primary"><ACC.Content value={x => x.pcrReasoningPrepareFiles.pcrItem.submitButton()}/></UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section titleContent={x => x.pcrReasoningPrepareFiles.documentLabels.filesUploadedTitle} subtitleContent={x => x.pcrReasoningPrepareFiles.documentLabels.filesUploadedSubtitle}>
          <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" />
        </ACC.Section>
      );
    }
    return (
      <ACC.Section titleContent={x => x.pcrReasoningPrepareFiles.documentLabels.filesUploadedTitle}>
        <ACC.ValidationMessage message={x => x.pcrReasoningPrepareFiles.documentMessages.noDocumentsUploaded} messageType="info" />
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
          onFileChange={(saving, dto) => {
            stores.messages.clearMessages();
            // show message if remaining on page
            const successMessage = saving === "SaveAndRemain" ? dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.` : undefined;
            stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(saving !== "DontSave", props.projectId, props.pcrId, dto, saving === "SaveAndRemain", successMessage, () => {
              if (saving === "SaveAndContinue") {
                props.onSave(props.editor.data);
              }
            });
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
