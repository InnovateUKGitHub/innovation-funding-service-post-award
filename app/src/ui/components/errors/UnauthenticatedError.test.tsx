import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { UnauthenticatedError } from "@ui/components/errors";

describe("<UnauthenticatedError />", () => {
  describe("@renders", () => {
    const stubContent = {
      errors: {
        unauthenticated: {
          contactUsPreLinkContent: { content: "stub-contactUsPreLinkContent" },
          contactUsLinkTextContent: { content: "stub-contactUsLinkTextContent" },
          contactUsPostLinkContent: { content: "stub-contactUsPostLinkContent" },
        },
      },
    };

    const setup = () =>
      render(
        <TestBed content={stubContent as TestBedContent}>
          <UnauthenticatedError />
        </TestBed>,
      );

    test("with page message containing link text", () => {
      const { container } = setup();

      const expectedWrittenContent = [
        stubContent.errors.unauthenticated.contactUsPreLinkContent.content,
        stubContent.errors.unauthenticated.contactUsLinkTextContent.content,
        stubContent.errors.unauthenticated.contactUsPostLinkContent.content,
      ].join(" ");

      expect(container).toHaveTextContent(expectedWrittenContent);
    });
  });
});
