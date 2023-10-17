import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimSummaryQuery } from "./ClaimSummary.query";
import { ClaimSummaryQuery } from "./__generated__/ClaimSummaryQuery.graphql";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { DocumentSummaryNode, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToClaimDto } from "@gql/dtoMapper/mapClaimDto";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ClaimDto } from "@framework/dtos/claimDto";

import { claimReviewSchema } from "./claimReview.zod";
import { z } from "zod";
import { useGetTotalCostsClaimed } from "@framework/mappers/totalCostsClaimed";

type QueryOptions = RefreshedQueryOptions | { fetchPolicy: "network-only" };
export const useClaimSummaryData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  periodId: PeriodId,
  queryOptions: QueryOptions = { fetchPolicy: "network-only" },
) => {
  const data = useLazyLoadQuery<ClaimSummaryQuery>(
    claimSummaryQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    queryOptions,
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);

  const documentsGql = data?.salesforce?.uiapi?.query?.ClaimsByPeriodForDocuments?.edges ?? [];

  const project = mapToProjectDto(projectNode, [
    "id",
    "competitionType",
    "roles",
    "impactManagementParticipation",
    "isNonFec",
    "monitoringLevel",
  ]);

  const partner = mapToPartnerDto(
    partnerNode,
    ["id", "awardRate", "totalParticipantGrant", "totalFutureForecastsForParticipants", "totalParticipantCostsClaimed"],
    {},
  );

  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
    ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
    profileGql,
  );

  const claim = mapToClaimDto(
    getFirstEdge(data?.salesforce?.uiapi?.query?.ClaimForPartner?.edges ?? [])?.node,
    [
      "id",
      "isFinalClaim",
      "pcfStatus",
      "periodEndDate",
      "periodId",
      "periodStartDate",
      "isIarRequired",
      "comments",
      "totalCost",
      "status",
    ],
    {},
  );

  const costCategoriesOrder = costCategories.map(y => y.id);

  const golCosts = mapToGolCostDtoArray(
    profileGql,
    ["costCategoryId", "costCategoryName", "value"],
    costCategories,
  ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

  const documents = documentsGql
    .map(docs =>
      mapToProjectDocumentSummaryDtoArray(
        docs?.node?.ContentDocumentLinks?.edges ?? ([] as DocumentSummaryNode[]),
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          currentUser: { userId: data?.currentUser?.userId ?? null },
          type: docs?.node?.RecordType?.Name?.value === "Claims Detail" ? "claim details" : "claims",
          partnerId,
          periodId,
          costCategoryId: docs?.node?.Acc_CostCategory__c?.value ?? "",
        },
      ),
    )
    .flat();

  // const claim = claims.find(claim => claim.periodId === periodId);

  const claimDetails = mapToClaimDetailsDtoArray(
    data?.salesforce?.uiapi?.query?.ClaimDetails?.edges ?? [],
    ["costCategoryId", "periodEnd", "periodStart", "periodId", "value"],
    {},
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

  const totalCosts = useGetTotalCostsClaimed(data?.salesforce?.uiapi, periodId);

  return {
    project,
    partner,
    costCategories,
    claim,
    claimDetails: costsSummaryForPeriod,
    totalCosts,
    documents,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

export const useOnUpdateClaimReview = (
  partnerId: PartnerId,
  projectId: ProjectId,
  periodId: PeriodId,
  navigateTo: string,
  claim: PickRequiredFromPartial<ClaimDto, "id" | "partnerId">,
) => {
  const navigate = useNavigate();
  return useOnUpdate<z.output<typeof claimReviewSchema>, Pick<ClaimDto, "status" | "comments" | "partnerId">>({
    req(data) {
      return clientsideApiClient.claims.update({
        partnerId,
        projectId,
        periodId,
        claim: { ...claim, ...data } as ClaimDto,
      });
    },
    onSuccess() {
      navigate(navigateTo);
    },
  });
};
