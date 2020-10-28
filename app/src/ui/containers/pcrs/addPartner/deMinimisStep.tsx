import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto, PCRItemTypeDto, ProjectDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";
import { Content } from "@content/content";

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
        <ACC.Section qa="de-minimis" titleContent={x => x.pcrAddPartnerStateAidEligibilityContent.deMinimisTitle()}>
          <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.deMinimisGuidance()}/>
          {this.renderDeMinimisForm(documentsEditor)}
          {this.renderDeMinimisFiles(documentsEditor, documents)}
        </ACC.Section>
        <Form.Form qa="saveAndContinue" data={pcrItem} onSubmit={() => onSave()}>
          <Form.Fieldset>
            <Form.Submit>
              <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.submitButton()}/>
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
              <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.returnToSummaryButton()}/>
            </Form.Button>
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
        <ACC.LinksList
          openNewWindow={true}
          links={itemType.files.map(x => ({ url: x.relativeUrl, textContent: (content: Content) => content.pcrAddPartnerStateAidEligibilityContent.labels.deMinimisDeclarationForm() }))}
        />
      </ACC.Section>
    );
  }

  private renderDeMinimisForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
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
          <UploadForm.Fieldset headingContent={x => x.pcrAddPartnerStateAidEligibilityContent.templateSectionTitle()} qa="template">
            {this.renderTemplateLinks(this.props.pcrItemType)}
          </UploadForm.Fieldset>
          <UploadForm.Fieldset headingContent={x => x.pcrAddPartnerStateAidEligibilityContent.uploadDeclarationSectionTitle()} qa="documentGuidance">
            <UploadForm.Hidden name="description" value={x => DocumentDescription.DeMinimisDeclarationForm} />
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              labelContent={x => x.pcrAddPartnerStateAidEligibilityContent.documentLabels.uploadInputLabel()}
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
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange(true, documentsEditor.data)}>
              <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.documentLabels.uploadButtonLabel()} />
            </UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderDeMinimisFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section
          titleContent={x => x.pcrAddPartnerStateAidEligibilityContent.documentLabels.filesUploadedTitle()}
          subtitleContent={x => x.pcrAddPartnerStateAidEligibilityContent.documentLabels.filesUploadedSubtitle()}
        >
          {
            documents.length
            ? <ACC.DocumentTableWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="de-minimis-document"/>
            : null
          }
        </ACC.Section>
      );
    }
    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerStateAidEligibilityContent.documentLabels.filesUploadedTitle()}>
        <ACC.ValidationMessage message={x => x.pcrAddPartnerStateAidEligibilityContent.documentMessages.noDocumentsUploaded()} messageType="info" />
      </ACC.Section>
    );
  }
}

export const DeMinimisStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
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
