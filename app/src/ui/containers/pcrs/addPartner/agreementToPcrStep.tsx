import React from "react";
import * as ACC from "@ui/components";
import { useStores } from "@ui/redux";
import { EditorStatus } from "@ui/constants/enums";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
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

const Form = ACC.createTypedForm<PCRItemForPartnerAdditionDto>();
const UploadForm = ACC.createTypedForm<MultipleDocumentUploadDto>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps
> {
  render() {
    const { documents, documentsEditor, pcrItem, onSave } = this.props;

    return (
      <>
        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onSubmit(documentsEditor.data)}
            onChange={dto => this.props.onFileChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading={x => x.pages.pcrAddPartnerAgreementToPcr.heading}>
              <ACC.Renderers.SimpleString>
                <ACC.Content value={x => x.pages.pcrAddPartnerAgreementToPcr.guidance} />
              </ACC.Renderers.SimpleString>
            </UploadForm.Fieldset>

            <UploadForm.Fieldset qa="documentUpload">
              <UploadForm.Hidden name="description" value={() => DocumentDescription.AgreementToPCR} />

              <ACC.DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={x => x.documentLabels.uploadInputLabel}
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.AgreementToPCR;
                }}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>

            <UploadForm.Fieldset>
              <UploadForm.Button
                name="uploadFile"
                styling="Secondary"
                onClick={() => this.props.onFileChange(true, documentsEditor.data)}
              >
                <ACC.Content value={x => x.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </ACC.Section>

        <ACC.Section>
          <ACC.DocumentEdit
            qa="agreement-to-pcr-document"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </ACC.Section>

        <Form.Form
          qa="saveAndContinue"
          data={pcrItem}
          onSubmit={() => onSave(false)}
          isSaving={this.props.status === EditorStatus.Saving}
        >
          <Form.Fieldset>
            <Form.Submit>
              <ACC.Content value={x => x.pcrItem.submitButton} />
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
              <ACC.Content value={x => x.pcrItem.returnToSummaryButton} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </>
    );
  }
}

export const AgreementToPCRStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
      render={documents => (
        <Component
          {...props}
          documents={documents}
          onSubmit={dto => {
            stores.messages.clearMessages();
            stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(
              true,
              props.project.id,
              props.pcrItem.id,
              dto,
              false,
              undefined,
              () => {
                {
                  props.onSave(false);
                }
              },
            );
          }}
          onFileChange={(isSaving, dto) => {
            stores.messages.clearMessages();
            // show message if remaining on page
            const successMessage = isSaving
              ? dto.files.length === 1
                ? "Your document has been uploaded."
                : `${dto.files.length} documents have been uploaded.`
              : undefined;
            stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(
              isSaving,
              props.project.id,
              props.pcrItem.id,
              dto,
              isSaving,
              successMessage,
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
