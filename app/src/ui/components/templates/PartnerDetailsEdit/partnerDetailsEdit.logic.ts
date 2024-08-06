import { useLazyLoadQuery } from "react-relay";
import { partnerDetailsEditQuery } from "./PartnerDetailsEdit.query";
import { PartnerDetailsEditQuery } from "./__generated__/PartnerDetailsEditQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { useOnMutation } from "@framework/api-helpers/onUpdate";
import { useNavigate } from "react-router-dom";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { partnerDetailsEditMutation } from "./PartnerDetailsEdit.mutation";
import { PartnerDetailsEditMutation } from "./__generated__/PartnerDetailsEditMutation.graphql";
import { noop } from "lodash";
import { z } from "zod";
import { PartnerDetailsEditSchema } from "./partnerDetailsEdit.zod";

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

export const useOnUpdatePartnerDetails = (partnerId: PartnerId, projectId: ProjectId, navigateTo: string) => {
  const navigate = useNavigate();

  return useOnMutation<PartnerDetailsEditMutation, z.infer<PartnerDetailsEditSchema>>(
    partnerDetailsEditMutation,
    data => ({ partnerId, postcode: data.postcode ?? "", projectId, partnerIdStr: partnerId }),
    () => navigate(navigateTo),
    noop,
  );
};
