import React from "react";

import * as ACC from "@ui/components";
import { useStores } from "@ui/redux";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { EditorStatus } from "@ui/constants/enums";

interface InnerProps {
  documents: DocumentSummaryDto[];
  isSaving: boolean;
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = ACC.createTypedForm<MultipleDocumentUploadDto>();

class Component extends React.Component<
  PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps
> {
  render(): React.ReactNode {
    const { documents, documentsEditor, isSaving } = this.props;

    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
          onChange={dto => this.props.onFileChange("DontSave", dto)}
          qa="projectChangeRequestItemUpload"
          disabled={isSaving}
        >
          <UploadForm.Fieldset heading={x => x.pages.pcrNameChangePrepareItemFiles.headingUploadCertificate}>
            <ACC.DocumentGuidance />

            <UploadForm.MultipleFileUpload
              label={x => x.documentLabels.uploadInputLabel}
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
              <ACC.Content value={x => x.documentMessages.uploadTitle} />
            </UploadForm.Button>

            <UploadForm.Button name="uploadFileAndContinue" styling="Primary">
              <ACC.Content value={x => x.pcrItem.submitButton} />
            </UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>

        <ACC.Section>
          <ACC.DocumentEdit
            qa="prepare-item-step-documents"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
            disabled={isSaving}
          />
        </ACC.Section>
      </ACC.Section>
    );
  }
}

export const PCRPrepareItemFilesStep = (
  props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>,
) => {
  const stores = useStores();

  // Check if the parent PCR is saving, instead of checking if our PCR files step is saving.
  const isParentPCRSaving = props.status === EditorStatus.Saving;

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
      render={documents => (
        <Component
          {...props}
          documents={documents}
          isSaving={isParentPCRSaving}
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
