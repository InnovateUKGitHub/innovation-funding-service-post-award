import { DateTime } from "luxon";
import { ClaimStatus } from "@framework/constants";
import type { ClaimDto } from "@framework/dtos";
import { mapToClaimStatus, mapToClaimStatusLabel } from "@framework/mappers/claimStatus";
import { Clock, salesforceDateFormat } from "@framework/util";

const clock = new Clock();

type ClaimNode = Readonly<
  Partial<{
    Id: string;
    Acc_ApprovedDate__c: GQL.Value<string>;
    Acc_ClaimStatus__c: GQL.ValueAndLabel<string>;
    Acc_FinalClaim__c: GQL.Value<boolean>;
    Acc_PaidDate__c: GQL.Value<string>;
    Acc_ProjectParticipant__r: {
      Id: GQL.Maybe<string>;
    } | null;
    Acc_ProjectPeriodCost__c: GQL.Value<number>;
    Acc_ProjectPeriodEndDate__c: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    Acc_ProjectPeriodStartDate__c: GQL.Value<string>;
    LastModifiedDate: GQL.Value<string>;
    RecordType: {
      Name: GQL.Value<string>;
    } | null;
  }>
> | null;

type ClaimDtoMapping = Pick<
  ClaimDto,
  | "approvedDate"
  | "forecastCost"
  | "id"
  | "isApproved"
  | "isFinalClaim"
  | "lastModifiedDate"
  | "paidDate"
  | "partnerId"
  | "periodEndDate"
  | "periodId"
  | "periodStartDate"
  | "status"
  | "statusLabel"
  | "totalCost"
>;

const mapper: GQL.DtoMapper<
  ClaimDtoMapping,
  ClaimNode,
  { competitionType?: string; periodProfileDetails?: { forecastCost: number; partnerId: PartnerId }[] }
> = {
  approvedDate(node) {
    return node?.Acc_ApprovedDate__c?.value === null
      ? null
      : clock.parse(node?.Acc_ApprovedDate__c?.value, salesforceDateFormat);
  },
  forecastCost(node, additionalData) {
    return (
      additionalData.periodProfileDetails?.find(x => x.partnerId === node?.Acc_ProjectParticipant__r?.Id)
        ?.forecastCost ?? 0
    );
  },
  id(node) {
    return node?.Id ?? "";
  },
  isApproved(node) {
    const claimStatus = mapToClaimStatus(node?.Acc_ClaimStatus__c?.value ?? "unknown claim status");
    return [ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.PAYMENT_REQUESTED].indexOf(claimStatus) >= 0;
  },
  isFinalClaim(node) {
    return node?.Acc_FinalClaim__c?.value ?? false;
  },
  lastModifiedDate(node) {
    return DateTime.fromISO(node?.LastModifiedDate?.value ?? "").toJSDate();
  },
  paidDate(node) {
    return !!node?.Acc_PaidDate__c?.value ? clock.parse(node?.Acc_PaidDate__c?.value, salesforceDateFormat) : null;
  },
  partnerId(node) {
    return (node?.Acc_ProjectParticipant__r?.Id ?? "") as PartnerId;
  },
  periodEndDate(node) {
    return !!node?.Acc_ProjectPeriodEndDate__c?.value
      ? clock.parseRequiredSalesforceDate(node?.Acc_ProjectPeriodEndDate__c?.value)
      : new Date();
  },
  periodId(node) {
    return node?.Acc_ProjectPeriodNumber__c?.value ?? 0;
  },
  periodStartDate(node) {
    return !!node?.Acc_ProjectPeriodStartDate__c?.value
      ? clock.parseRequiredSalesforceDate(node?.Acc_ProjectPeriodStartDate__c?.value)
      : new Date();
  },
  status(node) {
    return mapToClaimStatus(node?.Acc_ClaimStatus__c?.value ?? "unknown claim status");
  },
  statusLabel(node, additionalData) {
    return mapToClaimStatusLabel(
      mapToClaimStatus(node?.Acc_ClaimStatus__c?.value ?? "unknown claim status"),
      node?.Acc_ClaimStatus__c?.label ?? "unknown",
      additionalData?.competitionType ?? "",
    );
  },
  totalCost(node) {
    return node?.Acc_ProjectPeriodCost__c?.value ?? 0;
  },
};

type ClaimsAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [
    ["forecastCost", "periodProfileDetails", { forecastCost: number; partnerId: PartnerId }[]],
    ["statusLabel", "competitionType", string],
  ]
>;

/**
 * Maps a specified claim Node from a GQL query to a slice of
 * the ClaimDto to ensure consistency and compatibility in the application
 */
export function mapToClaimDto<T extends ClaimNode, PickList extends keyof ClaimDtoMapping>(
  node: T,
  pickList: PickList[],
  additionalData: ClaimsAdditionalData<PickList>,
): Pick<ClaimDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node, additionalData);
    return dto;
  }, {} as Pick<ClaimDtoMapping, PickList>);
}

/**
 * Maps claim edges to array of Claim DTOs.
 */
export function mapToClaimDtoArray<
  T extends ReadonlyArray<{ node: ClaimNode } | null> | null,
  PickList extends keyof ClaimDtoMapping,
>(edges: T, pickList: PickList[], additionalData: ClaimsAdditionalData<PickList>): Pick<ClaimDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(
        x =>
          x?.node?.RecordType?.Name?.value === "Total Project Period" &&
          x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
          x?.node?.Acc_ClaimStatus__c?.value !== "Not used",
      )
      ?.map(x => {
        return mapToClaimDto(x?.node ?? null, pickList, additionalData);
      }) ?? []
  );
}
