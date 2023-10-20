import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { BankCheckStatus } from "@framework/constants/partner";
import { useRoutes } from "@ui/redux/routesProvider";
import { FailedBankCheckConfirmationQuery } from "./__generated__/FailedBankCheckConfirmationQuery.graphql";
import { failedBankCheckConfirmationQuery } from "./FailedBankCheckConfirmation.query";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";

export const useFailedBankCheckConfirmationData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<FailedBankCheckConfirmationQuery>(
    failedBankCheckConfirmationQuery,
    { projectId },
    { fetchPolicy: "network-only" },
  );

  const project = mapToProjectDto(getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges ?? []).node, [
    "status",
  ]);

  return { fragmentRef: data?.salesforce?.uiapi, project };
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
