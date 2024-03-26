import { useLazyLoadQuery } from "react-relay";
import { partnerDetailsEditQuery } from "./PartnerDetailsEdit.query";
import { PartnerDetailsEditQuery } from "../../../../components/atomicDesign/templates/PartnerDetailsEdit/__generated__/PartnerDetailsEditQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useNavigate } from "react-router-dom";
import { PartnerStatus } from "@framework/constants/partner";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

export const usePartnerDetailsEditQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<PartnerDetailsEditQuery>(
    partnerDetailsEditQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "isActive"]);

  const partner = mapToPartnerDto(partnerNode, ["partnerStatus", "postcode", "postcodeStatus"], {});

  return { project, partner };
};

export type FormValues = {
  postcode: string;
  partnerStatus: PartnerStatus;
};

export const useOnUpdatePartnerDetails = (
  partnerId: PartnerId,
  projectId: ProjectId,
  navigateTo: string,
  partner: Partial<PartnerDto>,
) => {
  const navigate = useNavigate();
  return useOnUpdate<FormValues, Pick<PartnerDto, "postcode">>({
    req: data =>
      clientsideApiClient.partners.updatePartner({
        partnerId,
        partnerDto: {
          ...partner,
          postcode: data.postcode,
          id: partnerId,
          projectId,
        },
      }),
    onSuccess: () => navigate(navigateTo),
  });
};
