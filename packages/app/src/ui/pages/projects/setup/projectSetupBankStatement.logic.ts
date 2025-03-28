import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankStatementQuery } from "./ProjectSetupBankStatement.query";
import { ProjectSetupBankStatementQuery } from "./__generated__/ProjectSetupBankStatementQuery.graphql";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { z } from "zod";
import { UploadBankStatementSchemaType } from "@ui/zod/documentValidators.zod";
import { DocumentSummaryDto, PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { UseFormReset } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { BankStatementSchema } from "./projectSetupBankStatement.zod";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/context/routesProvider";

export const useSetupBankStatementData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<ProjectSetupBankStatementQuery>(
    projectSetupBankStatementQuery,
    { projectId, partnerId },
    refreshedQueryOptions,
  );

  return {
    fragmentRef: data?.salesforce?.uiapi,
    userId: data?.currentUser?.userId ?? "unknown",
  };
};

export const useSetupBankStatementActions = (
  refresh: () => void,
  reset: UseFormReset<z.output<UploadBankStatementSchemaType>>,
  projectId: ProjectId,
) => {
  const {
    onUpdate: onUploadUpdate,
    apiError: onUploadApiError,
    isProcessing: onUploadFetching,
  } = useOnUpload({
    async onSuccess() {
      refresh();
      reset();
    },
  });

  const {
    onUpdate: onDeleteUpdate,
    apiError: onDeleteApiError,
    isProcessing: onDeleteFetching,
  } = useOnDelete({ onSuccess: refresh });

  const onChange = (dto: z.output<UploadBankStatementSchemaType>) =>
    onUploadUpdate({
      data: dto,
      context: dto,
    });

  const onDelete = (doc: DocumentSummaryDto | PartnerDocumentSummaryDtoGql) => {
    if ("partnerId" in doc) {
      return onDeleteUpdate({
        data: {
          form: FormTypes.PartnerLevelDelete,
          documentId: doc.id,
          projectId,
          partnerId: doc.partnerId,
        },
        context: doc,
      });
    } else {
      return onDeleteUpdate({
        data: { form: FormTypes.ProjectLevelDelete, documentId: doc.id, projectId },
        context: doc,
      });
    }
  };

  const isFetching = onUploadFetching || onDeleteFetching;
  const apiError = onUploadApiError || onDeleteApiError;

  return {
    isFetching,
    onDelete,
    onChange,
    apiError,
  };
};

export const useOnUpdateProjectSetupBankStatement = (projectId: ProjectId, partnerId: PartnerId) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<BankStatementSchema>, boolean>({
    req: data =>
      clientsideApiClient.partners.updatePartnerBankStatement({
        partnerId,
        projectId,
        partnerDto: data,
      }),
    onSuccess: () =>
      navigate(
        routes.projectSetup.getLink({
          projectId,
          partnerId,
        }).path,
      ),
  });
};
