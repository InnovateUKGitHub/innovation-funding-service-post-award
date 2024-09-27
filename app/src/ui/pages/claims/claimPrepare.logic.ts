import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimPrepareQuery } from "./ClaimPrepare.query";
import { ClaimPrepareQuery } from "./__generated__/ClaimPrepareQuery.graphql";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getPartnerRoles, mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { Claims } from "@framework/constants/recordTypes";
import { equalityIfDefined } from "@gql/dtoMapper/equalityIfDefined";

export const useClaimPreparePageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimPrepareQuery>(
    claimPrepareQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, [
      "roles",
      "partnerRoles",
      "id",
      "isNonFec",
      "competitionType",
      "status",
      "isActive",
    ]);

    const partner = mapToPartnerDto(
      partnerNode,
      [
        "id",
        "organisationType",
        "awardRate",
        "capLimitGrant",
        "totalGrantApproved",
        "roles",
        "isWithdrawn",
        "partnerStatus",
      ],
      { roles: getPartnerRoles(project.partnerRoles, partnerNode?.Id ?? "unknown") },
    );

    const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

    const costCategories = mapToRequiredSortedCostCategoryDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      ["id", "name", "displayOrder", "competitionType", "organisationType"],
      profileGql,
    );

    const claims = mapToCurrentClaimsDtoArray(
      claimsGql.filter(x => equalityIfDefined(x?.node?.RecordType?.DeveloperName?.value, Claims.totalProjectPeriod)),
      [
        "id",
        "periodId",
        "isFinalClaim",
        "periodEndDate",
        "periodStartDate",
        "grantPaidToDate",
        "periodCostsToBePaid",
        "status",
      ],
      {},
    );

    const costCategoriesOrder = costCategories.map(y => y.id);

    const golCosts = mapToGolCostDtoArray(profileGql, ["costCategoryId", "value"], costCategories).sort(
      (x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId),
    );

    const claim = claims.find(claim => claim.periodId === periodId);

    const claimDetailsAllPeriods = mapToClaimDetailsDtoArray(
      claimsGql?.filter(x => x?.node?.RecordType?.DeveloperName?.value === Claims.claimsDetail),
      ["costCategoryId", "periodId", "value", "grantPaidToDate"],
      {},
    );

    if (!claim) throw new Error("There is no matching claim");
    const forecastDetails = mapToForecastDetailsDtoArray(profileGql, ["costCategoryId", "value"]);

    const costsSummaryForPeriod = mapToCostSummaryForPeriodDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      [
        "costCategoryId",
        "costsClaimedThisPeriod",
        "costsClaimedToDate",
        "forecastThisPeriod",
        "offerTotal",
        "remainingOfferCosts",
      ],
      {
        claimDetails: claimDetailsAllPeriods,
        forecastDetails,
        periodId,
        golCosts,
      },
    );

    const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);

    return {
      project,
      partner,
      costCategories,
      claim,
      claimDetails: costsSummaryForPeriod,
      claimOverrides,
      fragmentRef: data?.salesforce?.uiapi,
    };
  }, []);
};
