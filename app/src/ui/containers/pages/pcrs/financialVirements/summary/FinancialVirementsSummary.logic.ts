import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { financialVirementsSummaryQuery } from "./FinancialVirementsSummary.query";
import { FinancialVirementsSummaryQuery } from "./__generated__/FinancialVirementsSummaryQuery.graphql";
import { useContent } from "@ui/hooks/content.hook";

interface FinancialVirementSummaryDataProps {
  projectId: ProjectId;
  itemId: PcrItemId;
}

const useFinancialVirementsSummaryData = ({ projectId, itemId }: FinancialVirementSummaryDataProps) => {
  const data = useLazyLoadQuery<FinancialVirementsSummaryQuery>(
    financialVirementsSummaryQuery,
    { projectId, itemId },
    { fetchPolicy: "network-only" },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges).node, ["isNonFec"]);

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

  return { project, partners, pcrItem, financialVirementsForParticipants, financialVirementsForCosts };
};

const useGrantMessage = ({
  hasAvailableGrant,
  hasMatchingGrant,
  originalRemainingGrant,
  grantDifference: newGrantDifference,
}: {
  hasMatchingGrant: boolean;
  hasAvailableGrant: boolean;
  originalRemainingGrant: number;
  grantDifference: number;
}): string | undefined => {
  const { getContent } = useContent();

  // Note: bail out if there is no difference
  if (hasMatchingGrant) return undefined;

  if (hasAvailableGrant) {
    return getContent(x => x.pages.financialVirementSummary.availableGrantMessage({ difference: newGrantDifference }));
  }

  return getContent(x =>
    x.pages.financialVirementSummary.unavailableGrantMessage({
      difference: newGrantDifference,
      total: originalRemainingGrant,
    }),
  );
};

export { useFinancialVirementsSummaryData, useGrantMessage };
