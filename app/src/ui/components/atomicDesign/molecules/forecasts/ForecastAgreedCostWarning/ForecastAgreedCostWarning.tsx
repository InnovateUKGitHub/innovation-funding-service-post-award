import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { Content } from "../../Content/content";
import { ValidationMessage } from "../../validation/ValidationMessage/ValidationMessage";

export interface ForecastAgreedCostWarningProps {
  isFc: boolean;
  costCategories: string[];
}

const CategoriesList = ({ costCategories }: { costCategories: string[] }) => (
  <UL className="govuk-!-margin-top-4">
    {costCategories.map(x => (
      <li key={x}>{x.toLocaleLowerCase()}</li>
    ))}
  </UL>
);

const ForecastAgreedCostWarning = ({ isFc, costCategories }: ForecastAgreedCostWarningProps) =>
  costCategories.length ? (
    <ValidationMessage
      messageType="info"
      qa={isFc ? "forecasts-warning-fc" : "forecasts-warning-mo-pm"}
      message={
        isFc ? (
          <>
            <Content value={x => x.components.warningContent.amountRequestMessage} />
            <CategoriesList costCategories={costCategories} />
            <Content value={x => x.components.warningContent.contactMessage} />
          </>
        ) : (
          <>
            <Content value={x => x.components.warningContent.advisoryMoPmMessage} />
            <CategoriesList costCategories={costCategories} />
          </>
        )
      }
    />
  ) : null;

export { ForecastAgreedCostWarning };
