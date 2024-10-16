import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapPcrItemDto, mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { pcrReallocateCostsQuery } from "./PcrReallocateCosts.query";
import { PcrReallocateCostsQuery } from "./__generated__/PcrReallocateCostsQuery.graphql";

interface UsePcrReallocateCostsDataProps {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  fetchKey?: number;
}
interface UsePcrPartnerReallocateCostsDataProps extends UsePcrReallocateCostsDataProps {
  partnerId: PartnerId;
}

const usePcrReallocateCostsData = ({ projectId, pcrId, itemId, fetchKey }: UsePcrReallocateCostsDataProps) => {
  const data = useLazyLoadQuery<PcrReallocateCostsQuery>(
    pcrReallocateCostsQuery,
    { projectId, pcrId, itemId },
    { fetchPolicy: "network-only", fetchKey },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges).node, [
    "isNonFec",
    "roles",
    "competitionType",
  ]);

  const partners = mapToPartnerDtoArray(
    data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges ?? [],
    ["id", "name", "isLead"],
    {},
  );

  const pcr = mapToPcrDto(
    {
      head: getFirstEdge(data.salesforce.uiapi.query.ParentPcr?.edges).node,
      children: [],
    },
    ["reasoningComments"],
    [],
    {},
  );

  const pcrItem = mapPcrItemDto(
    getFirstEdge(data.salesforce.uiapi.query.ChildPcr?.edges).node,
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
    pcr,
    pcrItem,
    financialVirementsForParticipants,
    financialVirementsForCosts,
    claimOverrideAwardRates,
    fragmentRef: data.salesforce.uiapi,
  };
};

const usePcrPartnerReallocateCostsData = (props: UsePcrPartnerReallocateCostsDataProps) => {
  const data = usePcrReallocateCostsData(props);

  return { ...data, partner: data.partners.find(x => x.id === props.partnerId)! };
};

export { usePcrReallocateCostsData, usePcrPartnerReallocateCostsData };
