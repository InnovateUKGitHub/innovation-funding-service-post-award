import React from "react";
import { StepProps } from "../workflow";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import * as ACC from "@ui/components";
import { standardItemWorkflow } from "./workflow";
import { PCRItemTypeDto } from "@framework/dtos";

interface FileStepsProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave"|"SaveAndRemain"|"SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;

}

class FilesStepComponent extends React.Component<StepProps<typeof standardItemWorkflow> & FileStepsProps> {
  render() {
    return (
      <React.Fragment>
        {this.renderTemplateLinks(this.props.pcrItemType)}
        {this.renderFiles(this.props.documentsEditor, this.props.documents)}
        {this.renderForm(this.props.documentsEditor)}
      </React.Fragment>
    );
  }

  private renderTemplateLinks(itemType: PCRItemTypeDto) {
    if(!itemType.files || !itemType.files.length) {
      return null;
    }
    return(
      <ACC.Section title={itemType.files.length === 1 ? "Template" : "Templates"} qa="templates" subtitle="Download templates to comple the information and upload below.">
        <ACC.LinksList links={itemType.files.map(x => ({text: x.name, url: x.relativeUrl}))}/>
      </ACC.Section>
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
          onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange("DontSave", dto)}
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
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}>Upload documents</UploadForm.Button>
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
                onFileChange={(saving, dto) => {
                  stores.messages.clearMessages();
                  const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
                  stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(saving !== "DontSave", props.project.id, props.pcrItem.id, dto, successMessage, () => {
                    if (saving === "SaveAndContinue") {
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
