import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankStatementQuery } from "./ProjectSetupBankStatement.query";
import { ProjectSetupBankStatementQuery } from "./__generated__/ProjectSetupBankStatementQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { mapToPartnerDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { z } from "zod";
import { UploadBankStatementSchemaType } from "@ui/zod/documentValidators.zod";
import { DocumentSummaryDto, PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { UseFormReset } from "react-hook-form";

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

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges ?? []);

  const project = mapToProjectDto(projectNode, ["roles", "partnerRoles"]);

  const documents = mapToPartnerDocumentSummaryDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
    [
      "partnerId",
      "id",
      "fileName",
      "fileSize",
      "description",
      "dateCreated",
      "uploadedBy",
      "link",
      "isOwner",
      "partnerName",
      "linkedEntityId",
    ],
    {
      projectId,
      currentUser: { userId: data.currentUser.userId },
      currentUserRoles: project.roles,
      partnerRoles: project.partnerRoles,
    },
  );

  return { fragmentRef: data?.salesforce?.uiapi, documents };
};

export const useSetupBankStatementActions = (
  refresh: () => void,
  reset: UseFormReset<z.output<UploadBankStatementSchemaType>>,
  projectId: ProjectId,
) => {
  const {
    onUpdate: onUploadUpdate,
    apiError: onUploadApiError,
    isFetching: onUploadFetching,
  } = useOnUpload({
    onSuccess() {
      refresh();
      reset();
    },
  });

  const {
    onUpdate: onDeleteUpdate,
    apiError: onDeleteApiError,
    isFetching: onDeleteFetching,
  } = useOnDelete({ onSuccess: refresh });

  const onChange = (dto: z.output<UploadBankStatementSchemaType>) => {
    onUploadUpdate({
      data: dto,
      context: dto,
    });
  };

  const onDelete = (doc: DocumentSummaryDto | PartnerDocumentSummaryDtoGql) => {
    if ("partnerId" in doc) {
      onDeleteUpdate({
        data: {
          form: FormTypes.PartnerLevelDelete,
          documentId: doc.id,
          projectId,
          partnerId: doc.partnerId,
        },
        context: doc,
      });
    } else {
      onDeleteUpdate({
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
