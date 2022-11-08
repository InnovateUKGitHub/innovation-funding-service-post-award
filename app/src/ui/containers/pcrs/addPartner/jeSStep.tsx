import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { DocumentDescription } from "@framework/constants";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

export type BasePcrProps = PcrStepProps<Dtos.PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>;

export interface JesStepUIProps extends BasePcrProps {
  documents: Dtos.DocumentSummaryDto[];
  onSubmit: (dto: Dtos.MultipleDocumentUploadDto) => void;
  onFileChange: (isSaving: boolean, dto: Dtos.MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: Dtos.MultipleDocumentUploadDto, document: Dtos.DocumentSummaryDto) => void;
}

const UploadForm = ACC.createTypedForm<Dtos.MultipleDocumentUploadDto>();

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
      <ACC.Renderers.ExternalLink href={applicationUrl}>{jesApplyingViaSystemLinkContent}</ACC.Renderers.ExternalLink>
    );

    const externalJesLink = (
      <ACC.Renderers.ExternalLink href="https://je-s.rcuk.ac.uk">{jesWebsiteLinkContent}</ACC.Renderers.ExternalLink>
    );

    return (
      <>
        <ACC.Renderers.SimpleString>{jesIntroduction}</ACC.Renderers.SimpleString>

        <ACC.UL>
          <li>{academicsApplicationLink}</li>
          <li>
            {jesListProcessItem2} {externalJesLink}
          </li>
        </ACC.UL>

        <ACC.Renderers.SimpleString>{jesUploadSupport}</ACC.Renderers.SimpleString>

        <UploadForm.Form
          enctype="multipart"
          qa="projectChangeRequestItemUpload"
          editor={documentsEditor}
          onSubmit={() => props.onSubmit(documentsEditor.data)}
          onChange={dto => props.onFileChange(false, dto)}
        >
          <UploadForm.Fieldset qa="documentUpload">
            <UploadForm.Hidden name="description" value={() => DocumentDescription.JeSForm} />

            <ACC.DocumentGuidance />

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

  const Form = ACC.createTypedForm<Dtos.PCRItemForPartnerAdditionDto>();

  return (
    <ACC.Section>
      <ACC.H2>{jesHeading}</ACC.H2>
      {isKTP ? (
        <ACC.ValidationMessage
          messageType="info"
          message={x => x.pages.pcrAddPartnerJes.jesIntroduction}
          qa="jes-form-ktp-not-needed-info-message"
        />
      ) : (
        <>
          {renderForm()}

          <ACC.Section>
            <ACC.DocumentEdit
              qa="je-s-document"
              onRemove={document => props.onFileDelete(documentsEditor.data, document)}
              documents={documents}
            />
          </ACC.Section>
        </>
      )}

      <Form.Form qa="saveAndContinue" data={props.pcrItem} onSubmit={() => props.onSave(false)}>
        <Form.Fieldset>
          <Form.Submit>{submitButton}</Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            {returnToSummaryButton}
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};

export const JeSStep = (props: BasePcrProps) => {
  const stores = useStores();
  const pendingPayload = stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.project.id, props.pcrItem.id);

  return (
    <ACC.Loader
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
              "Your document has been removed.",
            );
          }}
        />
      )}
    />
  );
};
