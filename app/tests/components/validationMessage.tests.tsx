
import { mount } from "enzyme";

import React from "react";
import { IValidationMessageProps, ValidationMessage } from "@ui/components";
import { Content } from "@content/content";
import { findByQa } from "./helpers/find-by-qa";
import TestBed from "./helpers/TestBed";

describe("ValidationMessage", () => {
  const setup = (props: IValidationMessageProps) => {
    const stubCopy = {
      home: {
        exampleContentTitle: () => ({
          content: "stub-exampleContentTitle",
        }),
      },
    } as Partial<Content>;

    const wrapper = mount(
      <TestBed content={stubCopy}>
        <ValidationMessage {...props} />
      </TestBed>,
    );

    const assistiveMessage = findByQa(wrapper, "validation-message-assistive");
    const messageElement = findByQa(wrapper, "validation-message-content");

    return {
      wrapper,
      assistiveMessage,
      messageElement,
    };
  };

  const StubComponentContent = () => <div>custom component</div>;

  describe("@renders", () => {
    it("when message is empty should render null", () => {
      const { wrapper } = setup({ message: "", messageType: "success" });
      expect(wrapper.html()).toBe(null);
    });

    test.each`
      name                 | message                                             | expected
      ${"react component"} | ${(<StubComponentContent />)}                       | ${"div"}
      ${"react element"}   | ${(<div>content within div</div>)}                  | ${"div"}
      ${"react fragment"}  | ${(<>content within a react shorthand fragment</>)} | ${"div"}
      ${"string"}          | ${"stub string"}                                    | ${"span"}
      ${"number"}          | ${100}                                              | ${"span"}
    `("should render a $name within a $expected", ({ message, expected }) => {
      const { messageElement } = setup({ message, messageType: "info" });

      expect(messageElement.type()).toBe(expected);
    });

    it("when message is a content lookup render within a <span>", () => {
      const { messageElement } = setup({ message: (x) => x.home.exampleContentTitle(), messageType: "success" });

      expect(messageElement.type()).toBe("span");
    });

    test.each`
      name                                  | props
      ${"should render an info message"}    | ${{ message: "Info message", messageType: "info" }}
      ${"should render an error message"}   | ${{ message: "Error message", messageType: "error" }}
      ${"should render an success message"} | ${{ message: "Success message", messageType: "success" }}
      ${"should render an warning message"} | ${{ message: "Warning message", messageType: "warning" }}
    `("$name", ({ props }) => {
      const { assistiveMessage, messageElement } = setup(props);

      expect(assistiveMessage.text().toLowerCase()).toBe(props.messageType);
      expect(messageElement.text()).toBe(props.message);
    });
  });
});
