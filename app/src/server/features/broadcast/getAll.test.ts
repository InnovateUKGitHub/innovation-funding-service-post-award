import { TestContext } from "@tests/test-utils/testContextProvider";
import { GetAllBroadcasts } from "./getAll";

describe("GetAllBroadcasts", () => {
  it("should fetch broadcasts when run", async () => {
    const context = new TestContext();
    context.testData.createBroadcasts();

    const getAllBroadcasts = new GetAllBroadcasts();
    expect(await getAllBroadcasts.run(context)).toEqual([
      {
        content: ["Würde der Besitzer eines roten Fiat-Pandas bitte die Rezeption kontaktieren"],
        endDate: new Date("2044-12-01T00:00:00.000Z"),
        id: "1",
        startDate: new Date("2014-12-01T00:00:00.000Z"),
        title: "Achtung, Achtung",
      },
      {
        content: ["Der Verzehr eigener Speisen in der Mensa ist untersagt"],
        endDate: new Date("2044-12-01T00:00:00.000Z"),
        id: "2",
        startDate: new Date("2014-12-01T00:00:00.000Z"),
        title: "Achtung, Achtung",
      },
      {
        content: ["Bitte halten Sie wegen des Virus die soziale Distanz ein"],
        endDate: new Date("2044-12-01T00:00:00.000Z"),
        id: "3",
        startDate: new Date("2014-12-01T00:00:00.000Z"),
        title: "Achtung, Achtung",
      },
    ]);
  });
});
