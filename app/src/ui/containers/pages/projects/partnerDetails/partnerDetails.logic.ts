import { useLazyLoadQuery } from "react-relay";
import { partnerDetailsQuery } from "./PartnerDetails.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { PartnerDetailsQuery } from "./__generated__/PartnerDetailsQuery.graphql";

export const usePartnerDetailsQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<PartnerDetailsQuery>(
    partnerDetailsQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "roles", "partnerRoles", "status", "title"]);

  const partner = mapToPartnerDto(partnerNode, ["partnerStatus", "postcode", "roles", "name", "type"], {
    roles: project.partnerRoles.find(roles => roles.partnerId === partnerNode?.Id) ?? {
      isFc: false,
      isPm: false,
      isMo: false,
    },
  });

  return { project, partner };
};
