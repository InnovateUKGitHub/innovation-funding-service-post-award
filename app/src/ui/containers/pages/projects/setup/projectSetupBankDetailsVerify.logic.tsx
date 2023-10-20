import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankDetailsVerifyQuery } from "./ProjectSetupBankDetailsVerify.query";
import { ProjectSetupBankDetailsVerifyQuery } from "./__generated__/ProjectSetupBankDetailsVerifyQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { BankCheckStatus } from "@framework/constants/partner";
import { useRoutes } from "@ui/redux/routesProvider";

export const useSetupBankDetailsVerifyData = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupBankDetailsVerifyQuery>(
    projectSetupBankDetailsVerifyQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? []);

  const partner = mapToPartnerDto(partnerNode, ["bankDetails", "name", "id", "projectId"], {});

  return { fragmentRef: data?.salesforce?.uiapi, partner };
};

export const useOnUpdateSetupBankDetailsVerify = (
  projectId: ProjectId,
  partnerId: PartnerId,
  partnerDto: Pick<PartnerDto, "id" | "projectId">,
) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate({
    req: () =>
      clientsideApiClient.partners.updatePartner({
        partnerId,
        partnerDto,
        verifyBankDetails: true,
      }),
    onSuccess: (_, response) => {
      if (response.bankCheckStatus === BankCheckStatus.VerificationPassed) {
        navigate(
          routes.projectSetup.getLink({
            projectId,
            partnerId,
          }).path,
        );
      } else {
        navigate(
          routes.failedBankCheckConfirmation.getLink({
            projectId,
            partnerId,
          }).path,
        );
      }
    },
  });
};
