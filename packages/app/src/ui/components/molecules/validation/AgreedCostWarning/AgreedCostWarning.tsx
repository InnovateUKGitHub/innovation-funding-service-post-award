import { useContent } from "@ui/hooks/content.hook";
import { ValidationListMessage } from "../ValidationListMessage/ValidationListMessage";

export interface ForecastAgreedCostWarningProps {
  isFc: boolean;
  costCategories: string[];
}

const ClaimAgreedCostWarning = ({ isFc, costCategories }: ForecastAgreedCostWarningProps) => {
  const { getContent } = useContent();

  return (
    <ValidationListMessage
      qa={isFc ? "claims-warning-fc" : "claims-warning-mo-pm"}
      before={
        isFc
          ? getContent(x => x.pages.claimsComponents.negativeCategoriesMessage.before)
          : getContent(x => x.components.warningContent.advisoryMoPmMessage)
      }
      items={costCategories}
      after={isFc ? getContent(x => x.pages.claimsComponents.negativeCategoriesMessage.after) : undefined}
    />
  );
};

const ForecastAgreedCostWarning = ({ isFc, costCategories }: ForecastAgreedCostWarningProps) => {
  const { getContent } = useContent();

  return (
    <ValidationListMessage
      qa={isFc ? "forecasts-warning-fc" : "forecasts-warning-mo-pm"}
      before={
        isFc
          ? getContent(x => x.components.warningContent.amountRequestMessage)
          : getContent(x => x.components.warningContent.advisoryMoPmMessage)
      }
      items={costCategories}
      after={isFc ? getContent(x => x.components.warningContent.contactMessage) : undefined}
    />
  );
};

export { ClaimAgreedCostWarning, ForecastAgreedCostWarning };
