import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankDetailsQuery } from "./ProjectSetupBankDetails.query";
import { ProjectSetupBankDetailsQuery } from "./__generated__/ProjectSetupBankDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { useNavigate } from "react-router-dom";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/redux/routesProvider";
import { BankCheckStatus } from "@framework/constants/partner";

export type FormValues = {
  companyNumber: string;
  sortCode: string;
  accountNumber: string;
  accountBuilding: string;
  accountStreet: string;
  accountLocality: string;
  accountTownOrCity: string;
  accountPostcode: string;
};

export const useProjectSetupBankDetailsQuery = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupBankDetailsQuery>(
    projectSetupBankDetailsQuery,
    { projectId, partnerId },
    { fetchPolicy: "network-only" },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "id", "title"]);

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
  return { project, partner };
};

type BankCheckValidationError = {
  results: {
    bankCheckValidation: {
      isValid: boolean;
    };
  };
};

const isBankCheckValidationError = (e: unknown): e is BankCheckValidationError => {
  return (e as BankCheckValidationError)?.results?.bankCheckValidation?.isValid;
};

export const useOnUpdateProjectSetupBankDetails = (
  projectId: ProjectId,
  partnerId: PartnerId,
  partner: Pick<PartnerDto, "bankDetails" | "bankCheckRetryAttempts" | "id" | "projectId">,
) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<FormValues, { bankCheckStatus: BankCheckStatus }>({
    req: data =>
      clientsideApiClient.partners.updatePartner({
        partnerId,
        partnerDto: {
          ...partner,
          bankDetails: {
            accountNumber: data.accountNumber,
            address: {
              accountBuilding: data.accountBuilding,
              accountLocality: data.accountLocality,
              accountPostcode: data.accountPostcode,
              accountStreet: data.accountStreet,
              accountTownOrCity: data.accountTownOrCity,
            },
            companyNumber: data.companyNumber,
            firstName: null,
            lastName: null,
            sortCode: data.sortCode,
          },
        },
        validateBankDetails: true,
      }),
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
    onError: e => {
      if (isBankCheckValidationError(e)) {
        partner.bankCheckRetryAttempts += 1;
      }
    },
  });
};
