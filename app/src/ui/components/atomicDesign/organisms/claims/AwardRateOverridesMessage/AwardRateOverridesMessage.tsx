import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { Content } from "../../../molecules/Content/content";
import { ValidationMessage } from "../../../molecules/validation/ValidationMessage/ValidationMessage";

export enum AwardRateOverrideLabel {
  CLAIM = "claim",
  PROJECT = "project",
}

const AwardRateOverridesMessage = ({
  claimOverrides,
  currentPeriod,
  currentCostCategoryId,
  isNonFec,
  overrideLabel = AwardRateOverrideLabel.CLAIM,
}: {
  claimOverrides?: ClaimOverrideRateDto;
  currentPeriod?: number;
  currentCostCategoryId?: string;
  isNonFec: boolean;
  overrideLabel?: AwardRateOverrideLabel;
}) => {
  const getIntroductionMessage = (type?: AwardRateOverrideType) => {
    switch (type) {
      case AwardRateOverrideType.BY_COST_CATEGORY:
        switch (overrideLabel) {
          case AwardRateOverrideLabel.PROJECT:
            return (
              <Content markdown value={x => x.components.awardRateOverridesMessage.costCategoryAwardRateOverride} />
            );
          case AwardRateOverrideLabel.CLAIM:
            return (
              <Content
                markdown
                value={x => x.components.awardRateOverridesMessage.claimCostCategoryAwardRateOverride}
              />
            );
        }
      case AwardRateOverrideType.BY_PERIOD:
        switch (overrideLabel) {
          case AwardRateOverrideLabel.PROJECT:
            return <Content markdown value={x => x.components.awardRateOverridesMessage.periodAwardRateOverride} />;
          case AwardRateOverrideLabel.CLAIM:
            return (
              <Content markdown value={x => x.components.awardRateOverridesMessage.claimPeriodAwardRateOverride} />
            );
        }
      default:
        return <Content markdown value={x => x.components.awardRateOverridesMessage.nonFec} />;
    }
  };

  const getOverrideList = (overrides: ClaimOverrideRateDto) => {
    switch (overrides.type) {
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
                    <Content value={x => x.components.awardRateOverridesMessage.currentCostCategoryPaidAt(override)} />
                  ) : (
                    <Content value={x => x.components.awardRateOverridesMessage.costCategoryPaidAt(override)} />
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
                    <Content value={x => x.components.awardRateOverridesMessage.currentPeriodPaidAt(override)} />
                  ) : (
                    <Content value={x => x.components.awardRateOverridesMessage.periodPaidAt(override)} />
                  )}
                </li>
              ))}
          </ul>
        );
      default:
        return null;
    }
  };

  const introMessage = getIntroductionMessage(claimOverrides?.type);

  // Only display message if we are non-FEC
  if (!isNonFec) return null;

  return (
    <ValidationMessage
      messageType="info"
      message={
        <>
          {introMessage}
          {claimOverrides && getOverrideList(claimOverrides)}
        </>
      }
    />
  );
};

export { AwardRateOverridesMessage };
