import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { getIARDueOnClaimPeriods } from "@gql/dtoMapper/mapIarDue";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { updateForecastQuery } from "./UpdateForecast.query";
import { UpdateForecastQuery, UpdateForecastQuery$data } from "./__generated__/UpdateForecastQuery.graphql";

export type Project = Pick<
  ProjectDtoGql,
  "id" | "projectNumber" | "title" | "periodId" | "numberOfPeriods" | "competitionType" | "roles" | "isActive"
>;

export type Partner = Pick<
  PartnerDtoGql,
  "id" | "name" | "partnerStatus" | "overheadRate" | "organisationType" | "roles" | "forecastLastModifiedDate"
>;

type Claim = Pick<ClaimDto, "id" | "isApproved" | "periodId" | "isFinalClaim" | "paidDate">;
type ClaimDetails = Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value" | "periodEnd" | "periodStart">;
type CostCategory = Pick<
  CostCategoryDto,
  "id" | "competitionType" | "name" | "isCalculated" | "organisationType" | "type"
>;

type ProjectGQL = GQL.NodeSelector<UpdateForecastQuery$data, "Acc_Project__c">;
type PartnerGql = GQL.NodeSelector<ProjectGQL, "Acc_ProjectParticipantsProject__r">;

export type Data = {
  project: Project;
  partner: Partner;
  claims: Claim[];
  claim: Claim | null; // currently active claim (not yet approved)
  claimDetails: ClaimDetails[];
  costCategories: CostCategory[];
  golCosts: GOLCostDto[];
  forecastDetails: ForecastDetailsDTO[];
  IARDueOnClaimPeriods: string[];
};

const defaultRole = { isPm: false, isMo: false, isFc: false };

export const useUpdateForecastData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  refreshedQueryOptions: { fetchKey: number; fetchPolicy: "store-only" } | undefined,
): Data => {
  const data = useLazyLoadQuery<UpdateForecastQuery>(
    updateForecastQuery,
    {
      projectId,
      projectIdStr: projectId,
      partnerId,
    },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge<PartnerGql>(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];
  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  // PARTNER ROLES
  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  // PROJECT
  const project = mapToProjectDto(projectNode, [
    "id",
    "isActive",
    "projectNumber",
    "title",
    "roles",
    "periodId",
    "numberOfPeriods",
    "competitionType",
  ]);

  // PARTNER
  const partner = mapToPartnerDto(
    partnerNode,
    ["id", "name", "partnerStatus", "overheadRate", "organisationType", "roles", "forecastLastModifiedDate"],
    { roles: partnerRoles.find(x => x.partnerId === partnerNode?.Acc_AccountId__c?.value ?? "unknown") ?? defaultRole },
  );

  // CLAIMS
  const claims = mapToClaimDtoArray(claimsGql, ["id", "isApproved", "periodId", "isFinalClaim", "paidDate"], {});

  // COST CATEGORIES
  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
    ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
    profileGql,
  );

  // GOL COSTS
  const costCategoriesOrder = costCategories.map(y => y.id);

  const golCosts = mapToGolCostDtoArray(
    profileGql,
    ["costCategoryId", "costCategoryName", "value"],
    costCategories,
  ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

  // FORECAST DETAILS
  const forecastDetails = mapToForecastDetailsDtoArray(profileGql, [
    "id",
    "costCategoryId",
    "periodEnd",
    "periodStart",
    "periodId",
    "value",
  ]);

  // IAR DUE ON CLAIM PERIODS
  const IARDueOnClaimPeriods = getIARDueOnClaimPeriods(claimsGql);

  // ACTIVE CLAIM
  const claim = claims.find(claim => !claim.isApproved) || null;

  // CLAIM DETAILS
  const claimDetails = mapToClaimDetailsDtoArray(
    claimsGql,
    ["costCategoryId", "periodEnd", "periodStart", "periodId", "value"],
    {},
  );

  return {
    project,
    partner,
    claims,
    claim,
    claimDetails,
    costCategories,
    golCosts,
    forecastDetails,
    IARDueOnClaimPeriods,
  };
};
