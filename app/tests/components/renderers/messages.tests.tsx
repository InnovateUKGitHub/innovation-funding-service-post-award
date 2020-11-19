
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import React from "react";
import { IMessagesProps, Messages } from "@ui/components/renderers";
import { findByQa } from "../helpers/find-by-qa";

describe("Messages", () => {
  const setup = (props: IMessagesProps) => {
    const wrapper = mount(<Messages {...props} />);
    const validationMessage = findByQa(wrapper, "validation-message-content");

    return {
      wrapper,
      validationMessage,
    };
  };

  it("should render given message", () => {
    const { validationMessage } = setup({ messages: ["first"] });

    expect(validationMessage.text()).toBe("first");
  });

  it("should render an aria live", () => {
    const { wrapper } = setup({ messages: ["first"] });

    const ariaComponent = wrapper.find("AriaLive").hostNodes();

    expect(ariaComponent).toBeDefined();
  });

  it("should render total messages correctly", () => {
    const stubMessages = ["first", "second"];
    const { validationMessage } = setup({ messages: stubMessages });

    expect(validationMessage.length).toBe(stubMessages.length);
  });

  it("should render validation messages correctly", () => {
    const stubMessages = ["first", "second"];
    const { validationMessage } = setup({ messages: stubMessages });

    stubMessages.forEach((_, i) => {
      expect(validationMessage.at(i).text()).toBe(stubMessages[i]);
    });
  });
});
