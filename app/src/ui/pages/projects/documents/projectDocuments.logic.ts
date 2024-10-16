import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import {
  mapToPartnerDocumentSummaryDtoArray,
  mapToProjectDocumentSummaryDtoArray,
} from "@gql/dtoMapper/mapDocumentsDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { getFirstEdge } from "@gql/selectors/edges";
import { useContent } from "@ui/hooks/content.hook";
import { useLazyLoadQuery } from "react-relay";
import { projectDocumentsQuery } from "./ProjectDocuments.query";
import { ProjectDocumentsQuery } from "./__generated__/ProjectDocumentsQuery.graphql";

export const useProjectDocumentsQuery = (projectId: ProjectId, refreshedQueryOptions: RefreshedQueryOptions) => {
  const data = useLazyLoadQuery<ProjectDocumentsQuery>(projectDocumentsQuery, { projectId }, refreshedQueryOptions);

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  const project = mapToProjectDto(projectNode, ["id", "roles"]);

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
    { projectId, type: "projects" },
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
      currentUserRoles: project.roles,
      partnerRoles,
    },
  );

  return { project, partners, partnerDocuments, projectDocuments, fragmentRef: data.salesforce.uiapi };
};

export const useValidPartnerDropdownOptions = (
  validUploadPartners: Pick<PartnerDtoGql, "roles" | "id" | "isLead" | "name">[],
) => {
  const { getContent } = useContent();

  const partnerOptions = [
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
