import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto, PCRItemTypeDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
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
            <Form.Button name="default" styling="Primary">Save and continue</Form.Button>
            <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>Save and return to summary</Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </React.Fragment>
    );
  }

  private renderTemplateLinks(itemType: PCRItemTypeDto) {
    if (!itemType.files || !itemType.files.length) {
      return null;
    }
    return (
      <ACC.Section>
        {/* TODO: Currently we do not have access to the correct form so this is a placeholder */}
        <ACC.LinksList links={itemType.files.map(x => ({ text: "De minimis declaration form", url: x.relativeUrl }))} />
      </ACC.Section>
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
          <UploadForm.Fieldset heading="De minimis aid eligibility">
            <ACC.Renderers.SimpleString>The funding will be made as a de minimis grant. All organisations for a de minimis award must complete and upload a de minimis declaration. This states any and all de minimis awards (from any source of public funding) during the current and previous 2 fiscal years.</ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>In order to minimise distortion of competition, the European Commission sets limits on how much assistance can be given without its prior approval, to organisations operating in a competitive market. There is a ceiling of €200,000 for all de minimis aid provided to any one organisation over a 3 fiscal year period.</ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>The new organisation needs to declare any de minimis aid awarded to any other public funding body which requests it. They must also keep all documentation associated with the award for 10 years from the date the award is granted.</ACC.Renderers.SimpleString>
          </UploadForm.Fieldset>
          <UploadForm.Fieldset heading="Template" qa="template">
            {this.renderTemplateLinks(this.props.pcrItemType)}
          </UploadForm.Fieldset>
          <UploadForm.Fieldset heading="Upload declaration form" qa="documentGuidance">
            <UploadForm.Hidden name="description" value={x => DocumentDescription.DeMinimisDeclarationForm} />
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              label="Upload files"
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => {
                dto.files = files || [];
                dto.description = DocumentDescription.DeMinimisDeclarationForm;
              }}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}>Upload</UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section title="Files uploaded" subtitle="All documents open in a new window.">
          {documents.length ? <ACC.DocumentTable onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="de-minimis-document"/> : null}
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

export const AidEligibilityStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
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
