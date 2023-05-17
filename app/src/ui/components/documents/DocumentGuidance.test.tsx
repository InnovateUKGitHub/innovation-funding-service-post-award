import { TestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { render } from "@testing-library/react";
import { DocumentGuidance } from "@ui/components";

describe("<DocumentGuidance />", () => {
  const stubContent = {
    components: {
      documentGuidance: {
        header: "stub-header",
        message: "stub-message",
      },
    },
  };

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  test("@renders", () => {
    const { asFragment } = render(
      <TestBed>
        <DocumentGuidance />
      </TestBed>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
