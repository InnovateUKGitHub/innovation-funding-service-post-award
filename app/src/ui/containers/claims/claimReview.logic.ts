import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimReviewQuery } from "./ClaimReview.query";
import { ClaimReviewQuery } from "./__generated__/ClaimReviewQuery.graphql";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { DocumentSummaryNode, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToClaimStatusChangeDtoArray } from "@gql/dtoMapper/mapClaimStatusChange";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";

export const useClaimReviewPageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimReviewQuery>(
    claimReviewQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
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

    const costCategories = mapToRequiredSortedCostCategoryDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
      profileGql,
    );

    const claims = mapToClaimDtoArray(
      claimsGql.filter(x => x?.node?.RecordType?.Name?.value === "Total Project Period"),
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

    const costCategoriesOrder = costCategories.map(y => y.id);

    const golCosts = mapToGolCostDtoArray(
      profileGql,
      ["costCategoryId", "costCategoryName", "value"],
      costCategories,
    ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

    const documentsGql = (data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [])
      .filter(x => x?.node?.Acc_ProjectPeriodNumber__c?.value === periodId)
      .map(x => x?.node?.ContentDocumentLinks?.edges ?? [])
      .flat();

    const documents = mapToProjectDocumentSummaryDtoArray(
      documentsGql as DocumentSummaryNode[],
      ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
      { projectId, currentUser: { email: data?.currentUser?.email ?? "unknown email" } },
    );

    const claim = claims.find(claim => claim.periodId === periodId);

    const claimDetails = mapToClaimDetailsDtoArray(
      claimsGql?.filter(
        x =>
          x?.node?.Acc_ProjectPeriodNumber__c?.value === periodId &&
          x?.node?.RecordType?.Name?.value === "Claims Detail",
      ),
      ["costCategoryId", "periodEnd", "periodStart", "periodId", "value"],
    );

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
