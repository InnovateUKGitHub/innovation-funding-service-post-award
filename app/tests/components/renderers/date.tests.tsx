// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import { FullDate, FullDateTime, ShortDate, ShortDateTime } from "../../../src/ui/components/renderers/date";
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
    it("should render the date as 7 January 1993 09:02 09:02", () => {
        const wrapper = shallow(<FullDateTime value={date} />);
        expect(wrapper.text()).toEqual("7 January 1993, 09:02 am");
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
    it("should render the date as 7 Jan 1993 09:02", () => {
        const wrapper = shallow(<ShortDateTime value={date} />);
        expect(wrapper.text()).toEqual("7 Jan 1993, 09:02 am");
    });

    it("should return null when a null prop is passed in", () => {
        const wrapper = shallow(<ShortDateTime value={null} />);
        expect(wrapper.html()).toBeNull();
    });
});
