import React from "react";

import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUploadDtoValidator, PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps
> {
  render(): React.ReactNode {
    const { documents, documentsEditor } = this.props;

    const Form = ACC.TypedForm<PCRItemForPartnerWithdrawalDto>();
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <>
        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
            onChange={dto => this.props.onFileChange("DontSave", dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset headingContent={x => x.pcrRemovePartnerPrepareItemFiles.guidanceHeading}>
              <ACC.Renderers.SimpleString>
                <ACC.Content value={x => x.pcrRemovePartnerPrepareItemFiles.guidance} />
              </ACC.Renderers.SimpleString>

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
                <ACC.Content value={x => x.pcrRemovePartnerPrepareItemFiles.pcrItem.submitButton} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </ACC.Section>

        <ACC.Section>
          <ACC.DocumentEdit
            qa="prepare-item-file-for-partner-documents"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </ACC.Section>

        <Form.Form qa="saveAndContinue" data={this.props.pcrItem} onSubmit={() => this.props.onSave()}>
          <Form.Fieldset>
            <Form.Button name="default" styling="Primary">
              <ACC.Content value={x => x.pcrRemovePartnerPrepareItemFiles.pcrItem.submitButton} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </>
    );
  }
}

export const PCRPrepareItemFilesForPartnerWithdrawalStep = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
      render={documents => (
        <Component
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
                  props.onSave();
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
