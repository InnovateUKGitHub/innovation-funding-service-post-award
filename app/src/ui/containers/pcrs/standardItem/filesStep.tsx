import React from "react";
import { StepProps } from "../workflow";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import * as ACC from "@ui/components";
import { standardItemWorkflow } from "./workflow";

interface FileStepsProps {
  documents: DocumentSummaryDto[];
  onFileChange: (dto: MultipleDocumentUploadDto, saveAndRemain: boolean, saveAndContinue: boolean) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;

}

class FilesStepComponent extends React.Component<StepProps<typeof standardItemWorkflow> & FileStepsProps> {
  render() {
    return (
      <React.Fragment>
        {this.renderFiles(this.props.documentsEditor, this.props.documents)}
        {this.renderForm(this.props.documentsEditor)}
      </React.Fragment>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    return (
      <ACC.Section title="Files uploaded" subtitle={documents.length ? "All documents open in a new window." : null}>
        {documents.length ?
          <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" /> :
          <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
        }
      </ACC.Section>
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange(documentsEditor.data, false, true)}
          onChange={(dto) => this.props.onFileChange(dto, false, false)}
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
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange(documentsEditor.data, true, false)}>Upload documents</UploadForm.Button>
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFileAndContinue" styling="Primary">Upload documents and continue</UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }
}

export const FilesStep = (props: StepProps<typeof standardItemWorkflow>) => (
  <StoresConsumer>
    {
      stores => {
        return (
          <ACC.Loader
            pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
            render={documents => (
              <FilesStepComponent
                documents={documents}
                documentsEditor={props.documentsEditor}
                onFileChange={(dto, saveAndRemain, saveAndContinue) => {
                  stores.messages.clearMessages();
                  const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
                  stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(saveAndContinue || saveAndRemain, props.project.id, props.pcrItem.id, dto, successMessage, () => {
                    if (saveAndContinue) {
                      props.onSave();
                    }
                  });
                }}
                onFileDelete={(dto, document) => {
                  stores.messages.clearMessages();
                  stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(props.project.id, props.pcrItem.id, dto, document, "Your document has been removed.");
                }}
                {...props}
              />
            )}
          />
        );
      }
    }
  </StoresConsumer>
);
