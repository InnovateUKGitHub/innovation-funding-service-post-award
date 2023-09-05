import React from "react";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Loader } from "@ui/components/bjss/loading";
import { useContent } from "@ui/hooks/content.hook";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onSubmit: (dto: MultipleDocumentUploadDto) => void;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps
> {
  render() {
    const { documents, documentsEditor, pcrItem, onSave } = this.props;

    return (
      <>
        <Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onSubmit(documentsEditor.data)}
            onChange={dto => this.props.onFileChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading={x => x.pages.pcrAddPartnerAgreementToPcr.heading}>
              <SimpleString>
                <Content value={x => x.pages.pcrAddPartnerAgreementToPcr.guidance} />
              </SimpleString>
            </UploadForm.Fieldset>

            <UploadForm.Fieldset qa="documentUpload">
              <UploadForm.Hidden name="description" value={() => DocumentDescription.AgreementToPCR} />

              <DocumentGuidance />

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
                <Content value={x => x.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </Section>

        <Section>
          <DocumentEdit
            qa="agreement-to-pcr-document"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </Section>

        <Form.Form
          qa="saveAndContinue"
          data={pcrItem}
          onSubmit={() => onSave(false)}
          isSaving={this.props.status === EditorStatus.Saving}
        >
          <Form.Fieldset>
            <Form.Submit>
              <Content value={x => x.pcrItem.submitButton} />
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
              <Content value={x => x.pcrItem.returnToSummaryButton} />
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
  const { getContent } = useContent();

  return (
    <Loader
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
              getContent(x => x.documentMessages.deletedDocument({ deletedFileName: document.fileName })),
            );
          }}
        />
      )}
    />
  );
};
