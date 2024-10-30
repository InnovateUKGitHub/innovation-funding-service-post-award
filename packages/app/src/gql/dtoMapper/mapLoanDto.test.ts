import { mapToLoanDtoArray } from "./mapLoanDto";

describe("mapToLoanDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_PeriodNumber__c: { value: 1 },
        Loan_DrawdownStatus__c: { value: "Queried" },
        Loan_LatestForecastDrawdown__c: { value: 10000 },
        Loan_UserComments__c: { value: "hello" },
        Loan_PlannedDateForDrawdown__c: { value: "2022-01-22" },
      },
    },
    {
      node: {
        Id: "1",
        Acc_PeriodNumber__c: { value: 1 },
        Loan_DrawdownStatus__c: { value: "Queried" },
        Loan_LatestForecastDrawdown__c: { value: 10000 },
        Loan_UserComments__c: { value: "hello" },
        Loan_PlannedDateForDrawdown__c: { value: "2022-01-22" },
      },
    },
    {
      node: {
        Id: "4",
        Acc_PeriodNumber__c: null,
        Loan_DrawdownStatus__c: null,
        Loan_LatestForecastDrawdown__c: null,
        Loan_UserComments__c: null,
        Loan_PlannedDateForDrawdown__c: null,
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToLoanDtoArray(edges, ["id", "period", "status", "forecastAmount", "comments", "requestDate"]),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToLoanDtoArray(edges, ["id", "forecastAmount"])).toMatchSnapshot();
  });
});
