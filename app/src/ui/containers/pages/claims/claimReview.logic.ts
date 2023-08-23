import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimReviewQuery } from "./ClaimReview.query";
import { ClaimReviewQuery } from "./__generated__/ClaimReviewQuery.graphql";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { DocumentSummaryNode, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToCurrentClaimsDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ClaimDto } from "@framework/dtos/claimDto";
import { useContent } from "@ui/hooks/content.hook";
import { claimReviewSchema } from "./claimReview.zod";
import { z } from "zod";
import { Claims } from "@framework/constants/recordTypes";

type QueryOptions = RefreshedQueryOptions | { fetchPolicy: "network-only" };
export const useClaimReviewPageData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  periodId: PeriodId,
  queryOptions: QueryOptions = { fetchPolicy: "network-only" },
) => {
  const data = useLazyLoadQuery<ClaimReviewQuery>(
    claimReviewQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    queryOptions,
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);

  const documentsGql = data?.salesforce?.uiapi?.query?.ClaimsByPeriodForDocuments?.edges ?? [];

  const totalDocumentsLength = documentsGql.map(x => x?.node?.ContentDocumentLinks?.edges ?? []).flat().length ?? 0;

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, [
      "competitionName",
      "competitionType",
      "id",
      "partnerRoles",
      "roles",
      "impactManagementParticipation",
    ]);

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

    const costCategories = mapToRequiredSortedCostCategoryDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
      ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
      profileGql,
    );

    const claims = mapToCurrentClaimsDtoArray(
      data?.salesforce?.uiapi?.query?.AllClaimsForPartner?.edges ?? [],
      ["id", "isFinalClaim", "periodEndDate", "periodId", "periodStartDate", "partnerId", "status"],
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
            type: docs?.node?.RecordType?.DeveloperName?.value === Claims.claimsDetail ? "claim details" : "claims",
            partnerId,
            periodId,
            costCategoryId: docs?.node?.Acc_CostCategory__c?.value ?? "",
          },
        ),
      )
      .flat();

    const claim = claims.find(claim => claim.periodId === periodId);

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

    return {
      project,
      partner,
      costCategories,
      claim,
      claimDetails: costsSummaryForPeriod,
      documents,
      fragmentRef: data?.salesforce?.uiapi,
    };
  }, [totalDocumentsLength]);
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

/**
 *
 * @returns content for the review claims page
 */
export function useReviewContent() {
  const { getContent } = useContent();

  return {
    accordionTitleClaimLog: getContent(x => x.claimsLabels.accordionTitleClaimLog),
    accordionTitleForecast: getContent(x => x.claimsLabels.accordionTitleForecast),
    accordionTitleSupportingDocumentsForm: getContent(x => x.pages.claimReview.accordionTitleSupportingDocumentsForm),
    additionalInfo: getContent(x => x.pages.claimReview.additionalInfo),
    additionalInfoHint: getContent(x => x.pages.claimReview.additionalInfoHint),
    backLink: getContent(x => x.pages.claimReview.backLink),
    buttonSendQuery: getContent(x => x.pages.claimReview.buttonSendQuery),
    buttonSubmit: getContent(x => x.pages.claimReview.buttonSubmit),
    buttonUpload: getContent(x => x.pages.claimReview.buttonUpload),
    claimReviewDeclaration: getContent(x => x.pages.claimReview.claimReviewDeclaration),
    competitionName: getContent(x => x.projectLabels.competitionName),
    competitionType: getContent(x => x.projectLabels.competitionType),
    descriptionLabel: getContent(x => x.pages.claimDocuments.descriptionLabel),
    finalClaim: getContent(x => x.claimsMessages.finalClaim),
    labelInputUpload: getContent(x => x.pages.claimReview.labelInputUpload),
    monitoringReportReminder: getContent(x => x.pages.claimReview.monitoringReportReminder),
    noDocumentsUploaded: getContent(x => x.documentMessages.noDocumentsUploaded),
    noMatchingDocumentsMessage: getContent(x => x.pages.projectDocuments.noMatchingDocumentsMessage),
    optionQueryClaim: getContent(x => x.pages.claimReview.optionQueryClaim),
    optionSubmitClaim: getContent(x => x.pages.claimReview.optionSubmitClaim),
    searchDocumentsMessage: getContent(x => x.pages.projectDocuments.searchDocumentsMessage),
    sectionTitleAdditionalInfo: getContent(x => x.pages.claimReview.sectionTitleAdditionalInfo),
    sectionTitleHowToProceed: getContent(x => x.pages.claimReview.sectionTitleHowToProceed),
    uploadInstruction: getContent(x => x.documentMessages.uploadInstruction),
  };
}
