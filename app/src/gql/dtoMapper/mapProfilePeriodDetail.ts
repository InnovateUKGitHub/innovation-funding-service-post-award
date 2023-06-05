// on Acc_Profile__c WHERE Acc_ProjectID__c=ProjectID AND RecordType.Name="Total Project Period"
type ProfilePeriodDetailsNode = Readonly<
  Partial<{
    Acc_PeriodLatestForecastCost__c: GQL.Value<number>;
    Acc_ProjectParticipant__c?: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
  }>
> | null;

type ProfilePeriodDetailsDtoMapping = { partnerId: PartnerId; forecastCost: number; periodId: number };

const mapper: GQL.DtoMapper<ProfilePeriodDetailsDtoMapping, ProfilePeriodDetailsNode> = {
  partnerId(node) {
    return (node?.Acc_ProjectParticipant__c?.value ?? "") as PartnerId;
  },
  forecastCost(node) {
    return node?.Acc_PeriodLatestForecastCost__c?.value ?? 0;
  },
  periodId(node) {
    return node?.Acc_ProjectPeriodNumber__c?.value ?? 0;
  },
};

/**
 * Maps a specified ProfilePeriodDetails Node from a GQL query to a slice of
 * the ProfilePeriodDetails to ensure consistency and compatibility in the application
 */
export function mapToProfilePeriodDetailsDto<
  T extends ProfilePeriodDetailsNode,
  PickList extends keyof ProfilePeriodDetailsDtoMapping,
>(node: T, pickList: PickList[]): Pick<ProfilePeriodDetailsDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<ProfilePeriodDetailsDtoMapping, PickList>);
}

/**
 * Maps ProfilePeriodDetails Edge to array of Loan DTOs.
 */
export function mapToProfilePeriodDetailsDtoArray<
  T extends ReadonlyArray<{ node: ProfilePeriodDetailsNode } | null> | null,
  PickList extends keyof ProfilePeriodDetailsDtoMapping,
>(edges: T, pickList: PickList[]): Pick<ProfilePeriodDetailsDtoMapping, PickList>[] {
  return (
    edges?.map(node => {
      return mapToProfilePeriodDetailsDto(node?.node ?? null, pickList);
    }) ?? []
  );
}
