import { render } from "@testing-library/react";
import { DateTime } from "luxon";

import {
  CondensedDateRange,
  Duration,
  FullDate,
  FullDateTime,
  LongDateRange,
  Months,
  MonthYear,
  ShortDate,
  ShortDateRange,
  ShortDateRangeFromDuration,
  ShortDateTime,
  getMonth,
  getYear,
  combineDate,
} from "@ui/components/atoms/Date";

import { findByTextContent } from "../../../../../tests/test-utils/rtl-helpers";

const date = new Date("1993/01/07 09:02:01");
const afternoonDate = new Date("1993/01/07 21:02:01");

describe("FullDate", () => {
  it("should render the date as 7 January 1993 1993", () => {
    const { queryByText } = render(<FullDate value={date} />);
    expect(queryByText("7 January 1993")).toBeInTheDocument();
  });

  it("should return null when a null prop is passed in", () => {
    const { container } = render(<FullDate value={null} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("FullDateTime", () => {
  it("should render the date in morning as 7 January 1993 09:02 9:02am", () => {
    const { queryByText } = render(<FullDateTime value={date} />);
    expect(queryByText("7 January 1993, 9:02am")).toBeInTheDocument();
  });

  it("should render the date in morning as 7 January 1993 09:02 9:02pm", () => {
    const { queryByText } = render(<FullDateTime value={afternoonDate} />);
    expect(queryByText("7 January 1993, 9:02pm")).toBeInTheDocument();
  });

  it("should return null when a null prop is passed in", () => {
    const { container } = render(<FullDateTime value={null} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("ShortDate", () => {
  it("should render the date as 7 Jan 1993", () => {
    const { queryByText } = render(<ShortDate value={date} />);
    expect(queryByText("7 Jan 1993")).toBeInTheDocument();
  });

  it("should return null when a null prop is passed in", () => {
    const { container } = render(<ShortDate value={null} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("ShortDateTime", () => {
  it("should render the morning date as 7 Jan 1993 9:02am", () => {
    const { queryByText } = render(<ShortDateTime value={date} />);
    expect(queryByText("7 Jan 1993, 9:02am")).toBeInTheDocument();
  });

  it("should render the afternoon date as 7 Jan 1993 9:02pm", () => {
    const { queryByText } = render(<ShortDateTime value={afternoonDate} />);
    expect(queryByText("7 Jan 1993, 9:02pm")).toBeInTheDocument();
  });

  it("should render the midday date as 7 Jan 1993 12:00pm", () => {
    const { queryByText } = render(<ShortDateTime value={new Date("1993/01/07 12:00:00")} />);
    expect(queryByText("7 Jan 1993, 12:00pm")).toBeInTheDocument();
  });

  it("should return null when a null prop is passed in", () => {
    const { container } = render(<ShortDateTime value={null} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("CondensedDateRange", () => {
  const invalidStartDate = new Date("ABC/85/-01 09:02:01");
  const invalidEndDate = new Date("ABC/85/-01 09:02:01");
  const endDate = new Date("1993/01/08 09:02:01");
  const endDateNextMonth = new Date("1993/02/08 09:02:01");
  const endDateNextYear = new Date("1994/02/08 09:02:01");

  it("should render null if invalid start date is given", () => {
    const { container } = render(<CondensedDateRange start={invalidStartDate} end={endDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if invalid end date is given", () => {
    const { container } = render(<CondensedDateRange start={date} end={invalidEndDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if no start date is given", () => {
    const { container } = render(<CondensedDateRange start={null} end={endDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if no end date is given", () => {
    const { container } = render(<CondensedDateRange start={date} end={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the date with one month and one year", () => {
    const { queryByText } = render(<CondensedDateRange start={date} end={endDate} />);
    expect(queryByText("Jan 1993")).toBeInTheDocument();
  });

  it("should render the date range with two months and one year", async () => {
    render(<CondensedDateRange start={date} end={endDateNextMonth} />);

    const expectedDate = await findByTextContent("Jan to Feb 1993");

    expect(expectedDate).toBeInTheDocument();
  });

  it("should render the date range with two months and two years", async () => {
    render(<CondensedDateRange start={date} end={endDateNextYear} />);

    const expectedDate = await findByTextContent("Jan 1993 to Feb 1994");

    expect(expectedDate).toBeInTheDocument();
  });
});

describe("LongDateRange", () => {
  const invalidStartDate = new Date("ABC/85/-01 09:02:01");
  const invalidEndDate = new Date("ABC/85/-01 09:02:01");
  const endDate = new Date("1993/02/08 09:02:01");
  const endDateNextYear = new Date("1994/02/08 09:02:01");

  it("should render null if invalid start date is given", () => {
    const { container } = render(<LongDateRange start={invalidStartDate} end={endDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if invalid end date is given", () => {
    const { container } = render(<LongDateRange start={date} end={invalidEndDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if no start date is given", () => {
    const { container } = render(<LongDateRange start={null} end={endDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if no end date is given", () => {
    const { container } = render(<LongDateRange start={date} end={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the full date range with long months and one year", async () => {
    render(<LongDateRange start={date} end={endDate} />);

    const expectedDate = await findByTextContent("7 January to 8 February 1993");

    expect(expectedDate).toBeInTheDocument();
  });

  it("should render the full date range with long months and two years", async () => {
    render(<LongDateRange start={date} end={endDateNextYear} />);

    const expectedDate = await findByTextContent("7 January 1993 to 8 February 1994");

    expect(expectedDate).toBeInTheDocument();
  });
});

describe("ShortDateRange", () => {
  const invalidStartDate = new Date("ABC/85/-01 09:02:01");
  const invalidEndDate = new Date("ABC/85/-01 09:02:01");
  const endDate = new Date("1993/02/08 09:02:01");
  const endDateNextYear = new Date("1994/02/08 09:02:01");

  it("should render null if invalid start date is given", () => {
    const { container } = render(<ShortDateRange start={invalidStartDate} end={endDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if invalid end date is given", () => {
    const { container } = render(<ShortDateRange start={date} end={invalidEndDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if no start date is given", () => {
    const { container } = render(<ShortDateRange start={null} end={endDate} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if no end date is given", () => {
    const { container } = render(<ShortDateRange start={date} end={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the full date range with short months and one year", async () => {
    render(<ShortDateRange start={date} end={endDate} />);

    const expectedDate = await findByTextContent("7 Jan to 8 Feb 1993");

    expect(expectedDate).toBeInTheDocument();
  });

  it("should render the full date range with short months and two years", async () => {
    render(<ShortDateRange start={date} end={endDateNextYear} />);

    const expectedDate = await findByTextContent("7 Jan 1993 to 8 Feb 1994");

    expect(expectedDate).toBeInTheDocument();
  });
});

describe("Duration", () => {
  it("should render one month correctly", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Sep 30 2019 00:00:00 GMT+0100 (Greenwich Mean Time)");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("1 month")).toBeInTheDocument();
  });

  it("should render correct duration over summer time", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Dec 31 2019 00:00:00 GMT+0000 (Greenwich Mean Time)");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("4 months")).toBeInTheDocument();
  });

  it("should render correctly if difference is between a shorter month & a longer month", () => {
    const start = new Date("2019/02/01");
    const end = new Date("2019/10/31");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("9 months")).toBeInTheDocument();
  });

  it("should render correctly if difference is between a longer month & a shorter month", () => {
    const start = new Date("2019/10/01");
    const end = new Date("2020/02/28");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("5 months")).toBeInTheDocument();
  });

  it("should render correctly if difference is between a shorter month & a longer month, over a really long time period", () => {
    const start = new Date("2019/02/01");
    const end = new Date("3019/10/31");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("12009 months")).toBeInTheDocument();
  });

  it("should render correctly if difference is between a longer month & a shorter month, over a really long time period", () => {
    const start = new Date("2019/10/01");
    const end = new Date("3020/02/28");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("12005 months")).toBeInTheDocument();
  });

  it("should round up if more than 0.5 months", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Dec 25 2019 00:00:00 GMT+0000 (Greenwich Mean Time)");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("4 months")).toBeInTheDocument();
  });

  it("should round up if less than 0.5 months", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Dec 10 2019 00:00:00 GMT+0000 (Greenwich Mean Time)");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("4 months")).toBeInTheDocument();
  });

  it("should give 13 months if the dates are exactly 1 year apart", () => {
    const start = new Date("2019/01/01");
    const end = new Date("2020/01/01");

    const { queryByText } = render(<Duration startDate={start} endDate={end} />);
    expect(queryByText("13 months")).toBeInTheDocument();
  });
});

describe("Months", () => {
  it("should render null if months not provided", () => {
    const { container } = render(<Months months={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if months is NaN", () => {
    const { container } = render(<Months months={NaN} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render 0 months", () => {
    const { queryByText } = render(<Months months={0} />);
    expect(queryByText("0 months")).toBeInTheDocument();
  });

  it("should render 1 month", () => {
    const { queryByText } = render(<Months months={1} />);
    expect(queryByText("1 month")).toBeInTheDocument();
  });

  it("should render 2 months", () => {
    const { queryByText } = render(<Months months={2} />);
    expect(queryByText("2 months")).toBeInTheDocument();
  });
});

describe("MonthYear", () => {
  it("should render null if date not provided", () => {
    const { container } = render(<MonthYear value={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should show that invalid date is provided", () => {
    const { queryByText } = render(<MonthYear value={"hello world"} />);
    expect(queryByText("INVALID DATE FORMAT")).toBeInTheDocument();
  });

  it("should render the month and the year", () => {
    const { queryByText } = render(<MonthYear value={DateTime.local(2030, 2).toJSDate()} />);
    expect(queryByText("February 2030")).toBeInTheDocument();
  });
});

describe("ShortDateRangeFromDuration", () => {
  it("should render null if start date not provided", () => {
    const { container } = render(<ShortDateRangeFromDuration startDate={null} months={1} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if start date invalid", () => {
    const { container } = render(<ShortDateRangeFromDuration startDate={new Date("invalid")} months={1} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if months not provided", () => {
    const { container } = render(<ShortDateRangeFromDuration startDate={new Date()} months={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if months is invalid", () => {
    const { container } = render(<ShortDateRangeFromDuration startDate={new Date()} months={NaN} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if months is 0", () => {
    const { container } = render(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render correct date range if months is 1", async () => {
    render(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={1} />);

    const expectedDate = await findByTextContent("1 Sep to 30 Sep 2012");

    expect(expectedDate).toBeInTheDocument();
  });

  it("should render correct date range if months is 12", async () => {
    render(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={12} />);

    const expectedDate = await findByTextContent("1 Sep 2012 to 31 Aug 2013");

    expect(expectedDate).toBeInTheDocument();
  });

  it("should render correct date range if months is 4", async () => {
    render(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={4} />);

    const expectedDate = await findByTextContent("1 Sep to 31 Dec 2012");

    expect(expectedDate).toBeInTheDocument();
  });
});

describe("getMonth", () => {
  it("should return an empty string if null", () => {
    expect(getMonth(null)).toEqual("");
  });

  it("should return the month number as string", () => {
    expect(getMonth(new Date("2012/01/1"))).toEqual("01");
    expect(getMonth(new Date("2012/12/1"))).toEqual("12");
  });
});

describe("getYear", () => {
  it("should return an empty string if null", () => {
    expect(getYear(null)).toEqual("");
  });

  it("should return the year number as string", () => {
    expect(getYear(new Date("2012/09/1"))).toEqual("2012");
  });
});

describe("combineDate", () => {
  it("should combine month and year to form a date with the day at start of month", () => {
    expect(combineDate("2", "2012", true)).toMatchInlineSnapshot(`2012-02-01T12:00:00.000Z`);
  });

  it("should combine month and year to form a date with the day at end of month", () => {
    expect(combineDate("2", "2012", false)).toMatchInlineSnapshot(`2012-02-29T12:00:00.000Z`);
  });

  it("should return null if month and year is missing", () => {
    expect(combineDate(null, null, false)).toEqual(null);
    expect(combineDate(null, null, false)).toEqual(null);
  });
});
