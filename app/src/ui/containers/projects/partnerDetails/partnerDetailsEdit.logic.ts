import { useLazyLoadQuery } from "react-relay";
import { partnerDetailsEditQuery } from "./PartnerDetailsEdit.query";
import { PartnerDetailsEditQuery, PartnerDetailsEditQuery$data } from "./__generated__/PartnerDetailsEditQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto, mapToProjectDto } from "@gql/dtoMapper";
import { PartnerDto } from "@framework/dtos";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { apiClient } from "@ui/apiClient";
import { PartnerStatus } from "@framework/types";
import { useNavigate } from "react-router-dom";

type ProjectGql = GQL.NodeSelector<PartnerDetailsEditQuery$data, "Acc_Project__c">;

export const usePartnerDetailsEditQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<PartnerDetailsEditQuery>(
    partnerDetailsEditQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title"]);

  const partner = mapToPartnerDto(partnerNode, ["partnerStatus", "postcode", "postcodeStatus"], {});

  return { project, partner };
};

export type FormValues = {
  "new-postcode": string;
  partnerStatus: PartnerStatus;
};

export const useOnUpdatePartnerDetails = (
  partnerId: PartnerId,
  projectId: ProjectId,
  navigateTo: string,
  partner: Partial<PartnerDto>,
) => {
  const navigate = useNavigate();
  return useOnUpdate<FormValues, Promise<Pick<PartnerDto, "postcode">>>({
    req: data =>
      apiClient.partners.updatePartner({
        partnerId,
        partnerDto: { ...partner, postcode: data["new-postcode"], id: partnerId, projectId },
      }),
    onSuccess: () => navigate(navigateTo),
  });
};
