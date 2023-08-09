import { Pending } from "@shared/pending";
import { ReasoningStepProps } from "@ui/containers/pages/pcrs/reasoning/workflowMetadata";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { useStores } from "@ui/redux/storesProvider";
import { Loader } from "@ui/components/bjss/loading";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { BaseProps } from "@ui/containers/containerBase";

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

interface InnerProps {
  documents: Pending<DocumentSummaryDto[]>;
  onFileChange: (saving: "DontSave" | "SaveAndRemain" | "SaveAndContinue", dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const PrepareReasoningFilesStepComponent = (props: BaseProps & InnerProps & ReasoningStepProps) => {
  const { documentsEditor, pcrId, projectId } = props;

  // Get the step-less review-before-submit page.
  const back = props.routes.pcrPrepareReasoning.getLink({
    projectId: projectId,
    pcrId: pcrId,
  });

  return (
    <Loader
      pending={props.documents}
      render={documents => (
        <>
          <Section qa="uploadFileSection">
            <UploadForm.Form
              enctype="multipart"
              editor={documentsEditor}
              onSubmit={() => props.onFileChange("SaveAndContinue", documentsEditor.data)}
              onChange={dto => props.onFileChange("DontSave", dto)}
              qa="projectChangeRequestItemUpload"
            >
              <UploadForm.Fieldset heading={x => x.documentMessages.uploadDocuments}>
                <DocumentGuidance />

                <UploadForm.MultipleFileUpload
                  label={x => x.documentLabels.uploadInputLabel}
                  name="attachment"
                  labelHidden
                  value={data => data.files}
                  update={(dto, files) => (dto.files = files || [])}
                  validation={documentsEditor.validator.files}
                />

                <UploadForm.Button
                  name="uploadFile"
                  styling="Secondary"
                  onClick={() => props.onFileChange("SaveAndRemain", documentsEditor.data)}
                >
                  <Content value={x => x.documentMessages.uploadDocuments} />
                </UploadForm.Button>
              </UploadForm.Fieldset>
            </UploadForm.Form>
            <Section>
              <DocumentEdit
                qa="prepare-files-documents"
                onRemove={document => props.onFileDelete(documentsEditor.data, document)}
                documents={documents}
              />
            </Section>

            <Link styling="PrimaryButton" route={back}>
              <Content value={x => x.pcrItem.submitButton} />
            </Link>
          </Section>
        </>
      )}
    />
  );
};

export const PCRPrepareReasoningFilesStep = (props: ReasoningStepProps) => {
  const stores = useStores();

  return (
    <PrepareReasoningFilesStepComponent
      {...props}
      documents={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
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
          props.projectId,
          props.pcrId,
          dto,
          saving === "SaveAndRemain",
          successMessage,
          () => {
            if (saving === "SaveAndContinue") {
              props.onSave(props.editor.data);
            }
          },
        );
      }}
      onFileDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(
          props.projectId,
          props.pcrId,
          dto,
          document,
          "Your document has been removed.",
        );
      }}
    />
  );
};
