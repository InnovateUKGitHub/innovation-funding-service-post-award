import React from "react";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUploadDtoValidator, PCRStandardItemDtoValidator } from "@ui/validators";
import * as ACC from "@ui/components";
import { PCRItemTypeDto, PCRStandardItemDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface FileStepsProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = ACC.createTypedForm<MultipleDocumentUploadDto>();

class FilesStepComponent extends React.Component<
  PcrStepProps<PCRStandardItemDto, PCRStandardItemDtoValidator> & FileStepsProps
> {
  render() {
    return (
      <>
        {this.renderTemplateLinks(this.props.pcrItemType)}

        <ACC.Section>
          <ACC.DocumentEdit
            qa="pcr-files-step-documents"
            onRemove={document => this.props.onFileDelete(this.props.documentsEditor.data, document)}
            documents={this.props.documents}
          />
        </ACC.Section>

        {this.renderForm(this.props.documentsEditor)}
      </>
    );
  }

  private renderTemplateLinks(itemType: PCRItemTypeDto) {
    if (!itemType.files || !itemType.files.length) {
      return null;
    }
    return (
      <ACC.Section title={itemType.files.length === 1 ? "Template" : "Templates"} qa="templates">
        <ACC.LinksList links={itemType.files.map(x => ({ text: x.name, url: x.relativeUrl }))} />
      </ACC.Section>
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>) {
    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
          onChange={dto => this.props.onFileChange("DontSave", dto)}
          qa="projectChangeRequestItemUpload"
        >
          <UploadForm.Fieldset heading="Upload">
            <ACC.DocumentGuidance />
            <UploadForm.MultipleFileUpload
              label="Upload files"
              name="attachment"
              labelHidden
              value={data => data.files}
              update={(dto, files) => (dto.files = files || [])}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button
              name="uploadFile"
              styling="Secondary"
              onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}
            >
              Upload documents
            </UploadForm.Button>
            <UploadForm.Button name="uploadFileAndContinue" styling="Primary">
              Save and continue
            </UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }
}

export const FilesStep = (props: PcrStepProps<PCRStandardItemDto, PCRStandardItemDtoValidator>) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
      render={documents => (
        <FilesStepComponent
          {...props}
          documents={documents}
          onFileChange={(saving, dto) => {
            stores.messages.clearMessages();
            // show message if remaining on page
            const successMessage =
              saving === "SaveAndRemain"
                ? dto.files.length === 1
                  ? "Your document has been uploaded."
                  : `${dto.files.length} documents have been uploaded.`
                : undefined;
            stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(
              saving !== "DontSave",
              props.project.id,
              props.pcrItem.id,
              dto,
              saving === "SaveAndRemain",
              successMessage,
              () => {
                if (saving === "SaveAndContinue") {
                  props.onSave(false);
                }
              },
            );
          }}
          onFileDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(
              props.project.id,
              props.pcrItem.id,
              dto,
              document,
              "Your document has been removed.",
            );
          }}
        />
      )}
    />
  );
};
