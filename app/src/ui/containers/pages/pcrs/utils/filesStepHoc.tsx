import { ContentSelector } from "@copy/type";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PCRItemDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Loader } from "@ui/components/bjss/loading";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { useContent } from "@ui/hooks/content.hook";
import { EditorStatus } from "@ui/redux/constants/enums";
import { useStores } from "@ui/redux/storesProvider";

interface FilesStepProps {
  isSaving: boolean;
  documents: DocumentSummaryDto[];
  onFileChange: (
    {
      saving,
      continuing,
    }: {
      saving: boolean;
      continuing: boolean;
    },
    dto: MultipleDocumentUploadDto,
  ) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const WithPcrFilesStep = <TDto extends PCRItemDto, TValidator>({
  heading,
  guidance,
  documentDescription,
}: {
  heading: ContentSelector;
  guidance?: ContentSelector;
  documentDescription: DocumentDescription;
}) => {
  const Form = createTypedForm<TDto>();
  const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

  const PcrFilesStep = (props: PcrStepProps<TDto, TValidator> & FilesStepProps) => {
    const { documents, documentsEditor, isSaving } = props;

    return (
      <>
        <Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => props.onFileChange({ saving: true, continuing: true }, documentsEditor.data)}
            onChange={dto => props.onFileChange({ saving: false, continuing: false }, dto)}
            qa="projectChangeRequestItemUpload"
            disabled={isSaving}
          >
            <UploadForm.Fieldset heading={heading}>
              {guidance && <Content markdown value={guidance} />}

              <UploadForm.Hidden name="description" value={() => documentDescription} />

              <DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={x => x.documentLabels.uploadInputLabel}
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = documentDescription;
                }}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>

            <UploadForm.Fieldset>
              <UploadForm.Button
                name="uploadFile"
                styling="Secondary"
                onClick={() => props.onFileChange({ saving: true, continuing: false }, documentsEditor.data)}
              >
                <Content value={x => x.pcrItem.uploadDocumentsButton} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </Section>

        <Section>
          <DocumentEdit
            qa="prepare-item-file-for-partner-documents"
            onRemove={document => props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </Section>

        <Form.Form
          qa="saveAndContinue"
          data={props.pcrItem}
          // Reset any document errors by resetting files to "[]".
          onSubmit={() => props.onFileChange({ saving: false, continuing: true }, { files: [] })}
          disabled={isSaving}
        >
          <Form.Fieldset>
            <Form.Button name="default" styling="Primary">
              <Content value={x => x.pcrItem.submitButton} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </>
    );
  };

  const PcrFilesStepContainer = (props: PcrStepProps<TDto, TValidator>) => {
    const stores = useStores();
    const { getContent } = useContent();

    return (
      <Loader
        pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
        render={documents => (
          <PcrFilesStep
            {...props}
            isSaving={props.status === EditorStatus.Saving || props.documentsEditor.status === EditorStatus.Saving}
            documents={documents}
            onFileChange={({ saving, continuing }, dto) => {
              stores.messages.clearMessages();
              // show message if remaining on page
              const successMessage = saving
                ? getContent(x => x.documentMessages.uploadDocuments({ count: dto.files.length }))
                : undefined;

              // Save the documents editor.
              stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(
                saving,
                props.project.id,
                props.pcrItem.id,
                dto,
                saving,
                successMessage,
                () => {
                  if (saving && continuing) {
                    props.onSave(false);
                  }
                },
              );

              if (!saving && continuing) {
                props.onSave(false);
              }
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

  return PcrFilesStepContainer;
};

export { WithPcrFilesStep };
