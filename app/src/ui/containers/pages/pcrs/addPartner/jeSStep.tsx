import { useContent } from "@ui/hooks/content.hook";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ExternalLink } from "@ui/components/atomicDesign/atoms/ExternalLink/externalLink";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Loader } from "@ui/components/bjss/loading";

export type BasePcrProps = PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

export interface JesStepUIProps extends BasePcrProps {
  documents: DocumentSummaryDto[];
  onSubmit: (dto: MultipleDocumentUploadDto) => void;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

export const JesStepUI = ({ documents, documentsEditor, project, ...props }: JesStepUIProps) => {
  const { getContent } = useContent();
  const { isKTP } = checkProjectCompetition(project.competitionType);

  const jesApplyingViaSystemLinkContent = getContent(x => x.pages.pcrAddPartnerJes.jesListItem1LinkContent);
  const jesListProcessItem2 = getContent(x => x.pages.pcrAddPartnerJes.jesListItem2BeforeLink);
  const jesWebsiteLinkContent = getContent(x => x.pages.pcrAddPartnerJes.jesWebsiteLinkContent);
  const jesIntroduction = getContent(x => x.pages.pcrAddPartnerJes.jesIntroduction);
  const jesUploadSupport = getContent(x => x.pages.pcrAddPartnerJes.jesUploadSupport);
  const submitButton = getContent(x => x.pcrItem.submitButton);
  const returnToSummaryButton = getContent(x => x.pcrItem.returnToSummaryButton);
  const jesHeading = getContent(x => x.pcrAddPartnerLabels.jesHeading);
  const uploadInputLabel = getContent(x => x.documentLabels.uploadInputLabel);
  const uploadTitle = getContent(x => x.documentMessages.uploadTitle);

  const renderForm = () => {
    const applicationUrl =
      "https://www.gov.uk/government/publications/innovate-uk-completing-your-application-project-costs-guidance/guidance-for-academics-applying-via-the-je-s-system";
    const academicsApplicationLink = (
      <ExternalLink href={applicationUrl}>{jesApplyingViaSystemLinkContent}</ExternalLink>
    );

    const externalJesLink = <ExternalLink href="https://je-s.rcuk.ac.uk">{jesWebsiteLinkContent}</ExternalLink>;

    return (
      <>
        <SimpleString>{jesIntroduction}</SimpleString>

        <UL>
          <li>{academicsApplicationLink}</li>
          <li>
            {jesListProcessItem2} {externalJesLink}
          </li>
        </UL>

        <SimpleString>{jesUploadSupport}</SimpleString>

        <UploadForm.Form
          enctype="multipart"
          qa="projectChangeRequestItemUpload"
          editor={documentsEditor}
          onSubmit={() => props.onSubmit(documentsEditor.data)}
          onChange={dto => props.onFileChange(false, dto)}
        >
          <UploadForm.Fieldset qa="documentUpload">
            <UploadForm.Hidden name="description" value={() => DocumentDescription.JeSForm} />

            <DocumentGuidance />

            <UploadForm.MultipleFileUpload
              labelHidden
              name="attachment"
              validation={documentsEditor.validator.files}
              label={uploadInputLabel}
              value={data => data.files}
              update={(dto, files) => {
                dto.files = files || [];
                dto.description = DocumentDescription.JeSForm;
              }}
            />
          </UploadForm.Fieldset>

          <UploadForm.Fieldset>
            <UploadForm.Button
              name="uploadFile"
              styling="Secondary"
              onClick={() => props.onFileChange(true, documentsEditor.data)}
            >
              {uploadTitle}
            </UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </>
    );
  };

  const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

  return (
    <Section>
      <H2>{jesHeading}</H2>
      {isKTP ? (
        <ValidationMessage
          messageType="info"
          message={x => x.pages.pcrAddPartnerJes.jesIntroduction}
          qa="jes-form-ktp-not-needed-info-message"
        />
      ) : (
        <>
          {renderForm()}

          <Section>
            <DocumentEdit
              qa="je-s-document"
              onRemove={document => props.onFileDelete(documentsEditor.data, document)}
              documents={documents}
            />
          </Section>
        </>
      )}

      <Form.Form
        qa="saveAndContinue"
        data={props.pcrItem}
        onSubmit={() => props.onSave(false)}
        isSaving={props.status === EditorStatus.Saving}
      >
        <Form.Fieldset>
          <Form.Submit>{submitButton}</Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            {returnToSummaryButton}
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </Section>
  );
};

export const JeSStep = (props: BasePcrProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const pendingPayload = stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id);

  return (
    <Loader
      pending={pendingPayload}
      render={documents => (
        <JesStepUI
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
