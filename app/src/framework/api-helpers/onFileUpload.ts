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
  LoanLevelUploadSchemaType,
  UploadBankStatementSchemaType,
} from "@ui/zod/documentValidators.zod";
import { useMessages } from "./useMessages";

type InputOptions =
  | ({ form: FormTypes.ProjectLevelUpload } & z.output<ProjectLevelUploadSchemaType>)
  | ({ form: FormTypes.ClaimLevelUpload | FormTypes.ClaimReviewLevelUpload } & z.output<ClaimLevelUploadSchemaType>)
  | ({ form: FormTypes.ClaimDetailLevelUpload } & z.output<ClaimDetailLevelUploadSchemaType>)
  | ({ form: FormTypes.PcrLevelUpload } & z.output<PcrLevelUploadSchemaType>)
  | ({ form: FormTypes.LoanLevelUpload } & z.output<LoanLevelUploadSchemaType>)
  | ({ form: FormTypes.ProjectSetupBankStatementUpload } & z.output<UploadBankStatementSchemaType>);

const isProjectLevelUpload = (data: InputOptions): data is z.output<ProjectLevelUploadSchemaType> =>
  data.form === FormTypes.ProjectLevelUpload;

const isClaimLevelUpload = (data: InputOptions): data is z.output<ClaimLevelUploadSchemaType> =>
  data.form === FormTypes.ClaimLevelUpload || data.form === FormTypes.ClaimReviewLevelUpload;

const isClaimDetailLevelUpload = (data: InputOptions): data is z.output<ClaimDetailLevelUploadSchemaType> =>
  data.form === FormTypes.ClaimDetailLevelUpload;

const isPcrLevelUpload = (data: InputOptions): data is z.output<PcrLevelUploadSchemaType> =>
  data.form === FormTypes.PcrLevelUpload;

const isLoanLevelUpload = (data: InputOptions): data is z.output<LoanLevelUploadSchemaType> =>
  data.form === FormTypes.LoanLevelUpload;

const isBankStatementUpload = (data: InputOptions): data is z.output<UploadBankStatementSchemaType> =>
  data.form === FormTypes.ProjectSetupBankStatementUpload;

export const useOnUpload = <Inputs extends InputOptions>({ onSuccess }: { onSuccess: () => void | Promise<void> }) => {
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
      } else if (isClaimDetailLevelUpload(data)) {
        return clientsideApiClient.documents.uploadClaimDetailDocuments({
          claimDetailKey: {
            projectId,
            partnerId: data.partnerId,
            periodId: data.periodId,
            costCategoryId: data.costCategoryId,
          },
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
      } else if (isLoanLevelUpload(data)) {
        return clientsideApiClient.documents.uploadLoanDocuments({
          projectId,
          loanId: data.loanId,
          documents: {
            files,
            description,
          },
        });
      } else if (isProjectLevelUpload(data) || isBankStatementUpload(data)) {
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
    async onSuccess(data) {
      await onSuccess();
      const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: data.files.length }));
      setSuccessMessage(successMessage);
    },
  });
};
