import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import {
  mapToProjectDocumentSummaryDtoArray,
  mapToPartnerDocumentSummaryDtoArray,
} from "@gql/dtoMapper/mapDocumentsDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { getFirstEdge } from "@gql/selectors/edges";
import { FileDeleteOutputs, ProjectLevelUploadOutputs } from "@ui/zod/documentValidators.zod";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { removeMessages, messageSuccess } from "@ui/redux/actions/common/messageActions";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { useStore } from "react-redux";
import { useLazyLoadQuery } from "react-relay";
import { projectDocumentsQuery } from "./ProjectDocuments.query";
import { ProjectDocumentsQuery, ProjectDocumentsQuery$data } from "./__generated__/ProjectDocumentsQuery.graphql";
import { DropdownListOption } from "@ui/components/bjss/inputs/dropdownList";

type ProjectGQL = GQL.NodeSelector<ProjectDocumentsQuery$data, "Acc_Project__c">;

export const useProjectDocumentsQuery = (projectId: ProjectId, refreshedQueryOptions: RefreshedQueryOptions) => {
  const data = useLazyLoadQuery<ProjectDocumentsQuery>(projectDocumentsQuery, { projectId }, refreshedQueryOptions);

  const { node: projectNode } = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  const project = mapToProjectDto(projectNode, ["id", "projectNumber", "title", "status", "roles"]);

  const partners = sortPartnersLeadFirst(
    mapToPartnerDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
      ["id", "name", "roles", "isLead"],
      { partnerRoles },
    ),
  );

  const projectDocuments = mapToProjectDocumentSummaryDtoArray(
    projectNode?.ContentDocumentLinks?.edges ?? [],
    ["id", "fileName", "fileSize", "link", "description", "dateCreated", "uploadedBy", "isOwner"],
    { currentUser: (data?.currentUser as { email: string }) ?? { email: "unknown user" }, projectId, type: "projects" },
  );

  const partnerDocuments = mapToPartnerDocumentSummaryDtoArray(
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
      currentUser: (data?.currentUser as { email: string }) ?? { email: "unknown user" },
      currentUserRoles: project.roles,
      partnerRoles,
    },
  );

  return { project, partners, partnerDocuments, projectDocuments };
};

export const useOnUpload = <Inputs extends ProjectLevelUploadOutputs>({ refresh }: { refresh: () => void }) => {
  const store = useStore<RootState>();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, MultipleDocumentUploadDto>({
    req(data) {
      const { projectId, partnerId, description, files } = data;

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

export const useOnDelete = <Inputs extends FileDeleteOutputs>({ refresh }: { refresh: () => void }) => {
  const store = useStore<RootState>();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, DocumentSummaryDto>({
    req(props) {
      const { documentId, projectId, form } = props;
      if (form === "projectLevelDelete") {
        return clientsideApiClient.documents.deleteProjectDocument({ documentId, projectId });
      } else if (form === "partnerLevelDelete") {
        const { partnerId } = props;
        return clientsideApiClient.documents.deletePartnerDocument({ documentId, partnerId, projectId });
      } else if (form === "claimLevelDelete") {
        const { partnerId, periodId } = props;
        return clientsideApiClient.documents.deleteClaimDocument({
          documentId,
          claimKey: { projectId, partnerId, periodId },
        });
      } else if (form === "claimDetailLevelDelete") {
        const { partnerId, periodId, costCategoryId } = props;
        return clientsideApiClient.documents.deleteClaimDetailDocument({
          documentId,
          claimDetailKey: { costCategoryId, partnerId, periodId, projectId },
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

export const useValidPartnerDropdownOptions = (
  validUploadPartners: Pick<PartnerDtoGql, "roles" | "id" | "isLead" | "name">[],
) => {
  const { getContent } = useContent();

  const partnerOptions: DropdownListOption[] = [
    {
      id: "none",
      value: "",
      displayName: getContent(x => x.documentLabels.participantPlaceholder),
      qa: `document-partner-null`,
    },
    ...validUploadPartners.map(partner => ({
      id: partner.id,
      value: partner.id,
      displayName: getContent(x => x.documentLabels.participantOption({ partnerName: partner.name })),
      qa: `document-partner-${partner.id}`,
    })),
  ];

  return partnerOptions;
};
