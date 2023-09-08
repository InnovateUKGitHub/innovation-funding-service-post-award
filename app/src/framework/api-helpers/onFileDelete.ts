import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { removeMessages, messageSuccess } from "@ui/redux/actions/common/messageActions";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { FormTypes } from "@ui/zod/FormTypes";
import { useStore } from "react-redux";
import { useOnUpdate } from "./onUpdate";
import { useStores } from "@ui/redux/storesProvider";
import type { z } from "zod";
import type { claimLevelDelete, partnerLevelDelete, projectLevelDelete } from "@ui/zod/documentValidators.zod";

export const useOnDelete = <
  Inputs extends z.output<typeof projectLevelDelete | typeof partnerLevelDelete | typeof claimLevelDelete>,
>({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const store = useStore<RootState>();
  const stores = useStores();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, DocumentSummaryDto>({
    req(props) {
      stores.messages.clearMessages();

      const { documentId, projectId, form } = props;

      switch (form) {
        case FormTypes.ProjectLevelDelete: {
          return clientsideApiClient.documents.deleteProjectDocument({ documentId, projectId });
        }

        case FormTypes.PartnerLevelDelete: {
          const { partnerId } = props;
          return clientsideApiClient.documents.deletePartnerDocument({ documentId, partnerId, projectId });
        }

        case FormTypes.ClaimLevelDelete: {
          const { partnerId, periodId } = props;
          return clientsideApiClient.documents.deleteClaimDocument({
            documentId,
            claimKey: { partnerId, periodId, projectId },
          });
        }

        default:
          // Invalid form
          return Promise.reject();
      }
    },
    onSuccess(input, _, ctx) {
      const successMessage = getContent(x => x.documentMessages.deletedDocument({ deletedFileName: ctx?.fileName }));
      store.dispatch(removeMessages());
      store.dispatch(messageSuccess(successMessage));
      scrollToTheTopSmoothly();
      onSuccess();
    },
  });
};
