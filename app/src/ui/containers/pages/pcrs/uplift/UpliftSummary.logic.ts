import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { upliftSummaryQuery } from "./UpliftSummary.query";
import { UpliftSummaryQuery } from "./__generated__/UpliftSummaryQuery.graphql";

const useUpliftSummaryQuery = ({
  projectId,
  pcrId,
  pcrItemId,
}: {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
}) => {
  const data = useLazyLoadQuery<UpliftSummaryQuery>(upliftSummaryQuery, {
    projectId,
    pcrId,
    pcrItemId,
  });

  const { node: pcrNode } = getFirstEdge(data?.salesforce.uiapi.query.Header?.edges ?? []);
  const { node: pcrItemNode } = getFirstEdge(data?.salesforce.uiapi.query.Child?.edges ?? []);

  const pcr = mapToPcrDto(
    {
      head: pcrNode,
      children: [pcrItemNode],
    },
    ["requestNumber"],
    ["upliftJustification"],
    {},
  );
  const pcrItemCount = pcrNode?.Acc_Project_Change_Requests__r?.totalCount ?? 0;

  const partners = mapToPartnerDtoArray(
    data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges ?? [],
    ["id", "name", "isLead"],
    {},
  );

  const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);

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
      "newEligibleCosts",
      "originalCostsClaimedToDate",
      "originalCostsClaimedToDate",
      "originalEligibleCosts",
    ],
    {
      overrides: claimOverrides,
    },
  );

  return { pcr, pcrItemCount, partners, financialVirementsForCosts, financialVirementsForParticipants };
};

export { useUpliftSummaryQuery };
