import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimDetailsQuery } from "./ClaimDetails.query";
import { ClaimDetailsQuery } from "./__generated__/ClaimDetailsQuery.graphql";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { DocumentSummaryNode, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";

export const useClaimDetailsPageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimDetailsQuery>(
    claimDetailsQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, ["competitionType", "id", "partnerRoles", "roles"]);

    const partner = mapToPartnerDto(
      partnerNode,
      ["id", "partnerStatus", "isWithdrawn", "isLead", "name", "roles", "organisationType", "overheadRate"],
      {
        roles: project.partnerRoles.find(x => x.partnerId === partnerNode?.Id) ?? {
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
      claimsGql.filter(x => x?.node?.RecordType?.Name?.value === "Total Project Period"),
      [
        "comments",
        "id",
        "isApproved",
        "periodId",
        "isFinalClaim",
        "periodEndDate",
        "periodStartDate",
        "status",
        "totalCostsSubmitted",
        "totalCostsApproved",
        "totalDeferredAmount",
        "periodCostsToBePaid",
      ],
      {},
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
      {
        projectId,
        currentUser: { userId: data.currentUser.userId },
        type: "claims",
        partnerId,
        periodId,
      },
    );

    const claim = claims.find(claim => claim.periodId === periodId);

    if (!claim) throw new Error(" there is no matching claim");
    const forecastDetails = mapToForecastDetailsDtoArray(profileGql, [
      "id",
      "costCategoryId",
      "periodEnd",
      "periodStart",
      "periodId",
      "value",
    ]);

    const claimDetailsAllPeriods = mapToClaimDetailsDtoArray(
      claimsGql?.filter(x => x?.node?.RecordType?.Name?.value === "Claims Detail"),
      ["costCategoryId", "periodId", "value"],
      {},
    );

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

    return {
      project,
      partner,
      costCategories,
      claim,
      claimDetails: costsSummaryForPeriod,
      documents,
      fragmentRef: data?.salesforce?.uiapi,
    };
  }, []);
};
