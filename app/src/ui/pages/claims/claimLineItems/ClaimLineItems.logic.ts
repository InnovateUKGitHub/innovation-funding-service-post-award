import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import head from "lodash/head";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsWithLineItemsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { claimLineItemsQuery } from "./ClaimLineItems.query";
import { ClaimLineItemsQuery } from "./__generated__/ClaimLineItemsQuery.graphql";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { useRoutes } from "@ui/context/routesProvider";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { RouteState } from "@ui/app/containerBase";

export type ClaimLineItemsParams = {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: CostCategoryId;
  periodId: PeriodId;
};

export type ClaimLineItemMode = "prepare" | "review" | "details";

const getParams = (route: RouteState): ClaimLineItemsParams => ({
  projectId: route.params.projectId as ProjectId,
  partnerId: route.params.partnerId as PartnerId,
  costCategoryId: route.params.costCategoryId as CostCategoryId,
  periodId: parseInt(route.params.periodId, 10) as PeriodId,
});

const useClaimLineItemsData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  periodId: PeriodId,
  costCategoryId: CostCategoryId,
) => {
  const data = useLazyLoadQuery<ClaimLineItemsQuery>(
    claimLineItemsQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId, costCategoryId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(projectNode?.Acc_ProjectParticipantsProject__r?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  const project = mapToProjectDto(projectNode, ["id", "competitionType"]);

  const partner = mapToPartnerDto(partnerNode, ["id", "organisationType", "overheadRate"], {});
  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  const costCategories = mapToCostCategoryDtoArray(data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [], [
    "id",
    "name",
    "displayOrder",
    "type",
    "competitionType",
    "organisationType",
  ]);

  const currentCostCategory = costCategories.find(x => x.id === costCategoryId);
  if (!currentCostCategory) throw new Error("Could not find current cost cat");

  const documents = (data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [])
    .map(edge =>
      mapToProjectDocumentSummaryDtoArray(
        edge?.node?.ContentDocumentLinks?.edges ?? [],
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          type: "claim details",
          periodId,
          partnerId,
          costCategoryId,
        },
      ),
    )
    .flat();

  const claimsDetails = mapToClaimDetailsWithLineItemsDtoArray(
    claimsGql,
    ["isAuthor", "value", "comments"],
    ["id", "isAuthor", "lastModifiedDate", "value", "description"],
    { currentUser: Object.assign({}, { email: "unknown email", isSystemUser: false }, data?.currentUser) },
  );

  const claimDetails = head(claimsDetails) || {
    partnerId,
    costCategoryId,
    periodId,
    value: 0,
    comments: null,
    lineItems: [],
    isAuthor: false,
  };

  const forecastDetails = mapToForecastDetailsDtoArray(profileGql, ["value"]);

  const forecastDetail = head(forecastDetails) || {
    costCategoryId,
    periodId,
    value: 0,
  };

  const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);

  return {
    project,
    partner,
    claimDetails,
    forecastDetail,
    costCategories,
    currentCostCategory,
    documents,
    claimOverrides,
    fragmentRef: data.salesforce.uiapi,
  };
};

const useBackLink = (
  { partnerId, periodId, projectId }: Pick<ClaimLineItemsParams, "projectId" | "partnerId" | "periodId">,
  mode: ClaimLineItemMode,
) => {
  const routes = useRoutes();

  if (mode === "prepare") {
    return routes.prepareClaim.getLink({ projectId, partnerId, periodId });
  } else if (mode === "review") {
    return routes.reviewClaim.getLink({ projectId, periodId, partnerId });
  } else if (mode === "details") {
    return routes.claimDetails.getLink({ projectId, periodId, partnerId });
  }

  throw new Error(`Cannot generate backLink because an invalid ClaimLineItems mode "${mode}" was passed`);
};

export { getParams, useClaimLineItemsData, useBackLink };
