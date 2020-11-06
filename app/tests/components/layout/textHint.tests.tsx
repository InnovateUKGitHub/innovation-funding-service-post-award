import React from "react";
import { mount } from "enzyme";

import { GOVUK_SECONDARY_TEXT_COLOUR } from "@ui/styles/colours";
import { TextHint, TextHintReactProps } from "../../../src/ui/components/layout/textHint";
import { findByQa } from "../helpers/find-by-qa";

describe("<TextHint />", () => {
  const setup = (text: TextHintReactProps["children"]) => {
    const wrapper = mount(<TextHint>{text}</TextHint>);
    const textElement = findByQa(wrapper, "text-hint");

    return {
      wrapper,
      textElement,
    };
  };

  it("should render as a <p> tag", () => {
    const { textElement } = setup("show-me-a-p");

    expect(textElement.type()).toEqual("p");
  });

  it("should render with unique color", () => {
    const { textElement } = setup("coloured-text");
    const inlineStyles = textElement.prop("style")!;

    expect(inlineStyles.color).toEqual(GOVUK_SECONDARY_TEXT_COLOUR);
  });

  it("should render with the correct text", () => {
    const stubText = "stub-text";
    const { textElement } = setup(stubText);

    expect(textElement.text()).toEqual(stubText);
  });

  it("should render null if no text is given", () => {
    const { textElement } = setup("");

    expect(textElement.exists()).toBe(false);
  });
});
