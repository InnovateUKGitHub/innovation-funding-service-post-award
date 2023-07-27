import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { removeMessages, messageSuccess } from "@ui/redux/actions/common/messageActions";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { FormTypes } from "@ui/zod/FormTypes";
import { useStore } from "react-redux";
import { FileDeleteOutputs } from "@ui/zod/documentValidators.zod";
import { useOnUpdate } from "./onUpdate";

export const useOnDelete = <Inputs extends FileDeleteOutputs>({ refresh }: { refresh: () => void }) => {
  const store = useStore<RootState>();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, DocumentSummaryDto>({
    req(props) {
      const { documentId, projectId, form } = props;
      if (form === FormTypes.ProjectLevelDelete) {
        return clientsideApiClient.documents.deleteProjectDocument({ documentId, projectId });
      } else if (form === FormTypes.PartnerLevelDelete) {
        const { partnerId } = props;
        return clientsideApiClient.documents.deletePartnerDocument({ documentId, partnerId, projectId });
      } else if (form === FormTypes.ClaimLevelDelete) {
        const { partnerId, periodId } = props;
        return clientsideApiClient.documents.deleteClaimDocument({
          documentId,
          claimKey: { partnerId, periodId, projectId },
        });
      } else {
        return Promise.reject();
      }
    },
    onSuccess(input, _, ctx) {
      const successMessage = getContent(x => x.documentMessages.deletedDocument({ deletedFileName: ctx?.fileName }));
      store.dispatch(removeMessages());
      store.dispatch(messageSuccess(successMessage));
      scrollToTheTopSmoothly();
      refresh();
    },
  });
};
