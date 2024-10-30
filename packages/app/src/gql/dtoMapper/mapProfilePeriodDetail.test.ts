import { mapToProfilePeriodDetailsDtoArray } from "./mapProfilePeriodDetail";

const edges = [
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 10,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 20,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 30,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 40,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 50,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 60,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 70,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 80,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 90,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
  {
    node: {
      Acc_PeriodLatestForecastCost__c: {
        value: 100,
      },
      Acc_ProjectParticipant__c: {
        value: "a0D2600000zXl70EAC",
      },
    },
  },
];

describe("mapProfilePeriodDetailDtoArray", () => {
  it("should map the gql node to the dto array", () => {
    expect(mapToProfilePeriodDetailsDtoArray(edges, ["forecastCost", "partnerId"])).toMatchSnapshot();
  });
});
