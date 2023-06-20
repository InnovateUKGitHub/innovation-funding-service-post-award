import React from "react";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { DocumentGuidance } from "@ui/components/documents/DocumentGuidance";
import { DocumentEdit } from "@ui/components/documents/DocumentView";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Loader } from "@ui/components/loading";

interface InnerProps {
  documents: DocumentSummaryDto[];
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const Form = createTypedForm<PCRItemForPartnerWithdrawalDto>();
const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps
> {
  render(): React.ReactNode {
    const { documents, documentsEditor } = this.props;

    return (
      <>
        <Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFileChange("SaveAndContinue", documentsEditor.data)}
            onChange={dto => this.props.onFileChange("DontSave", dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading={x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidanceHeading}>
              <Content markdown value={x => x.pages.pcrPrepareItemFilesForPartnerWithdrawal.guidance} />

              <UploadForm.Hidden name="description" value={() => DocumentDescription.WithdrawalOfPartnerCertificate} />

              <DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label="Upload files"
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.WithdrawalOfPartnerCertificate;
                }}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>

            <UploadForm.Fieldset>
              <UploadForm.Button
                name="uploadFile"
                styling="Secondary"
                onClick={() => this.props.onFileChange("SaveAndRemain", documentsEditor.data)}
              >
                <Content value={x => x.pcrItem.uploadDocumentsButton} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </Section>

        <Section>
          <DocumentEdit
            qa="prepare-item-file-for-partner-documents"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </Section>

        <Form.Form qa="saveAndContinue" data={this.props.pcrItem} onSubmit={() => this.props.onSave(false)}>
          <Form.Fieldset>
            <Form.Button name="default" styling="Primary">
              <Content value={x => x.pcrItem.submitButton} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </>
    );
  }
}

export const PCRPrepareItemFilesForPartnerWithdrawalStep = (
  props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
      render={documents => (
        <Component
          {...props}
          documents={documents}
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
              props.project.id,
              props.pcrItem.id,
              dto,
              saving === "SaveAndRemain",
              successMessage,
              () => {
                if (saving === "SaveAndContinue") {
                  props.onSave(false);
                }
              },
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
