import React, { Component } from "react";

import * as ACC from "@ui/components";

import { useStores } from "@ui/redux";
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
    const { documentsEditor, pcrId, projectId } = this.props;

    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    // Get the step-less review-before-submit page.
    const back = this.props.routes.pcrPrepareReasoning.getLink({
      projectId: projectId,
      pcrId: pcrId,
    });

    return (
      <ACC.Loader
        pending={this.props.documents}
        render={documents => (
          <>
            <ACC.Section qa="uploadFileSection">
              <UploadForm.Form
                enctype="multipart"
                editor={documentsEditor}
                onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
                onChange={dto => this.props.onFileChange("DontSave", dto)}
                qa="projectChangeRequestItemUpload"
              >
                <UploadForm.Fieldset heading={x => x.pcrReasoningPrepareFiles.documentMessages.uploadDocumentsLabel}>
                  <ACC.DocumentGuidance />

                  <UploadForm.MultipleFileUpload
                    label={x => x.pcrReasoningPrepareFiles.documentLabels.uploadInputLabel}
                    name="attachment"
                    labelHidden
                    value={data => data.files}
                    update={(dto, files) => (dto.files = files || [])}
                    validation={documentsEditor.validator.files}
                  />

                  <UploadForm.Button
                    name="uploadFile"
                    styling="Secondary"
                    onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}
                  >
                    <ACC.Content value={x => x.pcrReasoningPrepareFiles.documentMessages.uploadDocumentsLabel} />
                  </UploadForm.Button>
                </UploadForm.Fieldset>
              </UploadForm.Form>
              <ACC.Section>
                <ACC.DocumentEdit
                  qa="prepare-files-documents"
                  onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
                  documents={documents}
                />
              </ACC.Section>

              <ACC.Link styling="PrimaryButton" route={back}>
                <ACC.Content value={x => x.pcrReasoningPrepareFiles.pcrItem.submitButton} />
              </ACC.Link>
            </ACC.Section>
          </>
        )}
      />
    );
  }
}

export const PCRPrepareReasoningFilesStep = (props: ReasoningStepProps) => {
  const stores = useStores();

  return (
    <PrepareReasoningFilesStepComponent
      {...props}
      documents={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
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
          props.projectId,
          props.pcrId,
          dto,
          saving === "SaveAndRemain",
          successMessage,
          () => {
            if (saving === "SaveAndContinue") {
              props.onSave(props.editor.data);
            }
          },
        );
      }}
      onFileDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(
          props.projectId,
          props.pcrId,
          dto,
          document,
          "Your document has been removed.",
        );
      }}
    />
  );
};
