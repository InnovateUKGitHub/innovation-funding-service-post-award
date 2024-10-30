import { Claims } from "@framework/constants/recordTypes";

type IARClaimNode = Readonly<
  GQL.Maybe<{
    Acc_IAR_Status__c: GQL.Value<string>;
    Acc_IARRequired__c: GQL.Value<boolean>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    RecordType: GQL.Maybe<{
      DeveloperName: GQL.Value<string>;
    }>;
  }>
>;

/**
 * Calculates the periods for which IAR is due
 *
 * Requires Claims with Record Type "Total Project Period" and including New
 */
export const getIARDueOnClaimPeriods = (claimsGql: ReadonlyArray<GQL.Maybe<{ node: GQL.Maybe<IARClaimNode> }>>) =>
  claimsGql
    .filter(x => x?.node?.RecordType?.DeveloperName?.value === Claims.totalProjectPeriod)
    .reduce((iarPeriods: string[], cur) => {
      if (cur?.node?.Acc_IAR_Status__c?.value === "Not Received" && !!cur?.node?.Acc_IARRequired__c?.value) {
        iarPeriods.push((cur?.node?.Acc_ProjectPeriodNumber__c?.value ?? 0).toString());
      }
      return iarPeriods;
    }, []) ?? [];
