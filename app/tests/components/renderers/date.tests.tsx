// tslint:disable:no-duplicate-string no-identical-functions
import "jest";
import React from "react";
import { CondensedDateRange, Duration, FullDate, FullDateTime, LongDateRange, Months, ShortDate, ShortDateRange, ShortDateRangeFromDuration, ShortDateTime } from "../../../src/ui/components/renderers/date";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

const date = new Date("1993/01/07 09:02:01");
const afternoonDate = new Date("1993/01/07 21:02:01");

describe("FullDate", () => {
  it("should render the date as 7 January 1993 1993", () => {
    const wrapper = shallow(<FullDate value={date} />);
    expect(wrapper.text()).toEqual("7 January 1993");
  });

  it("should return null when a null prop is passed in", () => {
    const wrapper = shallow(<FullDate value={null} />);
    expect(wrapper.html()).toBeNull();
  });
});

describe("FullDateTime", () => {
  it("should render the date in moning as 7 January 1993 09:02 9:02am", () => {
    const wrapper = shallow(<FullDateTime value={date} />);
    expect(wrapper.text()).toEqual("7 January 1993, 9:02am");
  });

  it("should render the date in moning as 7 January 1993 09:02 9:02pm", () => {
    const wrapper = shallow(<FullDateTime value={afternoonDate} />);
    expect(wrapper.text()).toEqual("7 January 1993, 9:02pm");
  });

  it("should return null when a null prop is passed in", () => {
    const wrapper = shallow(<FullDateTime value={null} />);
    expect(wrapper.html()).toBeNull();
  });
});

describe("ShortDate", () => {
  it("should render the date as 7 Jan 1993", () => {
    const wrapper = shallow(<ShortDate value={date} />);
    expect(wrapper.text()).toEqual("7 Jan 1993");
  });

  it("should return null when a null prop is passed in", () => {
    const wrapper = shallow(<ShortDate value={null} />);
    expect(wrapper.html()).toBeNull();
  });
});

describe("ShortDateTime", () => {
  it("should render the morning date as 7 Jan 1993 9:02am", () => {
    const wrapper = shallow(<ShortDateTime value={date} />);
    expect(wrapper.text()).toEqual("7 Jan 1993, 9:02am");
  });

  it("should render the afternoon date as 7 Jan 1993 9:02pm", () => {
    const wrapper = shallow(<ShortDateTime value={afternoonDate} />);
    expect(wrapper.text()).toEqual("7 Jan 1993, 9:02pm");
  });

  it("should return null when a null prop is passed in", () => {
    const wrapper = shallow(<ShortDateTime value={null} />);
    expect(wrapper.html()).toBeNull();
  });
});

describe("CondensedDateRange", () => {
  const invalidStartDate = new Date("ABC/85/-01 09:02:01");
  const invalidEndDate = new Date("ABC/85/-01 09:02:01");
  const endDate = new Date("1993/01/08 09:02:01");
  const endDateNextMonth = new Date("1993/02/08 09:02:01");
  const endDateNextYear = new Date("1994/02/08 09:02:01");

  it("should render null if invalid start date is given", () => {
    const wrapper = shallow(<CondensedDateRange start={invalidStartDate} end={endDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if invalid end date is given", () => {
    const wrapper = shallow(<CondensedDateRange start={date} end={invalidEndDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if no start date is given", () => {
    const wrapper = shallow(<CondensedDateRange start={null} end={endDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if no end date is given", () => {
    const wrapper = shallow(<CondensedDateRange start={date} end={null} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render the date with one month and one year", () => {
    const wrapper = shallow(<CondensedDateRange start={date} end={endDate} />);
    expect(wrapper.text()).toEqual("Jan 1993");
  });

  it("should render the date range with two months and one year", () => {
    const wrapper = shallow(<CondensedDateRange start={date} end={endDateNextMonth} />);
    expect(wrapper.text()).toEqual("Jan to Feb 1993");
  });

  it("should render the date range with two months and two years", () => {
    const wrapper = shallow(<CondensedDateRange start={date} end={endDateNextYear} />);
    expect(wrapper.text()).toEqual("Jan 1993 to Feb 1994");
  });
});

describe("LongDateRange", () => {
  const invalidStartDate = new Date("ABC/85/-01 09:02:01");
  const invalidEndDate = new Date("ABC/85/-01 09:02:01");
  const endDate = new Date("1993/02/08 09:02:01");
  const endDateNextYear = new Date("1994/02/08 09:02:01");

  it("should render null if invalid start date is given", () => {
    const wrapper = shallow(<LongDateRange start={invalidStartDate} end={endDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if invalid end date is given", () => {
    const wrapper = shallow(<LongDateRange start={date} end={invalidEndDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if no start date is given", () => {
    const wrapper = shallow(<LongDateRange start={null} end={endDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if no end date is given", () => {
    const wrapper = shallow(<LongDateRange start={date} end={null} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render the full date range with long months and one year", () => {
    const wrapper = shallow(<LongDateRange start={date} end={endDate} />);
    expect(wrapper.text()).toEqual("7 January to 8 February 1993");
  });

  it("should render the full date range with long months and two years", () => {
    const wrapper = shallow(<LongDateRange start={date} end={endDateNextYear} />);
    expect(wrapper.text()).toEqual("7 January 1993 to 8 February 1994");
  });
});

describe("ShortDateRange", () => {
  const invalidStartDate = new Date("ABC/85/-01 09:02:01");
  const invalidEndDate = new Date("ABC/85/-01 09:02:01");
  const endDate = new Date("1993/02/08 09:02:01");
  const endDateNextYear = new Date("1994/02/08 09:02:01");

  it("should render null if invalid start date is given", () => {
    const wrapper = shallow(<ShortDateRange start={invalidStartDate} end={endDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if invalid end date is given", () => {
    const wrapper = shallow(<ShortDateRange start={date} end={invalidEndDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if no start date is given", () => {
    const wrapper = shallow(<ShortDateRange start={null} end={endDate} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render null if no end date is given", () => {
    const wrapper = shallow(<ShortDateRange start={date} end={null} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render the full date range with short months and one year", () => {
    const wrapper = shallow(<ShortDateRange start={date} end={endDate} />);
    expect(wrapper.text()).toEqual("7 Jan to 8 Feb 1993");
  });

  it("should render the full date range with short months and two years", () => {
    const wrapper = shallow(<ShortDateRange start={date} end={endDateNextYear} />);
    expect(wrapper.text()).toEqual("7 Jan 1993 to 8 Feb 1994");
  });
});

describe("Duration", () => {
  it("should render one month correctly", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Sep 30 2019 00:00:00 GMT+0100 (Greenwich Mean Time)");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("1 month");
  });

  it("should render correct duration over summer time", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Dec 31 2019 00:00:00 GMT+0000 (Greenwich Mean Time)");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("4 months");
  });

  it("should render correctly if difference is between a shorter month & a longer month", () => {
    const start = new Date("2019/02/01");
    const end = new Date("2019/10/31");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("9 months");
  });

  it("should render correctly if difference is between a longer month & a shorter month", () => {
    const start = new Date("2019/10/01");
    const end = new Date("2020/02/28");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("5 months");
  });

  it("should render correctly if difference is between a shorter month & a longer month, over a really long time period", () => {
    const start = new Date("2019/02/01");
    const end = new Date("3019/10/31");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("12009 months");
  });

  it("should render correctly if difference is between a longer month & a shorter month, over a really long time period", () => {
    const start = new Date("2019/10/01");
    const end = new Date("3020/02/28");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("12005 months");
  });

  it("should round up if more than 0.5 months", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Dec 25 2019 00:00:00 GMT+0000 (Greenwich Mean Time)");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("4 months");
  });

  it("should round up if less than 0.5 months", () => {
    const start = new Date("Sun Sep 01 2019 00:00:00 GMT+0100 (British Summer Time)");
    const end = new Date("Tue Dec 10 2019 00:00:00 GMT+0000 (Greenwich Mean Time)");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("4 months");
  });

  it("should give 13 months if the dates are exactly 1 year apart", () => {
    const start = new Date("2019/01/01");
    const end = new Date("2020/01/01");

    const wrapper = shallow(<Duration startDate={start} endDate={end} />);
    expect(wrapper.text()).toEqual("13 months");
  });
});

describe("Months", () => {
  it("should render null if months not provided", () => {
    const wrapper = mount(<Months months={null}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render null if months is NaN", () => {
    const wrapper = mount(<Months months={NaN}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render 0 months", () => {
    const wrapper = mount(<Months months={0}/>);
    expect(wrapper.text()).toContain("0 months");
  });

  it("should render 1 month", () => {
    const wrapper = mount(<Months months={1}/>);
    expect(wrapper.text()).toContain("1 month");
  });

  it("should render 2 months", () => {
    const wrapper = mount(<Months months={2}/>);
    expect(wrapper.text()).toContain("2 months");
  });
});

describe("ShortDateRangeFromDuration", () => {
  it("should render null if start date not provided", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={null} months={1}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render null if start date invalid", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date("invalid")} months={1}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render null if months not provided", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date()} months={null}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render null if months is invalid", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date()} months={NaN}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render null if months is 0", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={0}/>);
    expect(wrapper.text()).toBeNull();
  });

  it("should render correct date range if months is 1", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={1}/>);
    expect(wrapper.text()).toEqual("1 Sep to 30 Sep 2012");
  });

  it("should render correct date range if months is 12", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={12}/>);
    expect(wrapper.text()).toEqual("1 Sep 2012 to 31 Aug 2013");
  });

  it("should render correct date range if months is 4", () => {
    const wrapper = mount(<ShortDateRangeFromDuration startDate={new Date("2012/09/1")} months={4}/>);
    expect(wrapper.text()).toEqual("1 Sep to 31 Dec 2012");
  });
});
