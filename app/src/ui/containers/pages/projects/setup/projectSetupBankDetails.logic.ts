import { useLazyLoadQuery } from "react-relay";
import { projectSetupBankDetailsQuery } from "./ProjectSetupBankDetails.query";
import { ProjectSetupBankDetailsQuery } from "./__generated__/ProjectSetupBankDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { Propagation, useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { useNavigate } from "react-router-dom";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/redux/routesProvider";
import { BankCheckStatus } from "@framework/constants/partner";
import { ErrorCode } from "@framework/constants/enums";
import { ValidationError } from "@shared/appError";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { UseFormSetError } from "react-hook-form";
import { useContent } from "@ui/hooks/content.hook";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";

export type FormValues = {
  companyNumber: string;
  sortCode: string;
  accountDetails: undefined;
  accountNumber: string;
  accountBuilding: string;
  accountStreet: string;
  accountLocality: string;
  accountTownOrCity: string;
  accountPostcode: string;
};

const isPartnerDtoValidatorError = (e: unknown): e is ValidationError<PartnerDtoValidator> => {
  return typeof e === "object" && e !== null && "code" in e && e.code === ErrorCode.VALIDATION_ERROR;
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

export const useOnUpdateProjectSetupBankDetails = (
  projectId: ProjectId,
  partnerId: PartnerId,
  partner: Pick<PartnerDto, "bankDetails" | "bankCheckRetryAttempts" | "id" | "projectId">,
  { setError }: { setError: UseFormSetError<FormValues> },
) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const config = useClientConfig();
  const { getContent } = useContent();

  return useOnUpdate<FormValues, { bankCheckStatus: BankCheckStatus }>({
    req: data =>
      clientsideApiClient.partners.updatePartner({
        partnerId,
        partnerDto: {
          ...partner,
          projectId,
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
      if (isPartnerDtoValidatorError(e)) {
        // If we have a bank checking error...
        const bankCheckValidation = e.results?.bankCheckValidation;
        if (!bankCheckValidation?.isValid) {
          if (partner.bankCheckRetryAttempts >= config.options.bankCheckValidationRetries) {
            navigate(
              routes.failedBankCheckConfirmation.getLink({
                projectId,
                partnerId,
              }).path,
            );

            return Propagation.STOP;
          }

          partner.bankCheckRetryAttempts += 1;

          // Display the error message in React Hook Form
          const message = getContent(x => x.validation.partnerDtoValidator.bankChecksFailed);
          setError("accountDetails", { message, types: { deps: ["sortCode", "accountNumber"] } });

          // Stop the API Error box from appearing
          return Propagation.STOP;
        }
      }
    },
  });
};
