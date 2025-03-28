import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankDetailsQuery } from "./ProjectSetupBankDetails.query";
import { ProjectSetupBankDetailsQuery } from "./__generated__/ProjectSetupBankDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { Propagation, useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useNavigate } from "react-router-dom";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/context/routesProvider";
import { BankCheckStatus } from "@framework/constants/partner";
import { ErrorCode } from "@framework/constants/enums";
import { BankCheckError } from "@shared/appError";
import { UseFormSetError } from "react-hook-form";
import { useContent } from "@ui/hooks/content.hook";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { ProjectSetupBankDetailsSchemaType } from "./projectSetupBankDetails.zod";
import { z } from "zod";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { useRef } from "react";

const isBankCheckError = (e: unknown): e is BankCheckError => {
  return typeof e === "object" && e !== null && "code" in e && e.code === ErrorCode.BANK_CHECK_ERROR;
};

export const useProjectSetupBankDetailsQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupBankDetailsQuery>(
    projectSetupBankDetailsQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partner = mapToPartnerDto(
    getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? []).node,
    [
      "id",
      "projectId",
      "name",
      "bankDetails",
      "bankCheckStatus",
      "bankCheckRetryAttempts",
      "bankDetailsTaskStatus",
      "bankDetailsTaskStatusLabel",
      "partnerStatus",
    ],
    {},
  );
  return { fragmentRef: data.salesforce.uiapi, partner };
};

export const useOnUpdateProjectSetupBankDetails = (
  projectId: ProjectId,
  partnerId: PartnerId,
  { setError }: { setError: UseFormSetError<z.output<ProjectSetupBankDetailsSchemaType>> },
) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const config = useClientConfig();
  const { getContent } = useContent();

  const bankCheckRetryAttempts = useRef(0);

  return useOnUpdate<z.output<ProjectSetupBankDetailsSchemaType>, { bankCheckStatus: BankCheckStatus }>({
    req: data => {
      return clientsideApiClient.partners.updatePartnerBankDetails({
        partnerId,
        projectId,
        partnerDto: data,
      });
    },

    onSuccess: (_, response) => {
      if (response.bankCheckStatus === BankCheckStatus.ValidationFailed) {
        navigate(
          routes.failedBankCheckConfirmation.getLink({
            projectId,
            partnerId,
          }).path,
        );
      } else {
        navigate(
          routes.projectSetupBankDetailsVerify.getLink({
            projectId,
            partnerId,
          }).path,
        );
      }
    },
    onError: (e: unknown) => {
      if (isBankCheckError(e)) {
        if (bankCheckRetryAttempts.current >= config.options.bankCheckValidationRetries) {
          navigate(
            routes.failedBankCheckConfirmation.getLink({
              projectId,
              partnerId,
            }).path,
          );

          return Propagation.STOP;
        }

        bankCheckRetryAttempts.current += 1;

        // Display the error message in React Hook Form

        setError("bankCheckValidation", {
          message: getContent(x => x.validation.partnerDtoValidator.bankChecksFailed),
          types: { deps: ["sortCode", "accountNumber"] },
        });
        scrollToTheTopSmoothly();
        // Stop the API Error box from appearing
        return Propagation.STOP;
      }
    },
  });
};
