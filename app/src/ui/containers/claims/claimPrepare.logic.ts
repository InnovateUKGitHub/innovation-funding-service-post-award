import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimPrepareQuery } from "./ClaimPrepare.query";
import { ClaimPrepareQuery } from "./__generated__/ClaimPrepareQuery.graphql";
import {
  mapToClaimDetailsDtoArray,
  mapToClaimDtoArray,
  mapToClaimOverrides,
  mapToClaimStatusChangeDtoArray,
  mapToForecastDetailsDtoArray,
  mapToGolCostDtoArray,
  mapToPartnerDto,
  mapToProjectDto,
  mapToRequiredSortedCostCategoryDtoArray,
} from "@gql/dtoMapper";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";

export const useClaimPreparePageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimPrepareQuery>(
    claimPrepareQuery,
    { projectId, projectIdStr: projectId, partnerId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, [
      "roles",
      "id",
      "projectNumber",
      "title",
      "isNonFec",
      "competitionType",
    ]);

    const partner = mapToPartnerDto(partnerNode, ["id", "organisationType"], {});

    const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

    const costCategories = mapToRequiredSortedCostCategoryDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      ["id", "name", "displayOrder", "competitionType", "organisationType"],
      profileGql,
    );

    const claims = mapToClaimDtoArray(
      claimsGql.filter(x => x?.node?.RecordType?.Name?.value === "Total Project Period"),
      ["id", "periodId", "isFinalClaim", "periodEndDate", "periodStartDate"],
      {},
    );

    const costCategoriesOrder = costCategories.map(y => y.id);

    const golCosts = mapToGolCostDtoArray(profileGql, ["costCategoryId", "value"], costCategories).sort(
      (x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId),
    );

    const claim = claims.find(claim => claim.periodId === periodId);

    const claimDetails = mapToClaimDetailsDtoArray(
      claimsGql?.filter(
        x =>
          x?.node?.Acc_ProjectPeriodNumber__c?.value === periodId &&
          x?.node?.RecordType?.Name?.value === "Claims Detail",
      ),
      ["costCategoryId", "periodId", "value"],
    );

    if (!claim) throw new Error(" there is no matching claim");
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
        claimDetails,
        forecastDetails,
        periodId,
        golCosts,
      },
    );

    const statusChanges = mapToClaimStatusChangeDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_StatusChange__c?.edges ?? [],
      ["comments", "createdBy", "createdDate", "newStatusLabel"],
      { roles: project.roles, competitionType: project.competitionType },
    );

    const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);

    return {
      project,
      partner,
      costCategories,
      claim,
      claimDetails: costsSummaryForPeriod,
      statusChanges,
      claimOverrides,
    };
  }, []);
};
