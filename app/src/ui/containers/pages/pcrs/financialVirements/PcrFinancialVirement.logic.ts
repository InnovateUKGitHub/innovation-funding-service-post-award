import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { pcrFinancialVirementQuery } from "./PcrFinancialVirement.query";
import { PcrFinancialVirementQuery } from "./__generated__/PcrFinancialVirementQuery.graphql";

interface UsePcrFinancialVirementDataProps {
  projectId: ProjectId;
  itemId: PcrItemId;
  fetchKey?: number;
}
interface UsePcrPartnerFinancialVirementDataProps extends UsePcrFinancialVirementDataProps {
  partnerId: PartnerId;
}

const usePcrFinancialVirementData = ({ projectId, itemId, fetchKey }: UsePcrFinancialVirementDataProps) => {
  const data = useLazyLoadQuery<PcrFinancialVirementQuery>(
    pcrFinancialVirementQuery,
    { projectId, itemId },
    { fetchPolicy: "network-only", fetchKey },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges).node, [
    "title",
    "projectNumber",
    "isNonFec",
    "roles",
    "competitionType",
  ]);

  const partners = mapToPartnerDtoArray(
    data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges ?? [],
    ["id", "name", "isLead"],
    {},
  );

  const pcrItem = mapPcrItemDto(
    getFirstEdge(data.salesforce.uiapi.query.Acc_ProjectChangeRequest__c?.edges).node,
    ["status", "grantMovingOverFinancialYear"],
    {},
  );

  const claimOverrideAwardRates = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);

  const financialVirementsForParticipants = mapToFinancialVirementForParticipantDtoArray(
    data.salesforce.uiapi.query.Acc_VirementsForParticipant?.edges ?? [],
    ["id", "newEligibleCosts", "newFundingLevel", "newRemainingGrant", "originalFundingLevel", "partnerId"],
  );

  const financialVirementsForCosts = mapToFinancialVirementForCostsDtoArray(
    data.salesforce.uiapi.query.Acc_VirementsForCosts?.edges ?? [],
    [
      "id",
      "profileId",
      "parentId",
      "costCategoryId",
      "costCategoryName",
      "newEligibleCosts",
      "originalCostsClaimedToDate",
      "originalCostsClaimedToDate",
      "originalEligibleCosts",
    ],
  );

  return {
    project,
    partners,
    pcrItem,
    financialVirementsForParticipants,
    financialVirementsForCosts,
    claimOverrideAwardRates,
  };
};

const usePcrPartnerFinancialVirementData = (props: UsePcrPartnerFinancialVirementDataProps) => {
  const data = usePcrFinancialVirementData(props);

  return { ...data, partner: data.partners.find(x => x.id === props.partnerId)! };
};

export { usePcrFinancialVirementData, usePcrPartnerFinancialVirementData };
