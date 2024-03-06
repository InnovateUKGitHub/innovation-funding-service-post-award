import { useLazyLoadQuery } from "react-relay";
import { projectSetupQuery } from "./ProjectSetup.query";
import { ProjectSetupQuery } from "./__generated__/ProjectSetupQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { useNavigate } from "react-router-dom";
import { clientsideApiClient } from "@ui/apiClient";

export const useProjectSetupQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupQuery>(
    projectSetupQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "id", "status", "title", "projectSource"]);

  const partner = mapToPartnerDto(
    partnerNode,
    [
      "id",
      "partnerStatus",
      "bankDetailsTaskStatus",
      "bankCheckStatus",
      "spendProfileStatusLabel",
      "spendProfileStatus",
      "bankDetailsTaskStatusLabel",
      "postcode",
    ],
    {},
  );

  return { project, partner, fragmentRef: data.salesforce.uiapi };
};

export const useOnUpdateProjectSetup = (
  projectId: ProjectId,
  partnerId: PartnerId,
  partner: Pick<PartnerDto, "partnerStatus">,
  navigateTo: string,
) => {
  const navigate = useNavigate();
  return useOnUpdate<Pick<PartnerDto, "partnerStatus">, Pick<PartnerDto, "postcode">>({
    req: data =>
      clientsideApiClient.partners.updatePartner({
        partnerId,
        partnerDto: { ...partner, projectId, id: partnerId, ...data },
      }),
    onSuccess: () => navigate(navigateTo),
  });
};
