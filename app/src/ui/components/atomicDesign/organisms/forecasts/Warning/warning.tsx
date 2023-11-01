import { getAuthRoles } from "@framework/types/authorisation";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { AriaLive } from "../../../atoms/AriaLive/ariaLive";
import { ValidationMessage } from "../../../molecules/validation/ValidationMessage/ValidationMessage";
import { Content } from "../../../molecules/Content/content";
import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { UL } from "../../../atoms/List/list";

interface Props {
  project: Pick<ProjectDto, "id">;
  partner: Pick<PartnerDto, "id" | "roles">;
  claims: Pick<ClaimDto, "periodId">[];
  claimDetails: Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value">[];
  forecastDetails: Pick<ForecastDetailsDTO, "costCategoryId" | "periodId" | "value">[];
  golCosts: Pick<GOLCostDto, "value" | "costCategoryId">[];
  costCategories: Pick<CostCategoryDto, "id" | "name">[];
  editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
}

export const Warning = ({
  costCategories,
  claims,
  editor,
  forecastDetails,
  golCosts,
  claimDetails,
  partner,
}: Props) => {
  const forecasts = editor?.data || forecastDetails;
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
    forecasts.forEach(x => (total += x.costCategoryId === category.id && x.periodId > currentPeriod ? x.value : 0));

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

  const categoriesList = (
    <UL className="govuk-!-margin-top-4">
      {categories.map(x => (
        <li key={x}>{x.toLocaleLowerCase()}</li>
      ))}
    </UL>
  );

  const qaValue = isFc ? "forecasts-warning-fc" : "forecasts-warning-mo-pm";

  const warningContent = isFc ? (
    <>
      <Content value={x => x.components.warningContent.amountRequestMessage} />
      {categoriesList}
      <Content value={x => x.components.warningContent.contactMessage} />
    </>
  ) : (
    <>
      <Content value={x => x.components.warningContent.advisoryMoPmMessage} />
      {categoriesList}
    </>
  );

  return (
    <AriaLive>
      <ValidationMessage messageType="info" qa={qaValue} message={warningContent} />
    </AriaLive>
  );
};
