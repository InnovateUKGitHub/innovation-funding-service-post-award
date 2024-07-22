import { ForecastTableDto } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { ValidationMessage } from "../../validation/ValidationMessage/ValidationMessage";

const ForecastHiddenCostWarning = ({ costCategories }: { costCategories: ForecastTableDto["costCategories"] }) => {
  const badCostCategories = costCategories.filter(x => x.isInvalidCostCategory);

  if (badCostCategories.length === 0) return null;

  return (
    <ValidationMessage
      markdown
      messageType="error"
      message={x => x.components.warningContent.forecastHiddenClaimWarning}
    />
  );
};

export { ForecastHiddenCostWarning };
