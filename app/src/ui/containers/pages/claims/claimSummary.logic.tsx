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
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToClaimDto } from "@gql/dtoMapper/mapClaimDto";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ClaimDto } from "@framework/dtos/claimDto";

import { getClaimSummarySchema } from "./claimSummary.zod";
import { z } from "zod";
import { useGetTotalCostsClaimed } from "@framework/mappers/totalCostsClaimed";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { ILinkInfo } from "@framework/types/ILinkInfo";

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
    "title",
    "projectNumber",
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
      "partnerId",
      "pcfStatus",
      "periodEndDate",
      "periodId",
      "periodStartDate",
      "isIarRequired",
      "comments",
      "totalCost",
      "status",
      "impactManagementParticipation",
      "impactManagementPhasedCompetition",
      "impactManagementPhasedCompetitionStage",
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
        docs?.node?.ContentDocumentLinks?.edges ?? [],
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          type: docs?.node?.RecordType?.Name?.value === "Claims Detail" ? "claim details" : "claims",
          partnerId,
          periodId,
          costCategoryId: docs?.node?.Acc_CostCategory__c?.value ?? "",
        },
      ),
    )
    .flat();

  const claimDetails = mapToClaimDetailsDtoArray(
    data?.salesforce?.uiapi?.query?.ClaimDetails?.edges ?? [],
    ["costCategoryId", "periodEnd", "periodStart", "periodId", "value"],
    {},
  );

  if (!claim) throw new Error("There is no matching claim");
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

  const totalCosts = useGetTotalCostsClaimed(data?.salesforce?.uiapi, project, partner, periodId);

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

const getNextStatus = (status: ClaimStatus, monitoringLevel: ProjectMonitoringLevel) => {
  switch (status) {
    case ClaimStatus.DRAFT:
    case ClaimStatus.MO_QUERIED:
      if (monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
        return ClaimStatus.AWAITING_IUK_APPROVAL;
      } else {
        return ClaimStatus.SUBMITTED;
      }

    case ClaimStatus.AWAITING_IAR:
    case ClaimStatus.INNOVATE_QUERIED:
      return ClaimStatus.AWAITING_IUK_APPROVAL;
    default:
      return status;
  }
};

export const useOnUpdateClaimSummary = (
  partnerId: PartnerId,
  projectId: ProjectId,
  periodId: PeriodId,
  navigateTo: string,
  claim: PickRequiredFromPartial<ClaimDto, "id" | "partnerId" | "status">,
  monitoringLevel: ProjectMonitoringLevel,
) => {
  const navigate = useNavigate();
  return useOnUpdate<
    z.output<ReturnType<typeof getClaimSummarySchema>>,
    Pick<ClaimDto, "status" | "comments" | "partnerId">,
    { updateLink: ILinkInfo }
  >({
    req(data) {
      let nextStatus = claim.status;
      if (data.button_submit === "submit") {
        nextStatus = getNextStatus(claim.status, monitoringLevel);
      }

      return clientsideApiClient.claims.update({
        partnerId,
        projectId,
        periodId,
        claim: { ...claim, ...data, status: nextStatus } as ClaimDto,
        isClaimSummary: true,
      });
    },
    onSuccess() {
      navigate(navigateTo);
    },
  });
};
