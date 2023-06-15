import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimReviewQuery } from "./ClaimReview.query";
import { ClaimReviewQuery } from "./__generated__/ClaimReviewQuery.graphql";
import {
  DocumentSummaryNode,
  mapToClaimDetailsDtoArray,
  mapToClaimDtoArray,
  mapToClaimStatusChangeDtoArray,
  mapToForecastDetailsDtoArray,
  mapToGolCostDtoArray,
  mapToPartnerDto,
  mapToProjectDocumentSummaryDtoArray,
  mapToProjectDto,
  mapToRequiredSortedCostCategoryDtoArray,
} from "@gql/dtoMapper";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";

export const useClaimReviewPageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimReviewQuery>(
    claimReviewQuery,
    { projectId, projectIdStr: projectId, partnerId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, [
      "claimedPercentage",
      "claimFrequency",
      "claimFrequencyName",
      "claimsOverdue",
      "claimsToReview",
      "claimsWithParticipant",
      "competitionName",
      "competitionType",
      "costsClaimedToDate",
      "id",
      "impactManagementParticipation",
      "numberOfPeriods",
      "partnerRoles",
      "periodId",
      "projectNumber",
      "roles",
      "title",
    ]);

    const partner = mapToPartnerDto(
      partnerNode,
      ["id", "partnerStatus", "isWithdrawn", "isLead", "name", "roles", "organisationType", "overheadRate"],
      {
        roles: project.partnerRoles.find(x => x.partnerId === partnerNode?.Acc_AccountId__c?.value) ?? {
          isFc: false,
          isMo: false,
          isPm: false,
        },
      },
    );

    const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

    // COST CATEGORIES
    const costCategories = mapToRequiredSortedCostCategoryDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
      profileGql,
    );

    // CLAIMS
    const claims = mapToClaimDtoArray(
      claimsGql,
      [
        "comments",
        "id",
        "isApproved",
        "periodId",
        "isFinalClaim",
        "paidDate",
        "pcfStatus",
        "periodEndDate",
        "periodStartDate",
        "status",
        "statusLabel",
        "totalCostsSubmitted",
        "totalCostsApproved",
        "totalDeferredAmount",
        "periodCostsToBePaid",
      ],
      { competitionType: project.competitionType },
    );

    // GOL COSTS
    const costCategoriesOrder = costCategories.map(y => y.id);

    const golCosts = mapToGolCostDtoArray(
      profileGql,
      ["costCategoryId", "costCategoryName", "value"],
      costCategories,
    ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

    const documentsGql =
      (data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? []).find(
        x => x?.node?.Acc_ProjectPeriodNumber__c?.value === periodId,
      )?.node?.ContentDocumentLinks?.edges ?? [];

    const documents = mapToProjectDocumentSummaryDtoArray(
      documentsGql as DocumentSummaryNode[],
      ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner"],
      { projectId, currentUser: { email: data?.currentUser?.email ?? "unknown email" } },
    );

    const claim = claims.find(claim => claim.periodId === periodId);

    // CLAIM DETAILS
    const claimDetails = mapToClaimDetailsDtoArray(claimsGql, [
      "costCategoryId",
      "periodEnd",
      "periodStart",
      "periodId",
      "value",
    ]);

    if (!claim) throw new Error(" there is no matching claim");
    const forecastDetails = mapToForecastDetailsDtoArray(profileGql, [
      "id",
      "costCategoryId",
      "periodEnd",
      "periodStart",
      "periodId",
      "value",
    ]);

    const forecastData = {
      golCosts,
      forecastDetails,
      claimDetails,
      costCategories,
      project,
      partner,
      claim,
      claims,
    };

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

    return {
      project,
      partner,
      costCategories,
      claim,
      forecastData,
      claimDetails: costsSummaryForPeriod,
      statusChanges,
      documents,
    };
  }, []);
};
