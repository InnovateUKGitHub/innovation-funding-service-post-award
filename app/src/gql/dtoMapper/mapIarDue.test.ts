import { getIARDueOnClaimPeriods } from "./mapIarDue";

describe("getIARDueOnClaimPeriods", () => {
  const edges = [
    {
      node: {
        Acc_IAR_Status__c: { value: "Not Received" },
        Acc_IARRequired__c: { value: true },
        Acc_ProjectID__c: { value: "1" },
      },
    },
    {
      node: {
        Acc_IAR_Status__c: { value: "Not Received" },
        Acc_IARRequired__c: { value: true },
        Acc_ProjectID__c: { value: "2" },
      },
    },
    {
      node: {
        Acc_IAR_Status__c: { value: "Not Received" },
        Acc_IARRequired__c: { value: false },
        Acc_ProjectID__c: { value: "3" },
      },
    },
    {
      node: {
        Acc_IAR_Status__c: { value: "Received" },
        Acc_IARRequired__c: { value: true },
        Acc_ProjectID__c: { value: "4" },
      },
    },
  ];

  it("should map to an array of projectIds for which IAR is due", () => {
    expect(getIARDueOnClaimPeriods(edges)).toMatchSnapshot();
  });
});
