import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { projectSetupSpendProfileQuery } from "./ProjectSetupSpendProfile.query";
import { ProjectSetupSpendProfileQuery } from "./__generated__/ProjectSetupSpendProfileQuery.graphql";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToRequiredSortedCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToGolCostDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";

export const useSetupSpendProfileData = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ProjectSetupSpendProfileQuery>(
    projectSetupSpendProfileQuery,
    { projectId, partnerId, projectIdStr: projectId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);

  const project = mapToProjectDto(projectNode, [
    "competitionType",
    "numberOfPeriods",
    "periodId",
    "projectNumber",
    "title",
  ]);

  const partner = mapToPartnerDto(partnerNode, ["partnerStatus", "name", "organisationType", "overheadRate"], {});

  const golProfileGql = data?.salesforce?.uiapi?.query?.GolCostProfile?.edges ?? [];

  // COST CATEGORIES
  const costCategories = mapToRequiredSortedCostCategoryDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [],
    ["id", "name", "displayOrder", "isCalculated", "competitionType", "organisationType", "type"],
    golProfileGql,
  );

  // GOL COSTS
  const costCategoriesOrder = costCategories.map(y => y.id);

  const golCosts = mapToGolCostDtoArray(
    golProfileGql,
    ["costCategoryId", "costCategoryName", "value"],
    costCategories,
  ).sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

  const forecastDetails = mapToForecastDetailsDtoArray(data?.salesforce?.uiapi?.query?.ForecastDetails?.edges ?? [], [
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
    costCategories,
    project,
    partner,
    // project setup has no claims so far
    claim: null,
    claims: [],
    claimDetails: [],
  };

  return forecastData;
};
