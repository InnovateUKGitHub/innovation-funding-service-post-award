import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { allowedClaimDocuments, allowedImpactManagementClaimDocuments } from "@framework/constants/documentDescription";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { DropdownOption, createTypedForm } from "@ui/components/bjss/form/form";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { useEnumDocuments } from "../components/allowed-documents.hook";
import { useClaimReviewPageData, useReviewContent } from "./claimReview.logic";
import React from "react";

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
  if (!documents.length || !selectedDocument.description) return undefined;

  const targetId = selectedDocument.description.toString();

  return documents.find(x => x.id === targetId);
};

interface ClaimReviewDocumentsProps {
  data: ReturnType<typeof useClaimReviewPageData>;
  content: ReturnType<typeof useReviewContent>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  isFetching: boolean;
  onUpload: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const ClaimReviewDocuments = ({
  data,
  content,
  documentsEditor,
  isFetching,
  onUpload,
  onDelete,
}: ClaimReviewDocumentsProps) => {
  const docs = useEnumDocuments(
    data.project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? allowedImpactManagementClaimDocuments
      : allowedClaimDocuments,
  );

  return (
    <>
      <UploadForm.Form
        enctype="multipart"
        editor={documentsEditor}
        onChange={dto => onUpload(false, dto)}
        onSubmit={() => onUpload(true, documentsEditor.data)}
        qa="projectDocumentUpload"
      >
        <UploadForm.Fieldset>
          <Markdown value={content.uploadInstruction} />

          <DocumentGuidance />

          <UploadForm.MultipleFileUpload
            label={content.labelInputUpload}
            name="attachment"
            labelHidden
            value={x => x.files}
            update={(dto, files) => (dto.files = files || [])}
            validation={documentsEditor.validator.files}
          />

          <UploadForm.DropdownList
            label={content.descriptionLabel}
            labelHidden={false}
            hasEmptyOption
            placeholder="-- No description --"
            name="description"
            validation={documentsEditor.validator.files}
            options={docs}
            value={selectedOption => filterDropdownList(selectedOption, docs)}
            update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
          />
        </UploadForm.Fieldset>

        <UploadForm.Submit name="reviewDocuments" styling="Secondary">
          {content.buttonUpload}
        </UploadForm.Submit>
      </UploadForm.Form>

      <Section>
        <DocumentEdit
          qa="claim-supporting-documents"
          onRemove={document => onDelete(documentsEditor.data, document)}
          documents={data.documents}
          disabled={isFetching}
        />
      </Section>
    </>
  );
};

const MemoisedClaimReviewDocuments = React.memo(ClaimReviewDocuments);

export { MemoisedClaimReviewDocuments as ClaimReviewDocuments };
