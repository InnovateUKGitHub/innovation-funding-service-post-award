import "jest";
import React from "react";
import { ValidationMessage } from "../../src/ui/components";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("ValidationMessage", () => {
  it("when message is empty should render null", () => {
    const wrapper = shallow(<ValidationMessage message="" messageType="success" />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render an error message", () => {
    const wrapper = shallow(<ValidationMessage message="Error message" messageType="error" />).html();
    expect(wrapper).toContain(`<span class=\"govuk-warning-text__assistive\">Error</span>`);
    expect(wrapper).toContain(`<span>Error message</span>`);
  });

  it("should render an info message", () => {
    const wrapper = shallow(<ValidationMessage message="Info message" messageType="info" />).html();
    expect(wrapper).toContain(`<span class=\"govuk-warning-text__assistive\">Info</span>`);
    expect(wrapper).toContain(`<span>Info message</span>`);
  });

  it("should render a success message", () => {
    const wrapper = shallow(<ValidationMessage message="Success message" messageType="success" />).html();
    expect(wrapper).toContain(`<span class=\"govuk-warning-text__assistive\">Success</span>`);
    expect(wrapper).toContain(`<span>Success message</span>`);
  });

  it("should render a warning message", () => {
    const wrapper = shallow(<ValidationMessage message="Warning message" messageType="warning" />).html();
    expect(wrapper).toContain(`<span class=\"govuk-warning-text__assistive\">Warning</span>`);
    expect(wrapper).toContain(`<span>Warning message</span>`);
  });

  it("should render a React Node", () => {
    const wrapper = shallow(<ValidationMessage message={<div>Test</div>} messageType="warning" />).html();
    expect(wrapper).toContain(`<span class=\"govuk-warning-text__assistive\">Warning</span>`);
    expect(wrapper).toContain(`<span><div>Test</div></span>`);
  });
});
