import { render } from "@testing-library/react";

import { govukSecondaryTextColour } from "@ui/styles/colours";
import { TextHint, TextHintReactProps } from "@ui/components/layout/textHint";

describe("<TextHint />", () => {
  const setup = (props: TextHintReactProps) => render(<TextHint {...props} />);

  it("should render as a <p> tag", () => {
    const stubContent = "show-me-a-p";
    const { getByText } = setup({ children: stubContent });

    const paragraphElement = getByText(stubContent, { selector: "p" });

    expect(paragraphElement).toHaveTextContent(stubContent);
  });

  it("should render with expected text color", () => {
    const stubContent = "show-me-coloured-text";
    const { getByText } = setup({ children: stubContent });

    const paragraphElement = getByText(stubContent);

    expect(paragraphElement).toHaveStyle(`color: ${govukSecondaryTextColour}`);
  });

  it("should render null if no text is given", () => {
    const { container } = setup({ children: "" });

    expect(container.firstChild).toBeNull();
  });
});
