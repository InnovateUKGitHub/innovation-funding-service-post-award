import { mapToMonitoringReportDtoArray } from "./mapMonitoringReportDto";

describe("mapToMonitoringReportDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_MonitoringReportStatus__c: {
          value: "Draft",
          label: "Draft label",
        },
        Acc_PeriodStartDate__c: { value: "2022-02-24" },
        Acc_PeriodEndDate__c: { value: "2022-04-24" },
        Acc_FinalMonitoringReport__c: { value: true },
        Acc_ProjectPeriodNumber__c: { value: 1 },
        LastModifiedDate: { value: "2022-04-24" },
        Acc_Project__c: { value: "1" },
      },
    },
    {
      node: {
        Id: "1",
        Acc_MonitoringReportStatus__c: {
          value: "Approved",
          label: "Approved label",
        },
        Acc_PeriodStartDate__c: { value: "2022-02-24" },
        Acc_PeriodEndDate__c: { value: "2022-04-24" },
        Acc_FinalMonitoringReport__c: { value: false },
        Acc_ProjectPeriodNumber__c: { value: 2 },
        LastModifiedDate: { value: "2022-04-24" },
        Acc_Project__c: { value: "1" },
      },
    },
    {
      node: {
        Id: "2",
        Acc_MonitoringReportStatus__c: {
          value: "Awaiting IUK Approval",
          label: "Awaiting IUK Approval label",
        },
        Acc_PeriodStartDate__c: { value: "2022-02-24" },
        Acc_PeriodEndDate__c: { value: "2022-04-24" },
        Acc_FinalMonitoringReport__c: { value: true },
        Acc_ProjectPeriodNumber__c: { value: 3 },
        LastModifiedDate: { value: "2022-04-24" },
        Acc_Project__c: { value: "1" },
      },
    },
    {
      node: {
        Id: "3",
        Acc_MonitoringReportStatus__c: null,
        Acc_PeriodStartDate__c: null,
        Acc_PeriodEndDate__c: null,
        Acc_FinalMonitoringReport__c: null,
        Acc_ProjectPeriodNumber__c: null,
        LastModifiedDate: null,
        Acc_Project__c: null,
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToMonitoringReportDtoArray(edges, [
        "headerId",
        "status",
        "periodId",
        "startDate",
        "endDate",
        "statusName",
        "lastUpdated",
        "projectId",
      ]),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToMonitoringReportDtoArray(edges, ["headerId", "status", "periodId"])).toMatchSnapshot();
  });
});
