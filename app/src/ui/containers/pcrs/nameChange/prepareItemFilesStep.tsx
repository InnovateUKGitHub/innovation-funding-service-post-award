import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { accountNameChangeWorkflow } from "./accountNameChangeWorkflow";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave"|"SaveAndRemain"|"SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class Component extends React.Component<PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps> {
  render(): React.ReactNode {
    const { documents, documentsEditor } = this.props;
    return (
      <React.Fragment>
        {this.renderFiles(documentsEditor, documents)}
        {this.renderForm(documentsEditor)}
      </React.Fragment>
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange("DontSave", dto)}
          qa="projectChangeRequestItemUpload"
        >
          <UploadForm.Fieldset heading="Upload change of name certificate">
            <ACC.DocumentGuidance/>
            <UploadForm.MulipleFileUpload
              label="Upload files"
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => dto.files = files || []}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}>Upload documents</UploadForm.Button>
            <UploadForm.Button name="uploadFileAndContinue" styling="Primary">Save and continue</UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
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

export const PCRPrepareItemFilesStep = (props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
          render={documents => (
            <Component
              {...props}
              documents={documents}
              onFileChange={(saving, dto) => {
                stores.messages.clearMessages();
                // show message if remaining on page
                const successMessage = saving === "SaveAndRemain" ? dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.` : undefined;
                stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(saving !== "DontSave", props.project.id, props.pcrItem.id, dto, saving === "SaveAndRemain", successMessage, () => {
                  if (saving === "SaveAndContinue") {
                    props.onSave();
                  }
                });
              }}
              onFileDelete={(dto, document) => {
                stores.messages.clearMessages();
                stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(props.project.id, props.pcrItem.id, dto, document, "Your document has been removed.");
              }}
            />
          )}
        />;
      }
    }
  </StoresConsumer>
);
