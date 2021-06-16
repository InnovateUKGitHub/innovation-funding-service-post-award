import {
  ClaimDetailsSummaryDto,
  ClaimDto,
  ForecastDetailsDTO,
  GOLCostDto,
  PartnerDto,
  ProjectDto,
} from "@framework/dtos";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { getAuthRoles } from "@framework/types";
import { IEditorStore } from "@ui/redux";
import { ForecastDetailsDtosValidator } from "@ui/validators";

import { Content, UL, ValidationMessage } from "@ui/components";
import { AriaLive } from "@ui/components/renderers";

interface Props {
  project: ProjectDto;
  partner: PartnerDto;
  claims: ClaimDto[];
  claimDetails: ClaimDetailsSummaryDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
  editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
}

export const Warning = (props: Props) => <AriaLive>{renderWarningMessage(props)}</AriaLive>;

const renderWarningMessage = ({
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
      <Content value={x => x.components.warningContent.contactmessage} />
    </>
  ) : (
    <>
      <Content value={x => x.components.warningContent.advisoryMoPmMessage} />
      {categoriesList}
    </>
  );

  return <ValidationMessage messageType="info" qa={qaValue} message={warningContent} />;
};
