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
} from "@ui/zod/documentValidators.zod";
import { useMessages } from "./useMessages";

type InputOptions =
  | ({ form: FormTypes.ProjectLevelUpload } & z.output<ProjectLevelUploadSchemaType>)
  | ({ form: FormTypes.ClaimLevelUpload } & z.output<ClaimLevelUploadSchemaType>)
  | ({ form: FormTypes.PcrLevelUpload } & z.output<PcrLevelUploadSchemaType>);

const isProjectLevelUpload = (data: InputOptions): data is z.output<ProjectLevelUploadSchemaType> =>
  data.form === FormTypes.ProjectLevelUpload;

const isClaimLevelUpload = (data: InputOptions): data is z.output<ClaimLevelUploadSchemaType> =>
  data.form === FormTypes.ClaimLevelUpload;

const isPcrLevelUpload = (data: InputOptions): data is z.output<PcrLevelUploadSchemaType> =>
  data.form === FormTypes.PcrLevelUpload;

export const useOnUpload = <Inputs extends InputOptions>({ onSuccess }: { onSuccess: () => void }) => {
  const { getContent } = useContent();
  const { clearMessages, setSuccessMessage } = useMessages();

  return useOnUpdate<Inputs, unknown, MultipleDocumentUploadDto>({
    req(data) {
      clearMessages();

      const { files, description, projectId } = data;

      if (isClaimLevelUpload(data)) {
        return clientsideApiClient.documents.uploadClaimDocuments({
          claimKey: { projectId, partnerId: data.partnerId, periodId: data.periodId },
          documents: {
            files,
            description,
          },
        });
      } else if (isPcrLevelUpload(data)) {
        return clientsideApiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({
          projectId,
          projectChangeRequestIdOrItemId: data.projectChangeRequestIdOrItemId,
          documents: {
            files,
            description,
          },
        });
      } else if (isProjectLevelUpload(data)) {
        if (data.partnerId) {
          return clientsideApiClient.documents.uploadPartnerDocument({
            projectId: data.projectId,
            partnerId: data.partnerId,
            documents: {
              files,
              description,
            },
          });
        } else {
          return clientsideApiClient.documents.uploadProjectDocument({
            projectId: data.projectId,
            documents: {
              files,
              description,
            },
          });
        }
      } else {
        // Invalid form
        return Promise.reject();
      }
    },
    onSuccess(data, res, ctx) {
      const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: ctx?.files.length }));
      setSuccessMessage(successMessage);
      onSuccess();
    },
  });
};
