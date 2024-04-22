import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useServerInput } from "@framework/api-helpers/useZodErrors";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { allowedClaimDocuments, allowedImpactManagementClaimDocuments } from "@framework/constants/documentDescription";
import { PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Select } from "@ui/components/atomicDesign/atoms/form/Select/Select";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEditMemo } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { useContent } from "@ui/hooks/content.hook";
import { useValidDocumentDropdownOptions } from "@ui/hooks/useValidDocumentDropdownOptions.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { ClaimLevelUploadSchemaType } from "@ui/zod/documentValidators.zod";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useReviewContent } from "./claimReview.logic";
import { ReviewClaimParams } from "./claimReview.page";

interface ClaimReviewDocumentProps extends ReviewClaimParams {
  onUploadUpdate: ReturnType<typeof useOnUpload>["onUpdate"];
  onDeleteUpdate: ReturnType<typeof useOnDelete>["onUpdate"];
  project: Pick<ProjectDto, "impactManagementParticipation">;
  disabled: boolean;
  documents: Pick<
    PartnerDocumentSummaryDtoGql,
    "description" | "id" | "link" | "fileName" | "dateCreated" | "fileSize" | "isOwner" | "uploadedBy"
  >[];
  documentForm: UseFormReturn<z.output<ClaimLevelUploadSchemaType>>;
  isOpen?: boolean;
  onClick?: () => void;
}

const ClaimReviewDocuments = ({
  projectId,
  partnerId,
  periodId,
  onUploadUpdate,
  onDeleteUpdate,
  project,
  disabled,
  documents,
  documentForm,
  isOpen,
  onClick,
}: ClaimReviewDocumentProps) => {
  const content = useReviewContent();
  const { getContent } = useContent();
  const defaults = useServerInput<z.output<ClaimLevelUploadSchemaType>>();

  const documentDropdownOptions = useValidDocumentDropdownOptions(
    project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? allowedImpactManagementClaimDocuments
      : allowedClaimDocuments,
  );

  return (
    <AccordionItem
      title={content.accordionTitleSupportingDocumentsForm}
      qa="upload-supporting-documents-form-accordion"
      isOpen={isOpen}
      onClick={onClick}
    >
      <Markdown trusted value={content.uploadInstruction} />
      <DocumentGuidance />

      <Form
        onSubmit={documentForm.handleSubmit(data => onUploadUpdate({ data }))}
        data-qa="upload-form"
        encType="multipart/form-data"
      >
        <input type="hidden" value={FormTypes.ClaimReviewLevelUpload} {...documentForm.register("form")} />
        <input type="hidden" value={projectId} {...documentForm.register("projectId")} />
        <input type="hidden" value={partnerId} {...documentForm.register("partnerId")} />
        <input type="hidden" value={periodId} {...documentForm.register("periodId")} />

        {/* File uploads */}
        <Fieldset>
          <FormGroup hasError={!!documentForm.getFieldState("files").error}>
            <ValidationError error={documentForm.getFieldState("files").error} />
            <FileInput
              disabled={disabled}
              id="files"
              hasError={!!documentForm.getFieldState("files").error}
              multiple
              {...documentForm.register("files")}
            />
          </FormGroup>
        </Fieldset>

        {/* Description selection */}
        <Fieldset>
          <FormGroup hasError={!!documentForm.getFieldState("description").error}>
            <Label htmlFor="description">{getContent(x => x.documentLabels.descriptionLabel)}</Label>
            <ValidationError error={documentForm.getFieldState("description").error} />
            <Select
              disabled={disabled}
              id="description"
              defaultValue={defaults?.description}
              {...documentForm.register("description")}
            >
              {documentDropdownOptions.map(x => (
                <option value={x.value} key={x.id} data-qa={x.qa}>
                  {x.displayName}
                </option>
              ))}
            </Select>
          </FormGroup>
        </Fieldset>

        <Fieldset>
          <Button disabled={disabled} name="button_default" styling="Secondary" type="submit">
            {getContent(x => x.documentMessages.uploadDocuments)}
          </Button>
        </Fieldset>
      </Form>

      <DocumentEditMemo
        qa="claim-documents"
        onRemove={document =>
          onDeleteUpdate({
            data: {
              form: FormTypes.ClaimReviewLevelDelete,
              documentId: document.id,
              projectId,
              partnerId,
              periodId,
            },
            context: document,
          })
        }
        documents={documents}
        formType={FormTypes.ClaimReviewLevelDelete}
        disabled={disabled}
      />
    </AccordionItem>
  );
};

export { ClaimReviewDocuments };
