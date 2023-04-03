import { ClaimStatus } from "@framework/constants";
import type { ClaimDto } from "@framework/dtos";
import { mapToClaimStatus } from "@framework/mappers/claimStatus";
import { Clock, salesforceDateFormat } from "@framework/util";

const clock = new Clock();

type ClaimNode = Readonly<
  Partial<{
    Id: string;
    Acc_ClaimStatus__c: GQL.Value<string>;
    Acc_FinalClaim__c: GQL.Value<boolean>;
    Acc_PaidDate__c: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    RecordType: {
      Name: GQL.Value<string>;
    } | null;
  }>
> | null;

type ClaimDtoMapping = Pick<ClaimDto, "id" | "isApproved" | "periodId" | "isFinalClaim" | "paidDate">;

const mapper: GQL.DtoMapper<ClaimDtoMapping, ClaimNode> = {
  id: function (node) {
    return node?.Id ?? "";
  },
  isApproved: function (node) {
    const claimStatus = mapToClaimStatus(node?.Acc_ClaimStatus__c?.value ?? "unknown claim status");
    return [ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.PAYMENT_REQUESTED].indexOf(claimStatus) >= 0;
  },
  isFinalClaim: function (node) {
    return node?.Acc_FinalClaim__c?.value ?? false;
  },

  paidDate: function (node) {
    return !!node?.Acc_PaidDate__c?.value ? clock.parse(node?.Acc_PaidDate__c?.value, salesforceDateFormat) : null;
  },
  periodId: function (node) {
    return node?.Acc_ProjectPeriodNumber__c?.value ?? 0;
  },
};

/**
 * Maps a specified claim Node from a GQL query to a slice of
 * the ClaimDto to ensure consistency and compatibility in the application
 */
export function mapToClaimDto<T extends ClaimNode, PickList extends keyof ClaimDtoMapping>(
  node: T,
  pickList: PickList[],
): Pick<ClaimDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<ClaimDtoMapping, PickList>);
}

/**
 * Maps claim edges to array of Claim DTOs.
 */
export function mapToClaimDtoArray<
  T extends ReadonlyArray<{ node: ClaimNode } | null> | null,
  PickList extends keyof ClaimDtoMapping,
>(edges: T, pickList: PickList[]): Pick<ClaimDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(
        x =>
          x?.node?.RecordType?.Name?.value === "Total Project Period" &&
          x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
          x?.node?.Acc_ClaimStatus__c?.value !== "Not used",
      )
      ?.map(x => {
        return mapToClaimDto(x?.node ?? null, pickList);
      }) ?? []
  );
}
