import { DocumentDescription } from "@framework/constants/documentDescription";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { useContent } from "@ui/hooks/content.hook";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useForm } from "react-hook-form";
import { PcrLevelUploadSchemaType, documentsErrorMap, getPcrLevelUpload } from "@ui/zod/documentValidators.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { z } from "zod";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { FormTypes } from "@ui/zod/FormTypes";
import { useGetBackLink, useNextReasoningLink, usePcrReasoningFilesQuery } from "./pcrReasoningWorkflow.logic";
import { PcrItemListSection } from "./pcrReasoningWorkflow.page";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { pcrReasoningFilesQuery } from "./PcrReasoningFiles.query";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { usePcrReasoningContext } from "./pcrReasoningContext";
import { useMessages } from "@framework/api-helpers/useMessages";
import { PcrReasoningFilesSchema, PcrReasoningFilesSchemaType, pcrReasoningFilesSchema } from "./pcrReasoning.zod";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const PCRPrepareReasoningFilesStep = () => {
  const { getContent } = useContent();

  const { pcrId, projectId, fragmentRef, messages, isFetching, apiError, config, onUpdate } = usePcrReasoningContext();
  const nextLink = useNextReasoningLink();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(pcrReasoningFilesQuery, {
    projectId,
    pcrId,
  });

  const { documents } = usePcrReasoningFilesQuery(projectId, pcrId, refreshedQueryOptions);

  const {
    register,
    handleSubmit: handleDocumentSubmit,
    formState,
    getFieldState,
    reset,
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

  const { handleSubmit: handleFormSubmit, setError } = useForm<PcrReasoningFilesSchemaType>({
    defaultValues: {
      form: FormTypes.PcrPrepareReasoningFilesStep,
    },
    resolver: zodResolver(pcrReasoningFilesSchema),
  });

  const validationErrors = useZodErrors<z.output<PcrReasoningFilesSchema>>(setError, formState.errors);

  const { clearMessages } = useMessages();

  const disabled = isFetching || isDeleting || isUploading;

  const backLink = useGetBackLink();
  return (
    <Page apiError={apiError} validationErrors={validationErrors} backLink={backLink} fragmentRef={fragmentRef}>
      <Messages messages={messages} />
      <PcrItemListSection />
      <Section>
        <Form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleDocumentSubmit(data => onFileUpload({ data }), clearMessages)}
          aria-disabled={disabled}
        >
          <Fieldset>
            <Legend>{getContent(x => x.documentMessages.uploadDocuments)}</Legend>

            <input type="hidden" value={DocumentDescription.PcrEvidence} {...register("description")}></input>
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={pcrId} {...register("projectChangeRequestIdOrItemId")} />
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
                projectChangeRequestIdOrItemId: pcrId,
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
          onUpdate({ data: { ...data, reasoningStatus: PCRItemStatus.Incomplete }, context: { link: nextLink } }),
        )}
      >
        <input type="hidden" value={FormTypes.PcrPrepareReasoningFilesStep} {...register("form")} />
        <Fieldset>
          <Button disabled={disabled} type="submit">
            {getContent(x => x.pcrItem.submitButton)}
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};
