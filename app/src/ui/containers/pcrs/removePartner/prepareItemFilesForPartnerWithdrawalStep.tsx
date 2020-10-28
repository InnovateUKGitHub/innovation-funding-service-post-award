import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave"|"SaveAndRemain"|"SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps> {
  render(): React.ReactNode {
    const { documents, documentsEditor } = this.props;
    const form = ACC.TypedForm<PCRItemForPartnerWithdrawalDto>();
    return (
      <React.Fragment>
        {this.renderForm(documentsEditor)}
        {this.renderFiles(documentsEditor, documents)}
        <form.Form qa="saveAndContinue" data={this.props.pcrItem} onSubmit={() => this.props.onSave()}>
          <form.Fieldset>
            <form.Button name="default" styling="Primary"><ACC.Content value={x => x.pcrRemovePartnerPrepareItemFiles.pcrItem.submitButton()}/></form.Button>
          </form.Fieldset>
        </form.Form>
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
          <UploadForm.Fieldset headingContent={x => x.pcrRemovePartnerPrepareItemFiles.guidanceHeading()}>
            <ACC.Renderers.SimpleString><ACC.Content value={x => x.pcrRemovePartnerPrepareItemFiles.guidance()}/></ACC.Renderers.SimpleString>
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
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}><ACC.Content value={x => x.pcrRemovePartnerPrepareItemFiles.pcrItem.submitButton()}/></UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section titleContent={x => x.pcrRemovePartnerPrepareItemFiles.documentLabels.filesUploadedTitle()} subtitleContent={x => x.pcrRemovePartnerPrepareItemFiles.documentLabels.filesUploadedSubtitle()}>
          <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" />
        </ACC.Section>
      );
    }
    return (
      <ACC.Section titleContent={x => x.pcrRemovePartnerPrepareItemFiles.documentLabels.filesUploadedTitle()}>
        <ACC.ValidationMessage message={x => x.pcrRemovePartnerPrepareItemFiles.documentMessages.noDocumentsUploaded()} messageType="info" />
      </ACC.Section>
    );
  }
}

export const PCRPrepareItemFilesForPartnerWithdrawalStep = (props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator>) => (
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
