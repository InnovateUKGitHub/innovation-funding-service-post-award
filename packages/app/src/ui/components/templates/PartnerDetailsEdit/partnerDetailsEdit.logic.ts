import { useLazyLoadQuery } from "react-relay";
import { partnerDetailsEditQuery } from "./PartnerDetailsEdit.query";
import { PartnerDetailsEditQuery } from "./__generated__/PartnerDetailsEditQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useNavigate } from "react-router-dom";
import { PartnerStatus } from "@framework/constants/partner";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { PostcodeSchema } from "./partnerDetailsEdit.zod";

export const usePartnerDetailsEditQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<PartnerDetailsEditQuery>(
    partnerDetailsEditQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const partner = mapToPartnerDto(partnerNode, ["partnerStatus", "postcode", "postcodeStatus"], {});

  return {
    partner,
    fragmentRef: data.salesforce.uiapi,
  };
};

export type FormValues = {
  postcode: string;
  partnerStatus: PartnerStatus;
  form: FormTypes;
};

export const useOnUpdatePartnerDetails = (projectId: ProjectId, partnerId: PartnerId, navigateTo: string) => {
  const navigate = useNavigate();
  return useOnUpdate<z.output<PostcodeSchema>, boolean>({
    req: data =>
      clientsideApiClient.partners.updatePartnerPostcode({
        partnerId,
        projectId,
        partnerDto: data,
      }),
    onSuccess: () => navigate(navigateTo),
  });
};
