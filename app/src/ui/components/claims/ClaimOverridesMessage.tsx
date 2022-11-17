import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { ClaimOverrideRateDto } from "@framework/dtos";
import { Content } from "../content";
import { ValidationMessage } from "../validationMessage";

const ClaimOverridesMessage = ({
  claimOverrides,
  currentPeriod,
  currentCostCategoryId,
}: {
  claimOverrides: ClaimOverrideRateDto;
  currentPeriod?: number;
  currentCostCategoryId?: string;
}) => {
  const getIntroductionMessage = (type: AwardRateOverrideType) => {
    switch (type) {
      case AwardRateOverrideType.BY_COST_CATEGORY:
        return <Content markdown value={x => x.components.claimOverridesMessage.costCategoryAwardRateOverride} />;
      case AwardRateOverrideType.BY_PERIOD:
        return <Content markdown value={x => x.components.claimOverridesMessage.periodAwardRateOverride} />;
      default:
        return null;
    }
  };

  const getOverrideList = (overrides: ClaimOverrideRateDto) => {
    switch (overrides.type) {
      // case AwardRateOverrideType.BY_COST_CATEGORY:
      //   return (
      //     <ul>
      //       {overrides.overrides.map(override => (
      //         <li key={override.costCategoryId}><Content value={x => x.components.claimOverridesMessage.periodPaidAt({ period: })} /></li>
      //       ))}
      //     </ul>
      //   );
      case AwardRateOverrideType.BY_COST_CATEGORY:
        return (
          <ul>
            {overrides.overrides
              .sort((a, b) => {
                // Bubble up the current cost category if it exists
                if (currentCostCategoryId === a.costCategoryId) return -1;
                if (currentCostCategoryId === b.costCategoryId) return 1;

                // Otherwise, sort by alphabetical order
                return a.costCategoryName.localeCompare(b.costCategoryName);
              })
              .map(override => (
                <li key={override.costCategoryId}>
                  {currentCostCategoryId === override.costCategoryId ? (
                    <Content value={x => x.components.claimOverridesMessage.currentCostCategoryPaidAt(override)} />
                  ) : (
                    <Content value={x => x.components.claimOverridesMessage.costCategoryPaidAt(override)} />
                  )}
                </li>
              ))}
          </ul>
        );
      case AwardRateOverrideType.BY_PERIOD:
        return (
          <ul>
            {overrides.overrides
              .sort((a, b) => a.period - b.period)
              .map(override => (
                <li key={override.period}>
                  {currentPeriod === override.period ? (
                    <Content value={x => x.components.claimOverridesMessage.currentPeriodPaidAt(override)} />
                  ) : (
                    <Content value={x => x.components.claimOverridesMessage.periodPaidAt(override)} />
                  )}
                </li>
              ))}
          </ul>
        );
      default:
        return null;
    }
  };

  const introMessage = getIntroductionMessage(claimOverrides.type);

  if (!introMessage) return null;

  return (
    <ValidationMessage
      messageType="info"
      message={
        <>
          {introMessage}
          {getOverrideList(claimOverrides)}
        </>
      }
    />
  );
};

export { ClaimOverridesMessage };
