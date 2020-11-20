import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onSubmit: (dto: MultipleDocumentUploadDto) => void;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps> {
  render() {
    const { documents, documentsEditor, pcrItem, onSave } = this.props;
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
    return (
      <React.Fragment>
        {this.renderForm(documentsEditor)}
        {this.renderFiles(documentsEditor, documents)}
        <Form.Form qa="saveAndContinue" data={pcrItem} onSubmit={() => onSave()}>
          <Form.Fieldset>
          <Form.Submit>
              <ACC.Content value={x => x.pcrAddPartnerAgreementToPcr.pcrItem.submitButton}/>
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
              <ACC.Content value={x => x.pcrAddPartnerAgreementToPcr.pcrItem.returnToSummaryButton}/>
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
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
          onSubmit={() => this.props.onSubmit(documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange(false, dto)}
          qa="projectChangeRequestItemUpload"
        >
          <UploadForm.Fieldset headingContent={x => x.pcrAddPartnerAgreementToPcr.heading}>
            <ACC.Renderers.SimpleString><ACC.Content value={x => x.pcrAddPartnerAgreementToPcr.guidance} /></ACC.Renderers.SimpleString>
          </UploadForm.Fieldset>
          <UploadForm.Fieldset qa="documentUpload">
            <UploadForm.Hidden name="description" value={x => DocumentDescription.AgreementToPCR} />
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              labelContent={x => x.pcrAddPartnerAgreementToPcr.documentLabels.uploadInputLabel}
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => {
                dto.files = files || [];
                dto.description = DocumentDescription.AgreementToPCR;
              }}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange(true, documentsEditor.data)}>
              <ACC.Content value={x => x.pcrAddPartnerAgreementToPcr.documentLabels.uploadButtonLabel} />
            </UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section
          titleContent={x => x.pcrAddPartnerAgreementToPcr.documentLabels.filesUploadedTitle}
          subtitleContent={x => x.pcrAddPartnerAgreementToPcr.documentLabels.filesUploadedSubtitle}
        >
          {
            documents.length
            ? <ACC.DocumentTableWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="agreement-to-pcr-document"/>
            : null
          }
        </ACC.Section>
      );
    }
    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerAgreementToPcr.documentLabels.filesUploadedTitle}>
        <ACC.ValidationMessage message={x => x.pcrAddPartnerAgreementToPcr.documentMessages.noDocumentsUploaded} messageType="info" />
      </ACC.Section>
    );
  }
}

export const AgreementToPCRStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
          render={documents => (
            <Component
              {...props}
              documents={documents}
              onSubmit={(dto) => {
                stores.messages.clearMessages();
                stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(true, props.project.id, props.pcrItem.id, dto, false, undefined, () => {
                   { props.onSave(); }
                });
              }}
              onFileChange={(isSaving, dto) => {
                stores.messages.clearMessages();
                // show message if remaining on page
                const successMessage = isSaving ? dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.` : undefined;
                stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(isSaving, props.project.id, props.pcrItem.id, dto, isSaving, successMessage);
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
