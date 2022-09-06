import { render } from "@testing-library/react";

import { IMessagesProps, Messages } from "@ui/components/renderers";

describe("<Messages />", () => {
  const setup = (props: IMessagesProps) => render(<Messages {...props} />);

  describe("@renders", () => {
    it("should render single message", () => {
      const stubMessage = "stub-message";
      const { queryByText } = setup({ messages: [stubMessage] });

      const targetElement = queryByText(stubMessage);

      expect(targetElement).toBeInTheDocument();
    });

    it("should render multiple messages", () => {
      const stubFirstMessage = "stub-first-message";
      const stubSecondMessage = "stub-second-message";

      const stubMessages = [stubFirstMessage, stubSecondMessage];

      const { queryByText } = setup({ messages: stubMessages });

      const firstMessage = queryByText(stubFirstMessage);
      const secondMessage = queryByText(stubSecondMessage);

      expect(firstMessage).toBeInTheDocument();
      expect(secondMessage).toBeInTheDocument();
    });

    it("should always render aria-live element", () => {
      const { container } = setup({ messages: [] });

      expect(container.firstChild).toBeEmptyDOMElement();
      expect(container.firstChild).toHaveAttribute("aria-live", "polite");
    });

    it("should render an aria live", () => {
      const stubMessage = "stub-message";
      const { container } = setup({ messages: [stubMessage] });

      expect(container.firstChild).toHaveAttribute("aria-live", "polite");
    });
  });
});
