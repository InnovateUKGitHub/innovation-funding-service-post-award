import { mapToBroadcastDtoArray } from "./mapBroadcastDto";

const data = [
  {
    node: {
      Acc_StartDate__c: {
        value: "2022-02-24T04:00:00.000Z",
      },
      Acc_EndDate__c: {
        value: "2027-03-31T04:00:00.000Z",
      },
      Id: "a2M2600000FmJAcEAN",
      DisplayValue: "Fire!",
      Acc_Message__c: {
        value: "Please leave the building",
      },
    },
  },
  {
    node: {
      Acc_StartDate__c: {
        value: "2022-02-24T04:00:00.000Z",
      },
      Acc_EndDate__c: {
        value: "2027-03-31T04:00:00.000Z",
      },
      Id: "a2M2600000FmJAcEAN",
      DisplayValue: "Nuclear alert",
      Acc_Message__c: {
        value: "Please move to the nearest shelter.",
      },
    },
  },
];

describe("mapToBroadcastDtoArray", () => {
  it("should map the gql data to the dto object", () => {
    expect(mapToBroadcastDtoArray(data, ["id", "title", "content", "startDate", "endDate"])).toMatchSnapshot();
  });
});
