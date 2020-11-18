import React from "react";
import { render } from "@testing-library/react";

import { ClaimLastModified, ClaimLastModifiedProps } from "@ui/components/claims";
import TestBed from "../helpers/TestBed";

describe("<ClaimLastModified />", () => {
  const stubContent = {
    components: {
      claimLastModified: {
        message: {
          content: "stub-claimLastModified",
        },
      },
    },
  };
  const setup = (props: ClaimLastModifiedProps) =>
    render(
      <TestBed content={stubContent as any}>
        <ClaimLastModified {...props} />
      </TestBed>,
    );

  it("should render with content", () => {
    const { getByTestId } = setup({ modifiedDate: new Date() });

    const targetElement = getByTestId("last-updated");

    expect(targetElement).toHaveTextContent(stubContent.components.claimLastModified.message.content);
  });

  it("should render message format correctly", () => {
    const { getByTestId } = setup({ modifiedDate: new Date("April 6, 1990 10:28:00 +0100") });
    const targetElement = getByTestId("last-updated");

    const prefixMessage = stubContent.components.claimLastModified.message.content;
    const formattedDate = "6 April 1990, 10:28am";

    expect(targetElement).toHaveTextContent(`${prefixMessage}: ${formattedDate}`);
  });
});
