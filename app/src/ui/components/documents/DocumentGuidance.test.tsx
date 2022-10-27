import { TestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
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
    await testInitialiseInternationalisation(stubContent);
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
