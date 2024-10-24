import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";

// on Acc_CostCategory__C
type CostsSummaryForPeriodNode = GQL.PartialNode<{
  Id: GQL.Maybe<string>;
  Acc_OverrideAwardRate__c: GQL.Value<number>;
}>;

type CostsSummaryForPeriodMapping = CostsSummaryForPeriodDto & { overrideAwardRate: number };

const mapper: GQL.DtoMapper<
  CostsSummaryForPeriodMapping,
  CostsSummaryForPeriodNode,
  {
    forecastDetails?: { value: number; costCategoryId: CostCategoryId; periodId: PeriodId }[];
    claimDetails?: { value: number; costCategoryId: CostCategoryId; periodId: PeriodId }[];
    golCosts?: { value: number; costCategoryId: CostCategoryId }[];
    periodId?: PeriodId;
  }
> = {
  costCategoryId(node) {
    return (node?.Id ?? "") as CostCategoryId;
  },
  costsClaimedThisPeriod(node, additionalData) {
    return (
      additionalData?.claimDetails?.find(
        x => x?.costCategoryId === node?.Id && x?.periodId === additionalData?.periodId,
      )?.value ?? 0
    );
  },
  costsClaimedToDate(node, additionalData) {
    return (
      additionalData?.claimDetails
        ?.filter(x => x?.costCategoryId === node?.Id && x.periodId < (additionalData?.periodId ?? 0))
        .reduce((t, c) => t + c.value, 0) ?? 0
    );
  },
  forecastThisPeriod(node, additionalData) {
    return (
      additionalData?.forecastDetails?.find(
        x => (x?.costCategoryId === node?.Id && x.periodId === additionalData?.periodId) ?? 0,
      )?.value ?? 0
    );
  },
  offerTotal(node, additionalData) {
    return additionalData?.golCosts?.find(x => x.costCategoryId === node?.Id)?.value ?? 0;
  },
  overrideAwardRate(node) {
    return node?.Acc_OverrideAwardRate__c?.value ?? 0;
  },
  remainingOfferCosts(node, additionalData) {
    const offerTotal = this["offerTotal"](node, additionalData);
    const costsClaimedToDate = this["costsClaimedToDate"](node, additionalData);
    const costsClaimedThisPeriod = this["costsClaimedThisPeriod"](node, additionalData);
    return offerTotal - costsClaimedToDate - costsClaimedThisPeriod;
  },
};

type CostsSummaryAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [
    ["forecastThisPeriod", "forecastDetails", Pick<ForecastDetailsDTO, "costCategoryId" | "periodId" | "value">[]],
    ["costsClaimedThisPeriod", "claimDetails", Pick<ClaimDetailsDto, "costCategoryId" | "periodId" | "value">[]],
    ["costsClaimedThisPeriod", "periodId", PeriodId],
    ["costsClaimedToDate", "claimDetails", Pick<ClaimDetailsDto, "costCategoryId" | "periodId" | "value">[]],
    ["costsClaimedToDate", "periodId", PeriodId],
    ["offerTotal", "golCosts", Pick<GOLCostDto, "costCategoryId" | "value">[]],
    ["remainingOfferCosts", "forecastDetails", Pick<ForecastDetailsDTO, "costCategoryId" | "value">[]],
    ["remainingOfferCosts", "claimDetails", Pick<ClaimDetailsDto, "costCategoryId" | "periodId" | "value">[]],
    ["remainingOfferCosts", "periodId", PeriodId],
    ["remainingOfferCosts", "claimDetails", Pick<ClaimDetailsDto, "costCategoryId" | "periodId" | "value">[]],
    ["remainingOfferCosts", "periodId", PeriodId],
    ["remainingOfferCosts", "golCosts", Pick<GOLCostDto, "costCategoryId" | "value">[]],
  ]
>;

/**
 * Maps a specified CostSummaryForPeriod Node from a GQL query to
 * the CostSummaryForPeriodDto to ensure consistency and compatibility in the application
 */
export function mapToCostSummaryForPeriodDto<
  T extends CostsSummaryForPeriodNode,
  PickList extends keyof CostsSummaryForPeriodDto,
>(
  node: T,
  pickList: PickList[],
  additionalData: CostsSummaryAdditionalData<PickList>,
): Pick<CostsSummaryForPeriodDto, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<CostsSummaryForPeriodDto, PickList>,
  );
}

/**
 * Maps CostSummaryForPeriod Edge to array of CostSummaryForPeriod DTOs.
 */
export function mapToCostSummaryForPeriodDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: CostsSummaryForPeriodNode }>> | null,
  PickList extends keyof CostsSummaryForPeriodDto,
>(
  edges: T,
  pickList: PickList[],
  additionalData: CostsSummaryAdditionalData<PickList>,
): Pick<CostsSummaryForPeriodDto, PickList>[] {
  return (
    edges?.map(node => {
      return mapToCostSummaryForPeriodDto(node?.node ?? null, pickList, additionalData);
    }) ?? []
  );
}
