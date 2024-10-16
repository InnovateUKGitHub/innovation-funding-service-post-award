import { ContentSelector } from "@copy/type";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/organisms/documents/DocumentView/DocumentView";
import { useContent } from "@ui/hooks/content.hook";
import { PcrPage } from "../pcrPage";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { FileInput } from "@ui/components/atoms/form/FileInput/FileInput";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useForm } from "react-hook-form";
import { PcrLevelUploadSchemaType, documentsErrorMap, getPcrLevelUpload } from "@ui/zod/documentValidators.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { usePcrFilesQuery } from "./filesStep.logic";
import { pcrFilesQuery } from "./PcrFiles.query";
import { z } from "zod";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { FormTypes } from "@ui/zod/FormTypes";
import { useNextLink, useSummaryLink } from "../utils/useNextLink";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { ReactNode } from "react";
import { createRegisterButton } from "@framework/util/registerButton";
import { useMessages } from "@framework/api-helpers/useMessages";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const FilesStep = ({
  heading,
  guidance,
  guidanceComponent: GuidanceComponent,
  documentDescription,
  returnToSummaryButton,
  formType,
}: {
  heading?: ContentSelector;
  guidance?: ContentSelector;
  guidanceComponent?: ReactNode;
  documentDescription: DocumentDescription;
  returnToSummaryButton?: boolean;
  formType?: FormTypes;
}) => {
  const { getContent } = useContent();

  const { config, projectId, itemId, onSave, isFetching, markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(pcrFilesQuery, {
    projectId,
    pcrItemId: itemId,
  });

  const { documents } = usePcrFilesQuery(projectId, itemId, refreshedQueryOptions);

  const {
    register,
    handleSubmit: handleDocumentSubmit,
    formState,
    getFieldState,
    reset,
    setError,
  } = useForm<z.output<PcrLevelUploadSchemaType>>({
    resolver: zodResolver(getPcrLevelUpload({ config: config.options }), {
      errorMap: documentsErrorMap,
    }),
  });

  const { onUpdate: onFileDelete, isProcessing: isDeleting } = useOnDelete({
    async onSuccess() {
      await refresh();
      reset();
    },
  });

  const { onUpdate: onFileUpload, isProcessing: isUploading } = useOnUpload({
    async onSuccess() {
      await refresh();
      reset();
    },
  });

  const { handleSubmit: handleFormSubmit, setValue } = useForm<{
    markedAsComplete: boolean;
    button_submit: "submit" | "returnToSummary";
  }>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      button_submit: "submit",
    },
  });

  const validationErrors = useZodErrors(setError, formState?.errors);

  const disabled = isFetching || isDeleting || isUploading;

  const registerButton = createRegisterButton(setValue, "button_submit");

  const { clearMessages } = useMessages();

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <Form
          encType="multipart/form-data"
          onSubmit={handleDocumentSubmit(data => onFileUpload({ data }), clearMessages)}
          aria-disabled={disabled}
        >
          <Fieldset>
            {!!heading && <Legend>{getContent(heading)}</Legend>}
            {typeof GuidanceComponent !== undefined && GuidanceComponent}
            {guidance && <Content markdown value={guidance} />}

            <input type="hidden" value={documentDescription} {...register("description")}></input>
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={itemId} {...register("projectChangeRequestIdOrItemId")} />
            <input type="hidden" value={FormTypes.PcrLevelUpload} {...register("form")} />

            <DocumentGuidance />
            <FormGroup hasError={!!getFieldState("files").error}>
              <ValidationError error={getFieldState("files").error} />
              <FileInput
                disabled={disabled}
                id="files"
                hasError={!!getFieldState("files").error}
                multiple
                {...register("files")}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <FormGroup>
              <Button type="submit" secondary disabled={disabled}>
                {getContent(x => x.pcrItem.uploadDocumentsButton)}
              </Button>
            </FormGroup>
          </Fieldset>
        </Form>
      </Section>

      <Section>
        <DocumentEdit
          qa="prepare-item-file-for-partner-documents"
          onRemove={doc =>
            onFileDelete({
              data: {
                form: FormTypes.PcrLevelDelete,
                documentId: doc.id,
                projectId,
                projectChangeRequestIdOrItemId: itemId,
              },
              context: doc,
            })
          }
          documents={documents}
          formType={FormTypes.PcrLevelDelete}
          disabled={disabled}
        />
      </Section>
      <Form
        onSubmit={handleFormSubmit(data =>
          onSave({
            data: { status: PCRItemStatus.Incomplete },
            context: { link: data.button_submit === "submit" ? nextLink : summaryLink },
          }),
        )}
      >
        <input type="hidden" value={formType} name="form" />
        <Fieldset>
          <Button disabled={disabled} type="submit" {...registerButton("submit")}>
            {getContent(x => x.pcrItem.submitButton)}
          </Button>

          {returnToSummaryButton && (
            <Button secondary disabled={disabled} type="submit" {...registerButton("returnToSummary")}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          )}
        </Fieldset>
      </Form>
    </PcrPage>
  );
};
