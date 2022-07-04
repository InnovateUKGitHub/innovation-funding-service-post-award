import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { Content } from "@content/content";
import { IValidationMessageProps, ValidationMessage } from "@ui/components";

describe("<ValidationMessage />", () => {
  const setup = (props: IValidationMessageProps) => {
    const stubCopy = {
      home: {
        exampleContentTitle: {
          content: "stub-exampleContentTitle",
        },
      },
    } as Partial<Content>;

    return render(
      <TestBed content={stubCopy}>
        <ValidationMessage {...props} />
      </TestBed>,
    );
  };

  const StubComponentContent = () => <div>custom component</div>;

  describe("@renders", () => {
    it("when message is empty", () => {
      const { container } = setup({ message: "", messageType: "success" });
      expect(container.firstChild).toBeNull();
    });

    describe("with different message data types", () => {
      test.each`
        name                  | message                                             | expected
        ${"react component"}  | ${(<StubComponentContent />)}                       | ${"div"}
        ${"react element"}    | ${(<div>content within div</div>)}                  | ${"div"}
        ${"react fragment"}   | ${(<>content within a react shorthand fragment</>)} | ${"div"}
        ${"content solution"} | ${(x: Content) => x.home.exampleContentTitle}       | ${"span"}
        ${"string"}           | ${"stub string"}                                    | ${"span"}
        ${"number"}           | ${100}                                              | ${"span"}
      `("with a $name within a $expected", ({ message, expected }) => {
        const { getByTestId } = setup({ message, messageType: "info" });

        const messageElement = getByTestId("validation-message-content");

        expect(messageElement.tagName.toLowerCase()).toBe(expected);
      });
    });

    test.each`
      name              | props
      ${"with info"}    | ${{ message: "Info message", messageType: "info" }}
      ${"with error"}   | ${{ message: "Error message", messageType: "error" }}
      ${"with success"} | ${{ message: "Success message", messageType: "success" }}
      ${"with warning"} | ${{ message: "Warning message", messageType: "warning" }}
    `("with $name state", ({ props }) => {
      const { getByTestId } = setup(props);

      const messageElement = getByTestId("validation-message-content");
      const assistiveMessage = getByTestId("validation-message-assistive");

      expect(messageElement.innerHTML).toBe(props.message);
      expect(assistiveMessage.innerHTML.toLowerCase()).toBe(props.messageType);
    });
  });
});
