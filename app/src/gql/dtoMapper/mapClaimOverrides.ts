import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { Profile } from "@framework/constants/recordTypes";
import {
  CostCategoryClaimOverrideRate,
  PeriodClaimOverrideRate,
  CostCategoryClaimOverrideRates,
  PeriodClaimOverrideRates,
  NoClaimOverrideRates,
} from "@framework/dtos/claimOverrideRate";

// NAME costCategory type = "Total Cost Category"
// NAME period type = "Total Project Period"

// on Acc_Profile__c
type ClaimOverrideNode = GQL.PartialNode<{
  Id: string;
  RecordType: GQL.Maybe<{
    DeveloperName?: GQL.Value<string>;
  }>;
  Acc_OverrideAwardRate__c: GQL.Value<number>;
  Acc_CostCategoryName__c: GQL.Value<string>;
  Acc_CostCategory__c: GQL.Value<string>;
  Acc_CostCategory__r: GQL.Maybe<{
    Acc_CostCategoryName__c?: GQL.Value<string>;
  }>;
  Acc_ProjectParticipant__c: GQL.Value<string>;
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;

  // Same thing twice. Don't think about it.
  Acc_ProfileOverrideAwardRate__c: GQL.Value<number>;
  Acc_CostCategoryAwardOverride__c: GQL.Value<number>;
}>;

/**
 * Maps ClaimOverride Edge to array of ClaimOverride DTOs.
 */
export function mapToClaimOverrides<T extends ReadonlyArray<GQL.Maybe<{ node: ClaimOverrideNode }>> | null>(edges: T) {
  const allTotalCostCategory =
    edges?.filter(node => node?.node?.RecordType?.DeveloperName?.value === Profile.totalCostCategory) ?? [];
  const allTotalPeriod =
    edges?.filter(node => node?.node?.RecordType?.DeveloperName?.value === Profile.totalProjectPeriod) ?? [];

  const costCategoryOverrides: CostCategoryClaimOverrideRate[] = [];
  const periodOverrides: PeriodClaimOverrideRate[] = [];

  for (const totalCostCategory of allTotalCostCategory) {
    let foundOverride: CostCategoryClaimOverrideRate | undefined;

    if (typeof totalCostCategory?.node?.Acc_OverrideAwardRate__c?.value === "number") {
      foundOverride = {
        amount: totalCostCategory?.node?.Acc_OverrideAwardRate__c?.value,
        target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
        costCategoryId: (totalCostCategory?.node?.Acc_CostCategory__c?.value ?? "unknown") as CostCategoryId,
        costCategoryName: totalCostCategory?.node?.Acc_CostCategory__r?.Acc_CostCategoryName__c?.value ?? "unknown",
      };
    }

    if (typeof totalCostCategory?.node?.Acc_ProfileOverrideAwardRate__c?.value === "number") {
      foundOverride = {
        amount: totalCostCategory?.node?.Acc_ProfileOverrideAwardRate__c?.value,
        target: AwardRateOverrideTarget.THIS_PARTICIPANT,
        targetId: (totalCostCategory?.node?.Acc_ProjectParticipant__c?.value ?? "unknown") as PartnerId,
        costCategoryId: (totalCostCategory?.node?.Acc_CostCategory__c?.value ?? "unknown") as CostCategoryId,
        costCategoryName: totalCostCategory?.node?.Acc_CostCategory__r?.Acc_CostCategoryName__c?.value ?? "unknown",
      };
    }

    if (typeof totalCostCategory?.node?.Acc_CostCategoryAwardOverride__c?.value === "number") {
      foundOverride = {
        amount: totalCostCategory?.node?.Acc_CostCategoryAwardOverride__c?.value,
        target: AwardRateOverrideTarget.THIS_PARTICIPANT,
        costCategoryId: (totalCostCategory?.node?.Acc_CostCategory__c?.value ?? "unknown") as CostCategoryId,
        costCategoryName: totalCostCategory?.node?.Acc_CostCategory__r?.Acc_CostCategoryName__c?.value ?? "unknown",
      };
    }

    if (foundOverride) {
      costCategoryOverrides.push(foundOverride);
    }
  }

  for (const totalPeriod of allTotalPeriod) {
    let foundOverride: PeriodClaimOverrideRate | undefined;

    if (typeof totalPeriod?.node?.Acc_OverrideAwardRate__c?.value === "number") {
      foundOverride = {
        amount: totalPeriod?.node?.Acc_OverrideAwardRate__c?.value,
        target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
        period: (totalPeriod?.node?.Acc_ProjectPeriodNumber__c?.value ?? -1) as PeriodId,
      };
    }

    if (typeof totalPeriod?.node?.Acc_ProfileOverrideAwardRate__c?.value === "number") {
      foundOverride = {
        amount: totalPeriod?.node?.Acc_ProfileOverrideAwardRate__c?.value,
        target: AwardRateOverrideTarget.THIS_PARTICIPANT,
        period: (totalPeriod?.node?.Acc_ProjectPeriodNumber__c?.value ?? -1) as PeriodId,
      };
    }

    if (foundOverride) {
      periodOverrides.push(foundOverride);
    }
  }

  // If there are both overrides on cost categories, as well as periods, error out.
  if (costCategoryOverrides.length > 0 && periodOverrides.length > 0) {
    const badPeriods = periodOverrides.map(override => override.period).join(", ");
    const badCostCategories = costCategoryOverrides.map(override => override.costCategoryName).join(", ");
    throw new Error(
      `A project cannot have both Cost Category and Period based award rate overrides - Check periods ${badPeriods} and cost categories ${badCostCategories}`,
    );
  }

  // If there are only costCategoryOverrides...
  if (costCategoryOverrides.length > 0) {
    return {
      type: AwardRateOverrideType.BY_COST_CATEGORY,
      overrides: costCategoryOverrides,
    } as CostCategoryClaimOverrideRates;
  }

  // If there are only periodOverrides...
  if (periodOverrides.length > 0) {
    return {
      type: AwardRateOverrideType.BY_PERIOD,
      overrides: periodOverrides,
    } as PeriodClaimOverrideRates;
  }

  // If there are no overrides for this project...
  return {
    type: AwardRateOverrideType.NONE,
    overrides: [] as never[],
  } as NoClaimOverrideRates;
}
