import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ClaimLastModifiedProps, ClaimLastModified } from "./claimLastModified";

describe("<ClaimLastModified />", () => {
  const stubContent = {
    components: {
      claimLastModified: {
        message: "stub-claimLastModified",
      },
    },
  };
  const setup = (props: ClaimLastModifiedProps) =>
    render(
      <TestBed>
        <ClaimLastModified {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  it("should render with content", () => {
    const { getByTestId } = setup({ modifiedDate: new Date() });

    const targetElement = getByTestId("last-updated");

    expect(targetElement).toHaveTextContent(stubContent.components.claimLastModified.message);
  });

  it("should render message format correctly", () => {
    const { getByTestId } = setup({ modifiedDate: new Date("April 6, 1990 10:28:00 +0100") });
    const targetElement = getByTestId("last-updated");

    const prefixMessage = stubContent.components.claimLastModified.message;
    const formattedDate = "6 April 1990, 10:28am";

    expect(targetElement).toHaveTextContent(`${prefixMessage}: ${formattedDate}`);
  });
});
