import { TestContext } from "@tests/test-utils/testContextProvider";
import { GetBroadcast } from "./getBroadcast";

describe("GetBroadcast", () => {
  const context = new TestContext();
  context.testData.createBroadcasts();
  it("should fetch the broadcast matching the id", async () => {
    const getBroadcast1 = new GetBroadcast("1" as BroadcastId);
    expect(await getBroadcast1.run(context)).toEqual({
      content: ["Würde der Besitzer eines roten Fiat-Pandas bitte die Rezeption kontaktieren"],
      endDate: new Date("2044-12-01T00:00:00.000Z"),
      id: "1",
      startDate: new Date("2014-12-01T00:00:00.000Z"),
      title: "Achtung, Achtung",
    });

    const getBroadcast2 = new GetBroadcast("2" as BroadcastId);
    expect(await getBroadcast2.run(context)).toEqual({
      content: ["Der Verzehr eigener Speisen in der Mensa ist untersagt"],
      endDate: new Date("2044-12-01T00:00:00.000Z"),
      id: "2",
      startDate: new Date("2014-12-01T00:00:00.000Z"),
      title: "Achtung, Achtung",
    });
  });
});
