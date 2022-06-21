import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { range } from "../../../../src/shared/range";
import { RadioList } from "./radioList";

const options = range(4).map(i => ({ value: `Option ${i}`, id: `${i}` }));

describe("RadioList", () => {
  it("Renders with correct class", () => {
    const { container } = render(<RadioList options={options} name="testName" inline />);
    expect(container.firstChild).toHaveClass("govuk-radios govuk-radios--inline");
  });

  it("renders with no selected button", () => {
    const { container } = render(<RadioList options={options} name="testName" inline />);
    const inputs = container.querySelectorAll("input");
    inputs.forEach(x => expect(x).not.toHaveAttribute("checked"));
  });

  it("marks the correct button as checked when set initially", () => {
    const { getByLabelText } = render(
      <RadioList options={options} name="testName" value={{ value: "Option 2", id: "2" }} inline />,
    );
    const input = getByLabelText("Option 2");
    expect(input).toHaveAttribute("checked");
  });

  it("marks the correct button as checked when clicked", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(<RadioList options={options} name="testName" onChange={onChange} inline />);
    const input = getByLabelText("Option 3");
    userEvent.click(input);
    expect(onChange).toHaveBeenCalledWith({ value: "Option 3", id: "3" });
  });
});
