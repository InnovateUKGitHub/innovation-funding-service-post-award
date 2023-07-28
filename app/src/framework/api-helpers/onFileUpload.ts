import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { removeMessages, messageSuccess } from "@ui/redux/actions/common/messageActions";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { FormTypes } from "@ui/zod/FormTypes";
import { useStore } from "react-redux";
import { FileUploadOutputs } from "@ui/zod/documentValidators.zod";
import { useOnUpdate } from "./onUpdate";
import { useStores } from "@ui/redux/storesProvider";

export const useOnUpload = <Inputs extends FileUploadOutputs>({ refresh }: { refresh: () => void }) => {
  const store = useStore<RootState>();
  const stores = useStores();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, MultipleDocumentUploadDto>({
    req(data) {
      stores.messages.clearMessages();

      const { projectId, partnerId, description, files, form } = data;

      if (form === FormTypes.ClaimLevelUpload) {
        const { periodId } = data;
        return clientsideApiClient.documents.uploadClaimDocuments({
          claimKey: { projectId, partnerId, periodId },
          documents: {
            files,
            description,
          },
        });
      } else if (form === FormTypes.ProjectLevelUpload) {
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
      } else {
        // Invalid form
        return Promise.reject();
      }
    },
    onSuccess(data, res, ctx) {
      const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: ctx?.files.length }));
      store.dispatch(removeMessages());
      store.dispatch(messageSuccess(successMessage));
      scrollToTheTopSmoothly();
      refresh();
    },
  });
};
