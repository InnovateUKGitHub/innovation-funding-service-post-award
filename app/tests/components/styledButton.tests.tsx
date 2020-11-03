
import React, { CSSProperties } from "react";

import { shallow } from "enzyme";
import { Button } from "../../src/ui/components";
import { GOVUK_LINK_COLOUR } from "../../src/ui/styles/colours";

describe("StyledButton", () => {
  it("should be styled as a primary button when given a primary styling", () => {
    const wrapper = shallow(<Button styling="Primary" />);
    expect(wrapper.prop("className")).toEqual("govuk-button govuk-!-margin-right-1");
  });

  it("should be styled as a secondary button when given a secondary styling", () => {
    const wrapper = shallow(<Button styling="Secondary" />);
    expect(wrapper.prop("className")).toEqual("govuk-button govuk-!-margin-right-1 govuk-button--secondary");
  });

  it("should be styled as a warning button when given a warning styling", () => {
    const wrapper = shallow(<Button styling="Warning" />);
    expect(wrapper.prop("className")).toEqual("govuk-button govuk-!-margin-right-1 govuk-button--warning");
  });

  it("should be styled as a link when given a link styling", () => {
    const wrapper = shallow(<Button styling="Link" />);
    expect(wrapper.prop("className")).toEqual("govuk-link");
  });
});
