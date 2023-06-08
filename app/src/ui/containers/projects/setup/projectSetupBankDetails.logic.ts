import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankDetailsQuery } from "./ProjectSetupBankDetails.query";
import { ProjectSetupBankDetailsQuery } from "./__generated__/ProjectSetupBankDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PartnerDto } from "@framework/dtos";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@ui/apiClient";

export const useProjectSetupBankDetailsQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<ProjectSetupBankDetailsQuery>(
    projectSetupBankDetailsQuery,
    { projectId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "id", "title"]);

  return { project };
};

export const useOnUpdateProjectSetupBankDetails = (
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
