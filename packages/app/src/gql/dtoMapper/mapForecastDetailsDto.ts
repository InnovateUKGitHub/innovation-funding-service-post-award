import { Profile } from "@framework/constants/recordTypes";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { Clock, salesforceDateFormat } from "@framework/util/clock";
import { equalityIfDefined } from "./equalityIfDefined";

const clock = new Clock();

type ForecastDetailsNode = GQL.PartialNode<{
  Id: string;
  Acc_CostCategory__c: GQL.Value<string>;
  Acc_CostCategory__r: {
    Id: string;
  } | null;
  Acc_InitialForecastCost__c: GQL.Value<number>;
  Acc_LatestForecastCost__c: GQL.Value<number>;
  Acc_ProjectPeriodStartDate__c?: GQL.Value<string>;
  Acc_ProjectPeriodEndDate__c: GQL.Value<string>;
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;
  RecordType: GQL.Maybe<{
    DeveloperName: GQL.Value<string>;
  }>;
}>;

type ForecastDetailsDtoMapping = ForecastDetailsDTO;

interface ForecastDetailsAdditionalData {
  isProjectSetup?: boolean;
}

const mapper: GQL.DtoMapper<ForecastDetailsDtoMapping, ForecastDetailsNode, ForecastDetailsAdditionalData> = {
  id: function (node) {
    return node?.Id ?? "";
  },
  costCategoryId: function (node) {
    return (node?.Acc_CostCategory__r?.Id ?? node?.Acc_CostCategory__c?.value ?? "unknown") as CostCategoryId;
  },
  periodId: function (node) {
    return (node?.Acc_ProjectPeriodNumber__c?.value ?? 0) as PeriodId;
  },
  periodStart: function (node) {
    return clock.parse(node?.Acc_ProjectPeriodStartDate__c?.value ?? null, salesforceDateFormat);
  },
  periodEnd: function (node) {
    return clock.parse(node?.Acc_ProjectPeriodEndDate__c?.value ?? null, salesforceDateFormat);
  },
  value: function (node, additionalData) {
    return (
      (additionalData.isProjectSetup
        ? node?.Acc_InitialForecastCost__c?.value
        : node?.Acc_LatestForecastCost__c?.value) ?? 0
    );
  },
};

/**
 * Maps a specified ForecastDetails Node from a GQL query to a slice of
 * the ForecastDetailsDto to ensure consistency and compatibility in the application
 */
export function mapToForecastDetailsDto<
  T extends ForecastDetailsNode,
  PickList extends keyof ForecastDetailsDtoMapping,
>(
  node: T,
  pickList: PickList[],
  additionalData = { isProjectSetup: false },
): Pick<ForecastDetailsDtoMapping, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<ForecastDetailsDtoMapping, PickList>,
  );
}

/**
 * Maps ForecastDetails Edge to array of Loan DTOs.
 */
export function mapToForecastDetailsDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ForecastDetailsNode }>> | null,
  PickList extends keyof ForecastDetailsDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  additionalData = { isProjectSetup: false },
): Pick<ForecastDetailsDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(x => equalityIfDefined(x?.node?.RecordType?.DeveloperName?.value, Profile.profileDetails))
      ?.map(node => {
        return mapToForecastDetailsDto(node?.node ?? null, pickList, additionalData);
      }) ?? []
  );
}
