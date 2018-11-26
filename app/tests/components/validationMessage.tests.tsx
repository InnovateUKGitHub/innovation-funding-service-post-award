import "jest";
import React from "react";
import { ValidationMessage } from "../../src/ui/components";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("ValidationMessage", () => {
    it("when valid should render an error message", () => {
        const wrapper = shallow(<ValidationMessage message={"Test message"} messageType="error" />).html();
        expect(wrapper).toContain(`<strong class=\"govuk-warning-text__text\"><span class=\"govuk-warning-text__assistive\">Error</span><span>Test message</span></strong>` );
    });

    it("when message is empty should render null", () => {
        const wrapper = shallow(<ValidationMessage message={""} messageType="success" />);
        expect(wrapper.html()).toBeNull();
    });

    it("when valid should render an info message", () => {
        const wrapper = shallow(<ValidationMessage message={"Test message"} messageType="info" />).html();
        expect(wrapper).toContain(`<p class=\"govuk-warning-text__text\"><span class=\"govuk-warning-text__assistive\">Info</span><span>Test message</span></p>`);
    });
});
