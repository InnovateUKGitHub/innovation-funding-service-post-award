import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnUpdate } from "./onUpdate";
import type { z } from "zod";
import type { ProjectLevelUploadSchemaType, ClaimLevelUploadSchemaType } from "@ui/zod/documentValidators.zod";
import { useMessages } from "./useMessages";

export const useOnUpload = <Inputs extends z.output<ProjectLevelUploadSchemaType | ClaimLevelUploadSchemaType>>({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const { getContent } = useContent();
  const { clearMessages, setSuccessMessage } = useMessages();

  return useOnUpdate<Inputs, unknown, MultipleDocumentUploadDto>({
    req(data) {
      clearMessages();

      const { projectId, partnerId, description, files, form } = data;

      switch (form) {
        case FormTypes.ClaimLevelUpload: {
          const { periodId } = data;
          return clientsideApiClient.documents.uploadClaimDocuments({
            claimKey: { projectId, partnerId, periodId },
            documents: {
              files,
              description,
            },
          });
        }

        case FormTypes.ProjectLevelUpload: {
          if (partnerId) {
            return clientsideApiClient.documents.uploadPartnerDocument({
              projectId,
              partnerId,
              documents: {
                files,
                description,
              },
            });
          } else {
            return clientsideApiClient.documents.uploadProjectDocument({
              projectId,
              documents: {
                files,
                description,
              },
            });
          }
        }

        default:
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
