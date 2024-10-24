import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { roundCurrency } from "@framework/util/numberHelper";
import { ForecastAgreedCostWarning } from "@ui/components/molecules/forecasts/ForecastAgreedCostWarning/ForecastAgreedCostWarning";
import { AriaLive } from "../../../atoms/AriaLive/ariaLive";

interface Props {
  project: Pick<ProjectDto, "id">;
  partner: Pick<PartnerDto, "id" | "roles">;
  claims: Pick<ClaimDto, "periodId">[];
  claimDetails: Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value">[];
  forecastDetails: Pick<ForecastDetailsDTO, "costCategoryId" | "periodId" | "value">[];
  golCosts: Pick<GOLCostDto, "value" | "costCategoryId">[];
  costCategories: Pick<CostCategoryDto, "id" | "name">[];
}

export const Warning = ({ costCategories, claims, forecastDetails, golCosts, claimDetails, partner }: Props) => {
  const currentPeriod = claims.reduce(
    (periodValue, { periodId }) => (periodId > periodValue ? periodId : periodValue),
    0,
  );

  // TODO: Refactor this to something more readable
  const categories: string[] = [];

  costCategories.forEach(category => {
    let total = 0;
    const gol = golCosts.find(x => x.costCategoryId === category.id);

    claimDetails.forEach(x => (total += x.costCategoryId === category.id && x.periodId <= currentPeriod ? x.value : 0));
    forecastDetails.forEach(
      x => (total += x.costCategoryId === category.id && x.periodId > currentPeriod ? x.value : 0),
    );

    total = roundCurrency(total);

    if (category.name === "Labour") {
      console.log({
        costCategory: category.name,
        costCategoryId: category.id,
        gol: gol?.value,
        total,
        push: gol && gol.value < total,
      });
    }

    if (gol && gol.value < total) {
      categories.push(category.name);
    }
  });

  if (!categories.length) return null;

  const { isFc } = getAuthRoles(partner.roles);

  return (
    <AriaLive>
      <ForecastAgreedCostWarning isFc={isFc} costCategories={categories} />
    </AriaLive>
  );
};
