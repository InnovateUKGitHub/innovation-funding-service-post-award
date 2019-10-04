import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator, PCRStandardItemDtoValdiator } from "@ui/validators";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { Pending } from "@shared/pending";

interface Props {
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRStandardItemDto;
  validator: PCRStandardItemDtoValdiator;
  status: EditorStatus;
  onChange: (dto: Dtos.PCRStandardItemDto) => void;
  onSave: () => void;
}

interface InnerProps {
  documents: DocumentSummaryDto[];
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  onFilesChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const InnerStandardItemEdit = (props: Props & InnerProps) => {
  const Form = ACC.TypedForm<Dtos.PCRStandardItemDto>();
  const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

  const options: ACC.SelectOption[] = [
    { id: "true", value: "This is ready to submit." }
  ];

  return (
    <React.Fragment>
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={props.documentsEditor}
          onSubmit={() => props.onFilesChange(true, props.documentsEditor.data)}
          onChange={(dto) => props.onFilesChange(false, dto)}
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
              validation={props.documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Button name="uploadFile">Upload</UploadForm.Button>
        </UploadForm.Form>
      </ACC.Section>

      <ACC.Section title="Files uploaded">
        {
          props.documents.length > 0 ?
            <ACC.DocumentListWithDelete onRemove={(document) => props.onFileDelete(props.documentsEditor.data, document)} documents={props.documents} qa="supporting-documents" /> :
            <ACC.ValidationMessage messageType="info" message="No files uploaded" />
        }
      </ACC.Section>

      <ACC.Section>
        <Form.Form
          data={props.projectChangeRequestItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave()}
          qa="itemStatus"
        >
          <Form.Fieldset heading="Mark as complete">
            <Form.Checkboxes
              name="itemStatus"
              options={options}
              value={m => m.status === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
              update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
              validation={props.validator.status}
            />
            <Form.Submit>Save and return to request</Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>

    </React.Fragment>
  );
};

export const StandardItemEdit = (props: Props) => (
  <StoresConsumer>
    {stores => {
      const projectId = props.projectChangeRequest.projectId;
      const itemId = props.projectChangeRequestItem.id;

      const combined = Pending.combine({
        documents: stores.documents.pcrOrPcrItemDocuments(projectId, itemId),
        documentEditor: stores.documents.getPcrOrPcrItemDocumentsEditor(projectId, itemId)
      });

      return (
        <ACC.Loader
          pending={combined}
          render={(data) => (
            <InnerStandardItemEdit
              documents={data.documents}
              documentsEditor={data.documentEditor}
              onFilesChange={(save, dto) => {
                stores.messages.clearMessages();
                const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
                stores.documents.updatePcrOrPcrItemDocumentsEditor(save, projectId, itemId, dto, successMessage);
              }}
              onFileDelete={(dto, document) => {
                stores.messages.clearMessages();
                stores.documents.deletePcrOrPcrItemDocumentsEditor(props.projectChangeRequest.id, props.projectChangeRequestItem.id, dto, document, "Your document has been removed.");
              }}
              {...props}
            />
          )}
        />
      );
    }
    }
  </StoresConsumer>
);
