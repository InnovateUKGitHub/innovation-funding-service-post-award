type IARClaimNode = Readonly<{
  Acc_IAR_Status__c: GQL.Value<string>;
  Acc_IARRequired__c: GQL.Value<boolean>;
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;
  RecordType: {
    Name: GQL.Value<string>;
  } | null;
}> | null;

/**
 * Calculates the periods for which IAR is due
 *
 * Requires Claims with Record Type "Total Project Period"
 */
export const getIARDueOnClaimPeriods = (claimsGql: ReadonlyArray<{ node: IARClaimNode | null } | null>) =>
  claimsGql
    .filter(x => x?.node?.RecordType?.Name?.value === "Total Project Period")
    .reduce((iarPeriods: string[], cur) => {
      if (cur?.node?.Acc_IAR_Status__c?.value === "Not Received" && !!cur?.node?.Acc_IARRequired__c?.value) {
        iarPeriods.push((cur?.node?.Acc_ProjectPeriodNumber__c?.value ?? 0).toString());
      }
      return iarPeriods;
    }, []) ?? [];
