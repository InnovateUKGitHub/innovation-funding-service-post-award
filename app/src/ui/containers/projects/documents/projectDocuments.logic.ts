import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import {
  getPartnerRoles,
  mapToPartnerDocumentSummaryDtoArray,
  mapToProjectDocumentSummaryDtoArray,
  mapToPartnerDtoArray,
  mapToProjectDto,
} from "@gql/dtoMapper";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { getFirstEdge } from "@gql/selectors/edges";

import { useLazyLoadQuery } from "react-relay";
import { projectDocumentsQuery } from "./ProjectDocuments.query";
import { ProjectDocumentsQuery, ProjectDocumentsQuery$data } from "./__generated__/ProjectDocumentsQuery.graphql";

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
    { currentUser: (data?.currentUser as { email: string }) ?? { email: "unknown user" }, projectId },
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
