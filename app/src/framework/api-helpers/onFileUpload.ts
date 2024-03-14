import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnUpdate } from "./onUpdate";
import type { z } from "zod";
import type {
  ProjectLevelUploadSchemaType,
  ClaimLevelUploadSchemaType,
  PcrLevelUploadSchemaType,
  ClaimDetailLevelUploadSchemaType,
} from "@ui/zod/documentValidators.zod";
import { useMessages } from "./useMessages";
import { IFileWrapper } from "@framework/types/fileWapper";

type InputOptions =
  | ({ form: FormTypes.ProjectLevelUpload } & z.output<ProjectLevelUploadSchemaType>)
  | ({ form: FormTypes.ClaimLevelUpload } & z.output<ClaimLevelUploadSchemaType>)
  | ({ form: FormTypes.ClaimDetailLevelUpload } & z.output<ClaimDetailLevelUploadSchemaType>)
  | ({ form: FormTypes.PcrLevelUpload } & z.output<PcrLevelUploadSchemaType>);

const isProjectLevelUpload = (data: InputOptions): data is z.output<ProjectLevelUploadSchemaType> =>
  data.form === FormTypes.ProjectLevelUpload;

const isClaimLevelUpload = (data: InputOptions): data is z.output<ClaimLevelUploadSchemaType> =>
  data.form === FormTypes.ClaimLevelUpload;

const isClaimDetailLevelUpload = (data: InputOptions): data is z.output<ClaimDetailLevelUploadSchemaType> =>
  data.form === FormTypes.ClaimDetailLevelUpload;

const isPcrLevelUpload = (data: InputOptions): data is z.output<PcrLevelUploadSchemaType> =>
  data.form === FormTypes.PcrLevelUpload;

export const useOnUpload = <Inputs extends InputOptions>({
  onIndividualFileSuccess,
  onSuccess,
}: {
  onIndividualFileSuccess?: ({ file, documentId }: { file: IFileWrapper; documentId: string }) => void | Promise<void>;
  onSuccess: () => void | Promise<void>;
}) => {
  const { getContent } = useContent();
  const { clearMessages, setSuccessMessage } = useMessages();

  return useOnUpdate<Inputs, unknown, MultipleDocumentUploadDto>({
    async req(data) {
      clearMessages();

      const { files, description, projectId } = data;

      const documentIds: string[] = [];

      for (const file of files) {
        let promise: Promise<{ documentIds: string[] }>;

        if (isClaimLevelUpload(data)) {
          promise = clientsideApiClient.documents.uploadClaimDocuments({
            claimKey: { projectId, partnerId: data.partnerId, periodId: data.periodId },
            documents: {
              files: [file],
              description,
            },
          });
        } else if (isClaimDetailLevelUpload(data)) {
          promise = clientsideApiClient.documents.uploadClaimDetailDocuments({
            claimDetailKey: {
              projectId,
              partnerId: data.partnerId,
              periodId: data.periodId,
              costCategoryId: data.costCategoryId,
            },
            documents: {
              files: [file],
              description,
            },
          });
        } else if (isPcrLevelUpload(data)) {
          promise = clientsideApiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({
            projectId,
            projectChangeRequestIdOrItemId: data.projectChangeRequestIdOrItemId,
            documents: {
              files: [file],
              description,
            },
          });
        } else if (isProjectLevelUpload(data)) {
          if (data.partnerId) {
            promise = clientsideApiClient.documents.uploadPartnerDocument({
              projectId: data.projectId,
              partnerId: data.partnerId,
              documents: {
                files: [file],
                description,
              },
            });
          } else {
            promise = clientsideApiClient.documents.uploadProjectDocument({
              projectId: data.projectId,
              documents: {
                files: [file],
                description,
              },
            });
          }
        } else {
          // Invalid form
          return Promise.reject();
        }

        const {
          documentIds: [documentId],
        } = await promise;
        await onIndividualFileSuccess?.({ file, documentId });
        documentIds.push(documentId);
      }

      return documentIds;
    },
    async onSuccess(data) {
      await onSuccess();
      const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: data.files.length }));
      setSuccessMessage(successMessage);
    },
  });
};
