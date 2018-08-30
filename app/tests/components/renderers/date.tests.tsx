import "jest";
import React from "react";
import { FullDate, FullDateTime, FullDateTimeWithSeconds, ShortDate, ShortDateTime } from "../../../src/components/renderers/date";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

const date = new Date("1993/01/07 09:02:01");

describe("FullDate", () => {
    it("should render the date as 7th Jan 1993", () => {
        const wrapper = shallow(<FullDate value={date} />);
        expect(wrapper.text()).toEqual("7 Jan 1993");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<FullDate value={null} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should return null when an invalid string is passed in", () => {
        const wrapper = shallow(<FullDate value="some string" />);
        expect(wrapper.html()).toBeNull();
    });
});


describe("FullDateTime", () => {
    it("should render the date as 7 Jan 1993 09:02 09:02", () => {
        const wrapper = shallow(<FullDateTime value={date} />);
        expect(wrapper.text()).toEqual("7 Jan 1993 09:02");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<FullDateTime value={null} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should return null when an invalid string is passed in", () => {
        const wrapper = shallow(<FullDateTime value="some string" />);
        expect(wrapper.html()).toBeNull();
    });
});

describe("FullDateTimeWithSeconds", () => {
    it("should render the date as 07/01/1993 09:02:01", () => {
        const wrapper = shallow(<FullDateTimeWithSeconds value={date} />);
        expect(wrapper.text()).toEqual("7 Jan 1993 09:02:01");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<FullDateTimeWithSeconds value={null} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should return null when an invalid string is passed in", () => {
        const wrapper = shallow(<FullDateTimeWithSeconds value="some string" />);
        expect(wrapper.html()).toBeNull();
    });
});

describe("ShortDate", () => {
    it("should render the date as 07/01/1993", () => {
        const wrapper = shallow(<ShortDate value={date} />);
        expect(wrapper.text()).toEqual("07/01/1993");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<ShortDate value={null} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should return null when an invalid string is passed in", () => {
        const wrapper = shallow(<ShortDate value="some string" />);
        expect(wrapper.html()).toBeNull();
    });
});

describe("ShortDateTime", () => {
    it("should render the date as 07/01/1993 09:02", () => {
        const wrapper = shallow(<ShortDateTime value={date} />);
        expect(wrapper.text()).toEqual("07/01/1993 09:02");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<ShortDateTime value={null} />);
        expect(wrapper.html()).toBeNull();
    });

    it("should return null when an invalid string is passed in", () => {
        const wrapper = shallow(<ShortDateTime value="some string" />);
        expect(wrapper.html()).toBeNull();
    });
});
