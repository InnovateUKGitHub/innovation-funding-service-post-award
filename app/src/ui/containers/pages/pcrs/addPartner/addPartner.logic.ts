import { useLazyLoadQuery } from "react-relay";
import { addPartnerWorkflowQuery } from "./AddPartner.query";
import { AddPartnerWorkflowQuery } from "./__generated__/AddPartnerWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";

export const useAddPartnerWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<AddPartnerWorkflowQuery>(
    addPartnerWorkflowQuery,
    {
      projectId,
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);
  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "roles", "competitionType"]);

  const partners = sortPartnersLeadFirst(
    mapToPartnerDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
      ["id", "isLead", "isWithdrawn", "name"],
      {},
    ),
  );

  const documents = (pcrNode?.ContentDocumentLinks?.edges ?? []).map(node =>
    mapToDocumentSummaryDto(
      node,
      ["id", "dateCreated", "description", "fileName", "fileSize", "isOwner", "uploadedBy", "link", "linkedEntityId"],
      {
        type: "pcr",
        projectId,
        pcrId: pcrItemId,
      },
    ),
  );

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "projectRole",
      "partnerType",
      "isCommercialWork",
      "organisationType",
      "organisationName",
      "participantSize",
      "projectCity",
      "projectLocation",
      "projectPostcode",
    ],
    {},
  );

  return { project, pcrItem, partners, documents, fragmentRef: data?.salesforce?.uiapi };
};
