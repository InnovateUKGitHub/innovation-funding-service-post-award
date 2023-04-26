import { useLazyLoadQuery } from "react-relay";
import { partnerDetailsQuery } from "./PartnerDetails.query";
import { PartnerDetailsQuery, PartnerDetailsQuery$data } from "./__generated__/PartnerDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto, mapToProjectDto } from "@gql/dtoMapper";

type ProjectGql = GQL.NodeSelector<PartnerDetailsQuery$data, "Acc_Project__c">;

export const usePartnerDetailsQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<PartnerDetailsQuery>(
    partnerDetailsQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "roles", "partnerRoles", "status", "title"]);

  const partner = mapToPartnerDto(partnerNode, ["partnerStatus", "postcode", "roles", "name", "type"], {
    roles: project.partnerRoles.find(roles => roles.partnerId === partnerNode?.Acc_AccountId__c?.value) ?? {
      isFc: false,
      isPm: false,
      isMo: false,
    },
  });

  return { project, partner };
};
