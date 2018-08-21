import "jest";
import React from "react";
import * as ACCDate from "../../../src/components/renderers/date";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Date", () => {
    let wrapper;

    it("should render the date as 7th January 1992", () => {
        const date = new Date("1992/01/07");
        wrapper = shallow(<ACCDate.FullDate value={date} />);
        const expectedDate = <span>7 January 1992</span>;
        expect(wrapper.equals(expectedDate));
    });

    it("should return null when a null prop is passed in", () => {
        wrapper = shallow(<ACCDate.FullDate value={null} />);
        expect(wrapper.equals(null));
    });

    it("should return null when an invalid string is passed in", () => {
        wrapper = shallow(<ACCDate.FullDate value="someString" />);
        expect(wrapper.equals(null));
    });
});
