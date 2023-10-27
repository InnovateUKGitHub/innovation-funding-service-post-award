import { Profile } from "@framework/constants/recordTypes";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { Clock, salesforceDateFormat } from "@framework/util/clock";

const clock = new Clock();

type ForecastDetailsNode = GQL.PartialNode<{
  Id: string;
  Acc_CostCategory__c: GQL.Value<string>;
  Acc_LatestForecastCost__c: GQL.Value<number>;
  Acc_ProjectPeriodStartDate__c?: GQL.Value<string>;
  Acc_ProjectPeriodEndDate__c: GQL.Value<string>;
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;
  RecordType: GQL.Maybe<{
    DeveloperName: GQL.Value<string>;
  }>;
}>;

type ForecastDetailsDtoMapping = ForecastDetailsDTO;

const mapper: GQL.DtoMapper<ForecastDetailsDtoMapping, ForecastDetailsNode> = {
  id: function (node) {
    return node?.Id ?? "";
  },
  costCategoryId: function (node) {
    return (node?.Acc_CostCategory__c?.value ?? "unknown") as CostCategoryId;
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
  value: function (node) {
    return node?.Acc_LatestForecastCost__c?.value ?? 0;
  },
};

/**
 * Maps a specified ForecastDetails Node from a GQL query to a slice of
 * the ForecastDetailsDto to ensure consistency and compatibility in the application
 */
export function mapToForecastDetailsDto<
  T extends ForecastDetailsNode,
  PickList extends keyof ForecastDetailsDtoMapping,
>(node: T, pickList: PickList[]): Pick<ForecastDetailsDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<ForecastDetailsDtoMapping, PickList>);
}

/**
 * Maps ForecastDetails Edge to array of Loan DTOs.
 */
export function mapToForecastDetailsDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ForecastDetailsNode }>> | null,
  PickList extends keyof ForecastDetailsDtoMapping,
>(edges: T, pickList: PickList[]): Pick<ForecastDetailsDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(x => x?.node?.RecordType?.DeveloperName?.value === Profile.profileDetails)
      ?.map(node => {
        return mapToForecastDetailsDto(node?.node ?? null, pickList);
      }) ?? []
  );
}
