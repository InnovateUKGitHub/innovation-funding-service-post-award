import { LoadDate, LoadableDate } from "./LoadDate";

describe("LoadDate", () => {
  const date = new Date("2020-04-23T12:34");

  test.each([
    ["offset by nothing", { offset: "none" } as LoadableDate],
    ["now", { date: "now" } as LoadableDate],
    ["a time an hour ago", { offset: { hour: -1 } } as LoadableDate],
    ["a day a month ago", { offset: { month: -1 } } as LoadableDate],
    ["a day 2 years ago", { offset: { year: -2 } } as LoadableDate],
    ["today midnight", { date: { hour: 0, minute: 0 } }],
    [
      "yesterday midnight",
      { date: { hour: 0, minute: 0 }, offset: { day: -1 } },
    ],
    [
      "christmas of the next year",
      {
        date: { month: 12, day: 25, hour: 0, minute: 0 },
        offset: { year: 1 },
      },
    ],
  ])("date should be %s", (_, loadableDate) => {
    const loader = new LoadDate({ date });
    loader.setDate(loadableDate as LoadableDate);
    expect(loader.toSalesforceDate()).toMatchSnapshot();
  });
});
