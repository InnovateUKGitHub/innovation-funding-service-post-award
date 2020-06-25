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
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
    const { documents, documentsEditor } = this.props;
    return (
      <React.Fragment>
        {this.renderForm(documentsEditor)}
        {this.renderFiles(documentsEditor, documents)}
        <Form.Form qa="saveAndContinue" data={this.props.pcrItem} onSubmit={() => this.props.onSave()}>
          <Form.Fieldset>
            <Form.Submit>Save and continue</Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>Save and return to summary</Form.Button>
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
          <UploadForm.Fieldset heading="Je-S form">
            <ACC.Renderers.SimpleString>Your new academic partner must apply for funding through the Je-S system. To find out more about the Je-S requirements and processes please go to:</ACC.Renderers.SimpleString>
            <ACC.UnorderedList>
              <li><a href="https://www.gov.uk/government/publications/innovate-uk-completing-your-application-project-costs-guidance/guidance-for-academics-applying-via-the-je-s-system" rel="noopener noreferrer" target="_blank">guidance from Innovate UK for academics applying via the Je-S system (opens in a new window)</a></li>
              <li> the <a href="https://je-s.rcuk.ac.uk/" rel="noopener noreferrer" target="_blank">Je-S website (opens in a new window)</a>.</li>
            </ACC.UnorderedList>
            <ACC.Renderers.SimpleString>Upload a pdf copy of the completed Je-S output form, once the new partner has a status of 'With Council'. If there is information outstanding or the partner is not at this status, your request will be rejected.</ACC.Renderers.SimpleString>
          </UploadForm.Fieldset>
          <UploadForm.Fieldset qa="documentUpload">
            <UploadForm.Hidden name="description" value={x => DocumentDescription.JeSForm} />
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              label="Upload files"
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => {
                dto.files = files || [];
                dto.description = DocumentDescription.JeSForm;
              }}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange(true, documentsEditor.data)}>Upload</UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section title="Files uploaded" subtitle="All documents uploaded during this request will be shown here. All documents open in a new window.">
          {documents.length ? <ACC.DocumentTableWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="je-s-document"/> : null}
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

export const JeSStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
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
