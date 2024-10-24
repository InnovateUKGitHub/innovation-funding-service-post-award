import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnUpdate } from "./onUpdate";
import type { z } from "zod";
import type {
  claimLevelDelete,
  partnerLevelDelete,
  projectLevelDelete,
  pcrLevelDelete,
  claimDetailLevelDelete,
  loanLevelDelete,
} from "@ui/zod/documentValidators.zod";
import { useMessages } from "./useMessages";

export const useOnDelete = <
  Inputs extends z.output<
    | typeof projectLevelDelete
    | typeof partnerLevelDelete
    | typeof claimLevelDelete
    | typeof pcrLevelDelete
    | typeof claimDetailLevelDelete
    | typeof loanLevelDelete
  >,
>({
  onSuccess,
}: {
  onSuccess: () => void | Promise<void>;
}) => {
  const { getContent } = useContent();

  const { clearMessages, setSuccessMessage } = useMessages();

  return useOnUpdate<Inputs, unknown, DocumentSummaryDto>({
    req(props) {
      clearMessages();

      const { documentId, projectId, form } = props;

      switch (form) {
        case FormTypes.ProjectLevelDelete: {
          return clientsideApiClient.documents.deleteProjectDocument({ documentId, projectId });
        }

        case FormTypes.PartnerLevelDelete: {
          const { partnerId } = props;
          return clientsideApiClient.documents.deletePartnerDocument({ documentId, partnerId, projectId });
        }

        case FormTypes.ClaimReviewLevelDelete:
        case FormTypes.ClaimLevelDelete: {
          const { partnerId, periodId } = props;
          return clientsideApiClient.documents.deleteClaimDocument({
            documentId,
            claimKey: { partnerId, periodId, projectId },
          });
        }

        case FormTypes.ClaimDetailLevelDelete: {
          const { partnerId, periodId, costCategoryId } = props;
          return clientsideApiClient.documents.deleteClaimDetailDocument({
            documentId,
            claimDetailKey: { partnerId, costCategoryId, periodId, projectId },
          });
        }

        case FormTypes.PcrLevelDelete: {
          const { projectId, projectChangeRequestIdOrItemId } = props;

          return clientsideApiClient.documents.deleteProjectChangeRequestDocumentOrItemDocument({
            documentId,
            projectChangeRequestIdOrItemId,
            projectId,
          });
        }

        case FormTypes.LoanLevelDelete: {
          const { projectId, loanId, documentId } = props;

          return clientsideApiClient.documents.deleteLoanDocument({ projectId, loanId, documentId });
        }

        default:
          // Invalid form
          return Promise.reject();
      }
    },
    async onSuccess(input, _, ctx) {
      await onSuccess();
      const successMessage = getContent(x => x.documentMessages.deletedDocument({ deletedFileName: ctx?.fileName }));
      setSuccessMessage(successMessage);
      scrollToTheTopSmoothly();
    },
  });
};
