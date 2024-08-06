import { useLazyLoadQuery, useMutation } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { PcrItemWorkflowQuery } from "./__generated__/PcrItemWorkflowQuery.graphql";
import { pcrItemWorkflowQuery } from "./PcrItemWorkflow.query";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { useNavigate } from "react-router-dom";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { useState } from "react";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { useMessageContext } from "@ui/context/messages";
import { PCRItemStatus, PCRItemType, pcrItemTypes, PCRPartnerType } from "@framework/constants/pcrConstants";
import { mapFromPCRItemStatus, mapToSalesforcePCRPartnerType, PcrContactRoleMapper } from "@framework/mappers/pcr";
import { Clock } from "@framework/util/clock";
import { PcrParticipantSizeMapper } from "@framework/mappers/participantSize";
import { PCRProjectLocationMapper } from "@framework/mappers/projectLocation";
import { PcrProjectRoleMapper } from "@framework/mappers/pcr";
import { PcrItemUpdateMutation } from "./__generated__/PcrItemUpdateMutation.graphql";
import { pcrItemUpdateMutation } from "./PcrItemUpdate.mutation";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { GraphqlError, isGraphqlError } from "@framework/types/IAppError";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";

const clock = new Clock();

export const usePcrItemWorkflowQuery = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcrItemId: PcrItemId,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<PcrItemWorkflowQuery>(
    pcrItemWorkflowQuery,
    { projectId, pcrId, pcrItemId },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["status", "typeOfAid", "isActive"]);

  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "id",
      "type",
      "projectRole",
      "partnerType",
      "isCommercialWork",
      "typeOfAid",
      "organisationType",
      "hasOtherFunding",
      "guidance",
      "status",
      "typeName",
    ],
    { typeOfAid: project.typeOfAid },
  );

  return { project, pcrItem, fragmentRef: data?.salesforce?.uiapi };
};

const createItemMutationPayload = (pcrItemId: PcrItemId, data: Partial<FullPCRItemDto>) => ({
  Id: pcrItemId,
  Acc_ProjectChangeRequest__c: {
    ...("accountName" in data ? { Acc_NewOrganisationName__c: data.accountName } : {}),
    ...("awardRate" in data ? { Acc_AwardRate__c: data.awardRate } : {}),
    ...("contact1Email" in data ? { Acc_Contact1EmailAddress__c: data.contact1Email } : {}),
    ...("contact1Forename" in data ? { Acc_Contact1Forename__c: data.contact1Forename } : {}),
    ...("contact1Phone" in data ? { Acc_Contact1Phone__c: data.contact1Phone } : {}),
    ...("contact1Surname" in data ? { Acc_Contact1Surname__c: data.contact1Surname } : {}),
    ...("contact1ProjectRole" in data
      ? {
          Acc_Contact1ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(
            data.contact1ProjectRole,
          ),
        }
      : {}),
    ...("contact2Email" in data ? { Acc_Contact2EmailAddress__c: data.contact2Email } : {}),
    ...("contact2Forename" in data ? { Acc_Contact2Forename__c: data.contact2Forename } : {}),
    ...("contact2Phone" in data ? { Acc_Contact2Phone__c: data.contact2Phone } : {}),
    ...("contact2Surname" in data ? { Acc_Contact2Surname__c: data.contact2Surname } : {}),
    ...("contact2ProjectRole" in data
      ? {
          Acc_Contact2ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(
            data.contact2ProjectRole,
          ),
        }
      : {}),
    ...("financialYearEndDate" in data
      ? { Acc_TurnoverYearEnd__c: clock.formatOptionalSalesforceDate(data.financialYearEndDate) }
      : {}),
    ...("financialYearEndTurnover" in data ? { Acc_Turnover__c: data.financialYearEndTurnover } : {}),
    ...("hasOtherFunding" in data ? { Acc_OtherFunding__c: data.hasOtherFunding } : {}),
    ...("grantMovingOverFinancialYear" in data
      ? { Acc_GrantMovingOverFinancialYear__c: data.grantMovingOverFinancialYear }
      : {}),
    ...("isCommercialWork" in data ? { Acc_CommercialWork__c: data.isCommercialWork } : {}),
    ...("numberOfEmployees" in data ? { Acc_Employees__c: data.numberOfEmployees } : {}),
    ...("offsetMonths" in data ? { Acc_AdditionalNumberofMonths__c: data.offsetMonths } : {}),
    ...("organisationName" in data ? { Acc_OrganisationName__c: data.organisationName } : {}),
    // ...("organisationType" in data
    //   ? { Acc_ParticipantType__c: mapToSalesforcePCRPartnerType(data.organisationType) }
    //   : {}), /// ???
    ...("participantSize" in data
      ? {
          Acc_ParticipantSize__c: new PcrParticipantSizeMapper().mapToSalesforcePCRParticipantSize(
            data.participantSize,
          ),
        }
      : {}),
    ...("partnerType" in data
      ? { Acc_ParticipantSize__c: mapToSalesforcePCRPartnerType(data.partnerType ?? PCRPartnerType.Unknown) }
      : {}),
    ...("projectCity" in data ? { Acc_ProjectCity__c: data.projectCity } : {}),
    ...("projectLocation" in data
      ? { Acc_Location__c: new PCRProjectLocationMapper().mapToSalesforcePCRProjectLocation(data.projectLocation) }
      : {}),
    ...("projectPostcode" in data ? { Acc_ProjectPostcode__c: data.projectPostcode } : {}),
    ...("projectRole" in data
      ? { Acc_ProjectRole__c: new PcrProjectRoleMapper().mapToSalesforcePCRProjectRole(data.projectRole) }
      : {}),
    ...("projectStartDate" in data
      ? { Loan_ProjectStartDate__c: clock.formatOptionalSalesforceDate(data.projectStartDate) }
      : {}),
    ...("projectSummary" in data ? { Acc_NewProjectSummary__c: data.projectSummary } : {}),
    ...("publicDescription" in data ? { Acc_NewPublicDescription__c: data.publicDescription } : {}),
    ...("registeredAddress" in data ? { Acc_RegisteredAddress__c: data.registeredAddress } : {}),
    ...("registrationNumber" in data ? { Acc_RegistrationNumber__c: data.registrationNumber } : {}),
    ...("reasoningComments" in data ? { Acc_Reasoning__c: data.reasoningComments } : {}),
    ...("removalPeriod" in data ? { Acc_RemovalPeriod__c: data.removalPeriod } : {}),
    ...("repaymentPeriod" in data ? { Loan_RepaymentPeriod__c: data.repaymentPeriod } : {}),
    ...("repaymentPeriodChange" in data ? { Loan_RepaymentPeriodChange__c: data.repaymentPeriodChange } : {}), // ????
    ...("requestNumber" in data ? { Acc_RequestNumber__c: data.requestNumber } : {}),
    ...("status" in data ? { Acc_MarkedasComplete__c: mapFromPCRItemStatus(data.status) } : {}),
    ...("suspensionEndDate" in data
      ? { Acc_SuspensionEnds__c: clock.formatOptionalSalesforceDate(data.suspensionEndDate) }
      : {}),
    ...("suspensionStartDate" in data
      ? { Acc_SuspensionStarts__c: clock.formatOptionalSalesforceDate(data.suspensionStartDate) }
      : {}),
    ...("tsbReference" in data ? { Acc_TSBReference__c: data.tsbReference } : {}),
    ...("subcontractorName" in data ? { New_company_subcontractor_name__c: data.subcontractorName } : {}),
    ...("subcontractorRegistrationNumber" in data
      ? { Company_registration_number__c: data.subcontractorRegistrationNumber }
      : {}),
    ...("subcontractorRelationship" in data
      ? { Relationship_between_partners__c: data.subcontractorRelationship }
      : {}),
    ...("subcontractorRelationshipJustification" in data
      ? { Relationship_justification__c: data.subcontractorRelationshipJustification }
      : {}),
    ...("subcontractorLocation" in data
      ? { Country_where_work_will_be_carried_out__c: data.subcontractorLocation }
      : {}),
    ...("subcontractorDescription" in data ? { Role_in_the_project__c: data.subcontractorDescription } : {}),
    ...("subcontractorCost" in data ? { Cost_of_work__c: data.subcontractorCost } : {}),
    ...("subcontractorJustification" in data ? { Justification__c: data.subcontractorJustification } : {}),
  },
});

export const useOnSavePcrItem = ({
  pcrItemId,
  step,
  pcrType,
  projectId,
  onSuccess: onSuccessProp,
}: {
  pcrItemId: PcrItemId;
  pcrType: PCRItemType;
  projectId: ProjectId;
  step: number | undefined;
  onSuccess?: () => void;
}) => {
  const navigate = useNavigate();

  const [, setFetchKey] = useFetchKey();
  const { clearMessages } = useMessageContext();

  const [commitMutation, isMutationInProgress] = useMutation<PcrItemUpdateMutation>(pcrItemUpdateMutation);

  const [apiError, setApiError] = useState<GraphqlError | null>(null);

  return {
    onUpdate: ({
      data,
      context,
      onSuccess: onSuccessData,
    }: {
      data: Partial<FullPCRItemDto>;
      onSuccess?: () => void;
      context: { link: { path: string } };
    }) => {
      const input = createItemMutationPayload(pcrItemId, {
        ...data,
        type: pcrType,
        ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
      });
      commitMutation({
        variables: { input, projectId },
        onError: (er: unknown) => {
          console.log("err", er);
          if (isGraphqlError(er)) {
            console.log("isgrapqhlerrpr");
            useScrollToTopSmoothly([]);
            setApiError(er);
          }
        },
        onCompleted: () => {
          if (!!onSuccessProp) {
            onSuccessProp();
          }
          if (!!onSuccessData) {
            onSuccessData();
          }
          clearMessages();
          setFetchKey(k => k + 1);
          navigate(context?.link?.path ?? "");
        },
      });
    },
    isFetching: isMutationInProgress,
    apiError,
  };
};

export const getDisplayName = (typeName: string) => {
  const matchedItemType = pcrItemTypes.find(x => x.typeName === typeName);

  if (matchedItemType && "displayName" in matchedItemType && typeof matchedItemType.displayName === "string") {
    return matchedItemType.displayName;
  } else {
    return typeName;
  }
};
