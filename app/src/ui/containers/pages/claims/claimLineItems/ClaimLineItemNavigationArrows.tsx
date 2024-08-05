import { ProjectDto } from "@framework/dtos/projectDto";
import { ClaimLineItemsParams, ClaimLineItemsRoute, ReviewClaimLineItemsRoute } from "./ViewClaimLineItems.page";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { NavigationArrows } from "@ui/components/atomicDesign/molecules/NavigationArrows/navigationArrows";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ClaimLineItemMode } from "./ClaimLineItems.logic";
import { useClientConfig } from "@ui/context/ClientConfigProvider";

interface ClaimLineItemNavigationArrowsCommonProps {
  costCategories: Pick<CostCategoryDto, "id" | "competitionType" | "organisationType" | "name">[];
  project: Pick<ProjectDto, "id" | "competitionType">;
  partner: Pick<PartnerDto, "id" | "organisationType" | "overheadRate">;
  params: ClaimLineItemsParams;
}

interface ClaimLineItemNavigationArrowsProps extends ClaimLineItemNavigationArrowsCommonProps {
  mode: ClaimLineItemMode;
}

interface ClaimLineItemNavigationArrowsLinkGeneratorProps extends ClaimLineItemNavigationArrowsCommonProps {
  standardOverheadRate: number;
  overheadRate: number;
  page: { getLink: (params: ClaimLineItemsParams) => ILinkInfo };
}

const ClaimLineItemNavigationArrows = ({
  costCategories,
  project,
  partner,
  mode,
  params,
}: ClaimLineItemNavigationArrowsProps) => {
  const route = mode === "review" ? ReviewClaimLineItemsRoute : ClaimLineItemsRoute;
  const { standardOverheadRate } = useClientConfig().options;

  const navigationLinks = getLinks({
    costCategories,
    project,
    partner,
    params,
    standardOverheadRate,
    overheadRate: partner.overheadRate ?? 0,
    page: route,
  });

  if (navigationLinks === null) return null;

  return navigationLinks ? <NavigationArrows {...navigationLinks} /> : null;
};

const filterOverheads = (costCategoryName: string, overheadRate: number, standardOverheadRate: number): boolean => {
  return !(costCategoryName === "Overheads" && overheadRate <= standardOverheadRate);
};

const getLinks = ({
  costCategories,
  overheadRate,
  page,
  params,
  partner,
  project,
  standardOverheadRate,
}: ClaimLineItemNavigationArrowsLinkGeneratorProps) => {
  const periodId = params.periodId;
  const costCategoriesToUse = costCategories
    .filter(x => x.competitionType === project.competitionType && x.organisationType === partner.organisationType)
    .filter(x => filterOverheads(x.name, overheadRate, standardOverheadRate));

  const currentCostCategory = costCategoriesToUse.find(x => x.id === params.costCategoryId);
  if (currentCostCategory === undefined) return null;

  const currentPosition = costCategoriesToUse.indexOf(currentCostCategory);
  let nextCostCategory = null;
  let previousCostCategory = null;

  if (currentPosition !== costCategoriesToUse.length - 1) {
    nextCostCategory = costCategoriesToUse[currentPosition + 1];
  }
  if (currentPosition !== 0) {
    previousCostCategory = costCategoriesToUse[currentPosition - 1];
  }

  const createCostCategoryLink = (costCategory: Pick<CostCategoryDto, "name" | "id"> | null) =>
    costCategory
      ? {
          label: costCategory.name,
          route: page.getLink({
            partnerId: partner.id,
            projectId: project.id,
            periodId,
            costCategoryId: costCategory.id,
          }),
        }
      : null;

  const previousLink = createCostCategoryLink(previousCostCategory);
  const nextLink = createCostCategoryLink(nextCostCategory);

  return {
    previousLink,
    nextLink,
  };
};

export { ClaimLineItemNavigationArrows };
