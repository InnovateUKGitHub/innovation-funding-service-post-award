// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import { DateRange, FullDate, FullDateTime, LongDateRange, ShortDate, ShortDateTime } from "../../../src/ui/components/renderers/date";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

const date = new Date("1993/01/07 09:02:01");

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
    it("should render the date as 7 January 1993 09:02 9:02", () => {
        const wrapper = shallow(<FullDateTime value={date} />);
        expect(wrapper.text()).toEqual("7 January 1993, 9:02 AM");
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
    it("should render the date as 7 Jan 1993 9:02", () => {
        const wrapper = shallow(<ShortDateTime value={date} />);
        expect(wrapper.text()).toEqual("7 Jan 1993, 9:02 AM");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<ShortDateTime value={null} />);
        expect(wrapper.html()).toBeNull();
    });
});

describe("DateRange", () => {
    const invalidStartDate = new Date("ABC/85/-01 09:02:01");
    const invalidEndDate = new Date("ABC/85/-01 09:02:01");
    const endDate = new Date("1993/01/08 09:02:01");
    const endDateNextMonth = new Date("1993/02/08 09:02:01");
    const endDateNextYear = new Date("1994/02/08 09:02:01");

    it("should render null if invalid start date is given", () => {
        const wrapper = shallow(<DateRange start={invalidStartDate} end={endDate} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should render null if invalid end date is given", () => {
        const wrapper = shallow(<DateRange start={date} end={invalidEndDate} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should render null if no start date is given", () => {
        const wrapper = shallow(<DateRange start={null} end={endDate} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should render null if no end date is given", () => {
        const wrapper = shallow(<DateRange start={date} end={null} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should render the date with one month and one year", () => {
        const wrapper = shallow(<DateRange start={date} end={endDate} />);
        expect (wrapper.text()).toEqual("Jan 1993");
    });

    it("should render the date range with two months and one year", () => {
        const wrapper = shallow(<DateRange start={date} end={endDateNextMonth} />);
        expect (wrapper.text()).toEqual("Jan to Feb 1993");
    });

    it("should render the date range with two months and two years", () => {
        const wrapper = shallow(<DateRange start={date} end={endDateNextYear} />);
        expect (wrapper.text()).toEqual("Jan 1993 to Feb 1994");
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
      expect (wrapper.text()).toEqual("7 January to 8 February 1993");
    });

    it("should render the full date range with short months and one year", () => {
        const wrapper = shallow(<LongDateRange start={date} end={endDate} isShortMonth={true} />);
        expect (wrapper.text()).toEqual("7 Jan to 8 Feb 1993");
    });

    it("should render the full date range with long months and two years", () => {
        const wrapper = shallow(<LongDateRange start={date} end={endDateNextYear} />);
        expect (wrapper.text()).toEqual("7 January 1993 to 8 February 1994");
    });

    it("should render the full date range with short months and two years", () => {
        const wrapper = shallow(<LongDateRange start={date} end={endDateNextYear} isShortMonth={true} />);
        expect (wrapper.text()).toEqual("7 Jan 1993 to 8 Feb 1994");
    });
});
