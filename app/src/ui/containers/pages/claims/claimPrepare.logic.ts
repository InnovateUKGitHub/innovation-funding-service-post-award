import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimPrepareQuery } from "./ClaimPrepare.query";
import { ClaimPrepareQuery } from "./__generated__/ClaimPrepareQuery.graphql";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getPartnerRoles, mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { head } from "lodash";

export const useClaimPreparePageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimPrepareQuery>(
    claimPrepareQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, ["roles", "partnerRoles", "id", "isNonFec", "competitionType"]);

    const partner = mapToPartnerDto(
      partnerNode,
      ["capLimitGrant", "totalParticipantCostsClaimed", "roles", "isWithdrawn", "partnerStatus"],
      { roles: getPartnerRoles(project.partnerRoles, partnerNode?.Acc_AccountId__c?.value ?? "unknown") },
    );

    const claim = head(
      mapToClaimDtoArray(data?.salesforce?.uiapi?.query?.Claims?.edges ?? [], ["isFinalClaim", "status"], {}),
    );

    if (!claim) throw new Error(" there is no matching claim");

    const claimDetailsAllPeriods = mapToClaimDetailsDtoArray(
      data?.salesforce?.uiapi?.query?.ClaimDetails?.edges ?? [],
      ["costCategoryId", "periodId", "value", "grantPaidToDate"],
      {},
    );

    const costsSummaryForPeriod = mapToCostSummaryForPeriodDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      ["costsClaimedThisPeriod"],
      {
        claimDetails: claimDetailsAllPeriods,
        periodId,
      },
    );

    const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.ClaimOverrides?.edges ?? []);

    return {
      project,
      partner,
      claim,
      claimDetails: costsSummaryForPeriod,
      claimOverrides,
      fragmentRef: data?.salesforce?.uiapi,
    };
  }, []);
};
