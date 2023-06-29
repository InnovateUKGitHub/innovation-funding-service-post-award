import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { PCRItemForPartnerAdditionDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { LinksList } from "@ui/components/atomicDesign/atoms/LinksList/linksList";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Loader } from "@ui/components/bjss/loading";

interface DeMinimisStepUiProps {
  documents: DocumentSummaryDto[];
  onSubmit: (dto: MultipleDocumentUploadDto) => void;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

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
      <Section>
        <LinksList
          openNewWindow
          links={itemType.files.map(x => ({
            url: x.relativeUrl,
            text: x => x.pcrAddPartnerLabels.deMinimisDeclarationForm,
          }))}
        />
      </Section>
    );
  };

  return (
    <>
      <Section qa="de-minimis-intro" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleDeMinimis}>
        <Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceDeMinimis} />
      </Section>

      <Section qa="de-minimis">
        <Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => props.onSubmit(documentsEditor.data)}
            onChange={dto => props.onFileChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset
              heading={x => x.pages.pcrAddPartnerStateAidEligibility.sectionTitleTemplate}
              qa="template"
            >
              {renderTemplateLinks(props.pcrItemType)}
            </UploadForm.Fieldset>

            <UploadForm.Fieldset
              heading={x => x.pages.pcrAddPartnerStateAidEligibility.sectionTitleUploadDeclaration}
              qa="documentGuidance"
            >
              <UploadForm.Hidden name="description" value={() => DocumentDescription.DeMinimisDeclarationForm} />

              <DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={x => x.documentLabels.uploadInputLabel}
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
                <Content value={x => x.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </Section>

        <Section>
          <DocumentEdit
            qa="de-minimis-document"
            onRemove={document => props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </Section>
      </Section>
      <Form.Form qa="saveAndContinue" data={pcrItem} onSubmit={() => onSave(false)}>
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
};

export const DeMinimisStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <Loader
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
