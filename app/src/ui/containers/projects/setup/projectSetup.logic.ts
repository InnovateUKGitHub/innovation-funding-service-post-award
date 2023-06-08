import { useLazyLoadQuery } from "react-relay";
import { projectSetupQuery } from "./ProjectSetup.query";
import { ProjectSetupQuery } from "./__generated__/ProjectSetupQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto, mapToProjectDto } from "@gql/dtoMapper";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PartnerDto } from "@framework/dtos";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@ui/apiClient";

export const useProjectSetupQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupQuery>(
    projectSetupQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "id", "status", "title"]);

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

  return { project, partner };
};

export const useOnUpdateProjectSetup = (
  projectId: ProjectId,
  partnerId: PartnerId,
  partner: Pick<PartnerDto, "partnerStatus">,
  navigateTo: string,
) => {
  const navigate = useNavigate();
  return useOnUpdate<Pick<PartnerDto, "partnerStatus">, Promise<Pick<PartnerDto, "postcode">>>({
    req: data =>
      apiClient.partners.updatePartner({
        partnerId,
        partnerDto: { ...partner, ...data },
      }),
    onSuccess: () => navigate(navigateTo),
  });
};
