import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { StepProps } from "@ui/containers/pcrs/workflow";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos";

interface InnerProps {
  documents: DocumentSummaryDto[];
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  onFileChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class Component extends React.Component<StepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps> {
  render(): React.ReactNode {
    const {documents, documentsEditor} = this.props;
    return (
      <React.Fragment>
        {this.renderFiles(documentsEditor, documents)}
        {this.renderForm(documentsEditor)}
      </React.Fragment>
    );
  }

  private renderForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    const ItemForm = ACC.TypedForm<PCRItemForAccountNameChangeDto>();
    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange(true, documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange(false, dto)}
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
          <UploadForm.Button name="uploadFile" styling="Secondary">Upload documents</UploadForm.Button>
        </UploadForm.Form>
        <ItemForm.Form
          qa="changePartnerNameForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave()}
          onChange={dto => this.props.onChange(dto)}
        >
          <ItemForm.Submit>Save and continue</ItemForm.Submit>
        </ItemForm.Form>
      </ACC.Section>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section  title="Files uploaded" subtitle="All documents open in a new window.">
          <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" />
        </ACC.Section>
      );
    }
    return (
      <ACC.Section  title="Files uploaded">
        <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
      </ACC.Section>
    );
  }
}

export const PCRPrepareItemFilesStep = (props: StepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>) => (
    <StoresConsumer>
      {
        stores => {
          const combined = Pending.combine({
            documents: stores.documents.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id),
            documentsEditor: stores.documents.getPcrOrPcrItemDocumentsEditor(props.project.id, props.pcrItem.id)
          });

          return <ACC.Loader
            pending={combined}
            render={x => (
              <Component
                {...props}
                documentsEditor={x.documentsEditor}
                documents={x.documents}
                onFileChange={(saving, dto) => {
                  stores.messages.clearMessages();
                  const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
                  stores.documents.updatePcrOrPcrItemDocumentsEditor(saving, props.project.id, props.pcrItem.id, dto, successMessage);
                }}
                onFileDelete={(dto, document) => {
                  stores.messages.clearMessages();
                  stores.documents.deletePcrOrPcrItemDocumentsEditor(props.project.id, props.pcrItem.id, dto, document, "Your document has been removed.");
                }}
              />
            )}
          />;
        }
      }
    </StoresConsumer>
);
