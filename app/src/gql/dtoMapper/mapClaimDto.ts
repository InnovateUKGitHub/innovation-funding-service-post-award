import { DateTime } from "luxon";
import { mapToClaimStatus, mapToClaimStatusLabel } from "@framework/mappers/claimStatus";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ReceivedStatus } from "@framework/entities/received-status";
import { Clock, salesforceDateFormat } from "@framework/util/clock";

const clock = new Clock();

const mapToReceivedStatus = (status: string): ReceivedStatus => {
  if (!status?.length) return ReceivedStatus.Unknown;

  const allowedStatuses: ReceivedStatus[] = [ReceivedStatus.Received, ReceivedStatus.NotReceived];
  // Note: Preform positive check as it "could" finish sooner
  const hasMatchingStatus = allowedStatuses.some(statusToCheck => statusToCheck === status);

  if (!hasMatchingStatus) return ReceivedStatus.Unknown;

  return status as ReceivedStatus;
};

/**
 * On Acc_Claims__c
 */

type ClaimNode = Readonly<
  Partial<{
    Id: string;
    Acc_ApprovedDate__c: GQL.Value<string>;
    Acc_ClaimStatus__c: GQL.ValueAndLabel<string>;
    Acc_FinalClaim__c: GQL.Value<boolean>;
    Acc_OverheadRate__c: GQL.Value<number>;
    Acc_PaidDate__c: GQL.Value<string>;
    Acc_PCF_Status__c: GQL.Value<string>;
    Acc_PeriodCoststobePaid__c: GQL.Value<number>;
    Acc_ProjectParticipant__r: {
      Id: GQL.Maybe<string>;
    } | null;
    Acc_ProjectParticipant__c: GQL.Value<string>;
    Acc_ProjectPeriodCost__c: GQL.Value<number>;
    Acc_ProjectPeriodEndDate__c: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    Acc_ProjectPeriodStartDate__c: GQL.Value<string>;
    Acc_ReasonForDifference__c: GQL.Value<string>;
    Acc_TotalDeferredAmount__c: GQL.Value<number>;
    Acc_TotalCostsApproved__c: GQL.Value<number>;
    Acc_TotalCostsSubmitted__c: GQL.Value<number>;
    LastModifiedDate: GQL.Value<string>;
    Impact_Management_Participation__c: GQL.Value<string>;
    Acc_Grant_Paid_To_Date__c: GQL.Value<number>;
    Acc_IARRequired__c: GQL.Value<boolean>;
    RecordType: {
      Name: GQL.Value<string>;
    } | null;
  }>
> | null;

type ClaimDtoMapping = Pick<
  ClaimDto,
  | "approvedDate"
  | "comments"
  | "forecastCost"
  | "grantPaidToDate"
  | "id"
  | "isApproved"
  | "isFinalClaim"
  | "isIarRequired"
  | "lastModifiedDate"
  | "overheadRate"
  | "paidDate"
  | "partnerId"
  | "pcfStatus"
  | "periodCostsToBePaid"
  | "periodEndDate"
  | "periodId"
  | "periodStartDate"
  | "status"
  | "statusLabel"
  | "totalCost"
  | "impactManagementParticipation"
  | "totalCostsSubmitted"
  | "totalCostsApproved"
  | "totalDeferredAmount"
>;

const mapper: GQL.DtoMapper<
  ClaimDtoMapping,
  ClaimNode,
  {
    competitionType?: string;
    periodProfileDetails?: { forecastCost: number; partnerId: PartnerId; periodId: number }[];
  }
> = {
  approvedDate(node) {
    return node?.Acc_ApprovedDate__c?.value === null
      ? null
      : clock.parse(node?.Acc_ApprovedDate__c?.value, salesforceDateFormat);
  },
  comments(node) {
    return node?.Acc_ReasonForDifference__c?.value ?? "";
  },

  forecastCost(node, additionalData) {
    /*
     * need to obtain the forecast cost from periodProfileDetails mapping,
     * matching the participant id and period id
     */
    return (
      additionalData.periodProfileDetails?.find(
        x =>
          x.partnerId === node?.Acc_ProjectParticipant__r?.Id && x.periodId === node?.Acc_ProjectPeriodNumber__c?.value,
      )?.forecastCost ?? 0
    );
  },
  grantPaidToDate(node) {
    return node?.Acc_Grant_Paid_To_Date__c?.value ?? 0;
  },
  id(node) {
    return node?.Id ?? "";
  },
  impactManagementParticipation(node) {
    return mapImpactManagementParticipationToEnum(node?.Impact_Management_Participation__c?.value);
  },
  isApproved(node) {
    const claimStatus = mapToClaimStatus(node?.Acc_ClaimStatus__c?.value ?? "unknown claim status");
    return [ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.PAYMENT_REQUESTED].indexOf(claimStatus) >= 0;
  },
  isFinalClaim(node) {
    return node?.Acc_FinalClaim__c?.value ?? false;
  },
  isIarRequired(node) {
    return node?.Acc_IARRequired__c?.value ?? false;
  },
  lastModifiedDate(node) {
    return DateTime.fromISO(node?.LastModifiedDate?.value ?? "").toJSDate();
  },
  overheadRate(node) {
    return node?.Acc_OverheadRate__c?.value ?? 0;
  },
  paidDate(node) {
    return !!node?.Acc_PaidDate__c?.value ? clock.parse(node?.Acc_PaidDate__c?.value, salesforceDateFormat) : null;
  },
  partnerId(node) {
    return (node?.Acc_ProjectParticipant__r?.Id ??
      node?.Acc_ProjectParticipant__c?.value ??
      "unknown-partner-id") as PartnerId;
  },
  pcfStatus(node) {
    return mapToReceivedStatus(node?.Acc_PCF_Status__c?.value ?? "");
  },
  periodCostsToBePaid(node) {
    return node?.Acc_PeriodCoststobePaid__c?.value ?? 0;
  },
  periodEndDate(node) {
    return !!node?.Acc_ProjectPeriodEndDate__c?.value
      ? clock.parseRequiredSalesforceDate(node?.Acc_ProjectPeriodEndDate__c?.value)
      : new Date(NaN);
  },
  periodId(node) {
    return (node?.Acc_ProjectPeriodNumber__c?.value ?? 0) as PeriodId;
  },
  periodStartDate(node) {
    return !!node?.Acc_ProjectPeriodStartDate__c?.value
      ? clock.parseRequiredSalesforceDate(node?.Acc_ProjectPeriodStartDate__c?.value)
      : new Date(NaN);
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
  totalCostsSubmitted(node) {
    return node?.Acc_TotalCostsSubmitted__c?.value ?? 0;
  },
  totalCostsApproved(node) {
    return node?.Acc_TotalCostsApproved__c?.value ?? 0;
  },
  totalDeferredAmount(node) {
    return node?.Acc_TotalDeferredAmount__c?.value ?? 0;
  },
};

type ClaimsAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [
    ["forecastCost", "periodProfileDetails", { forecastCost: number; partnerId: PartnerId; periodId: number }[]],
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
