type IARClaimNode = Readonly<{
  Acc_IAR_Status__c: GQL.Value<string>;
  Acc_IARRequired__c: GQL.Value<boolean>;
  Acc_ProjectID__c: GQL.Value<string>;
}> | null;

/**
 * Calculates the periods for which IAR is due
 */
export const getIARDueOnClaimPeriods = (claimsGql: ReadonlyArray<{ node: IARClaimNode | null } | null>) =>
  claimsGql.reduce((iarPeriods: string[], cur) => {
    if (cur?.node?.Acc_IAR_Status__c?.value === "Not Received" && !!cur?.node?.Acc_IARRequired__c?.value) {
      iarPeriods.push((cur?.node?.Acc_ProjectID__c?.value ?? 0).toString());
    }
    return iarPeriods;
  }, []) ?? [];
