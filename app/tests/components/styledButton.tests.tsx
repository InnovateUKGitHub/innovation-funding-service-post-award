import "jest";
import React, { CSSProperties } from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";
import { Button } from "../../src/ui/components";
import { GOVUK_LINK_COLOUR } from "../../src/ui/styles/colours";

Enzyme.configure({ adapter: new Adapter() });

describe("StyledButton", () => {
  it("should be styled as a primary button when given a primary styling", () => {
    const wrapper = shallow(<Button styling="Primary" />);
    expect(wrapper.prop("className")).toEqual("govuk-button");
  });

  it("should be styled as a secondary button when given a secondary styling", () => {
    const wrapper = shallow(<Button styling="Secondary" />);
    expect(wrapper.prop("className")).toEqual("govuk-button govuk-button--secondary");
  });

  it("should be styled as a warning button when given a warning styling", () => {
    const wrapper = shallow(<Button styling="Warning" />);
    expect(wrapper.prop("className")).toEqual("govuk-button govuk-button--warning");
  });

  it("should be styled as a link when given a link styling", () => {
    const wrapper = shallow(<Button styling="Link" />);
    expect(wrapper.prop("className")).toEqual("govuk-link");
  });
});
