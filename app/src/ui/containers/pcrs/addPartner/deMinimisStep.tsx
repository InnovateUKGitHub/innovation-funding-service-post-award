
import * as ACC from "@ui/components";
import { useStores } from "@ui/redux";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto, PCRItemTypeDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";
import { Content } from "@content/content";

interface DeMinimisStepUiProps {
  documents: DocumentSummaryDto[];
  onSubmit: (dto: MultipleDocumentUploadDto) => void;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const DeMinimisStepUi = ({
  documents,
  documentsEditor,
  pcrItem,
  onSave,
  ...props
}: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & DeMinimisStepUiProps) => {
  const renderTemplateLinks = (itemType: PCRItemTypeDto) => {
    if (!itemType.files || !itemType.files.length) {
      return null;
    }

    return (
      <ACC.Section>
        <ACC.LinksList
          openNewWindow
          links={itemType.files.map(x => ({
            url: x.relativeUrl,
            text: (content: Content) => content.pcrAddPartnerStateAidEligibilityContent.labels.deMinimisDeclarationForm,
          }))}
        />
      </ACC.Section>
    );
  };

  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

  return (
    <>
      <ACC.Section qa="de-minimis-intro" title={x => x.pcrAddPartnerStateAidEligibilityContent.deMinimisTitle}>
        <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.deMinimisGuidance} />
      </ACC.Section>

      <ACC.Section qa="de-minimis">
        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => props.onSubmit(documentsEditor.data)}
            onChange={dto => props.onFileChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset
              heading={x => x.pcrAddPartnerStateAidEligibilityContent.templateSectionTitle}
              qa="template"
            >
              {renderTemplateLinks(props.pcrItemType)}
            </UploadForm.Fieldset>

            <UploadForm.Fieldset
              heading={x => x.pcrAddPartnerStateAidEligibilityContent.uploadDeclarationSectionTitle}
              qa="documentGuidance"
            >
              <UploadForm.Hidden name="description" value={() => DocumentDescription.DeMinimisDeclarationForm} />

              <ACC.DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={x => x.pcrAddPartnerStateAidEligibilityContent.documentLabels.uploadInputLabel}
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.DeMinimisDeclarationForm;
                }}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>

            <UploadForm.Fieldset>
              <UploadForm.Button
                name="uploadFile"
                styling="Secondary"
                onClick={() => props.onFileChange(true, documentsEditor.data)}
              >
                <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </ACC.Section>

        <ACC.Section>
          <ACC.DocumentEdit
            qa="de-minimis-document"
            onRemove={document => props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </ACC.Section>
      </ACC.Section>
      <Form.Form qa="saveAndContinue" data={pcrItem} onSubmit={() => onSave(false)}>
        <Form.Fieldset>
          <Form.Submit>
            <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
            <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};

export const DeMinimisStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id)}
      render={documents => (
        <DeMinimisStepUi
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
