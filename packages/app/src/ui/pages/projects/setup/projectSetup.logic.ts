import { useLazyLoadQuery } from "react-relay";
import { projectSetupQuery } from "./ProjectSetup.query";
import { ProjectSetupQuery } from "./__generated__/ProjectSetupQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useNavigate } from "react-router-dom";
import { clientsideApiClient } from "@ui/apiClient";
import { z } from "zod";
import { ProjectSetupSchema } from "./projectSetup.zod";

export const useProjectSetupQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupQuery>(
    projectSetupQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const project = mapToProjectDto(projectNode, ["projectSource"]);

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

export const useOnUpdateProjectSetup = (projectId: ProjectId, partnerId: PartnerId, navigateTo: string) => {
  const navigate = useNavigate();
  return useOnUpdate<z.output<ProjectSetupSchema>, boolean>({
    req: data =>
      clientsideApiClient.partners.updatePartnerProjectSetup({
        partnerId,
        projectId,
        partnerDto: data,
      }),
    onSuccess: () => navigate(navigateTo),
  });
};
