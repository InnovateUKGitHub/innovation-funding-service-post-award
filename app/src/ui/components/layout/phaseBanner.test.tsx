import { render } from "@testing-library/react";

import { PhaseBanner } from "@ui/components";
import { TestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<PhaseBanner />", () => {
  const stubContent = {
    components: {
      phaseBannerContent: {
        newServiceMessage: "This is written in JavaScript. Your <0>continued hatred of JavaScript</0> will help us.",
        betaText: "stub-betaText",
      },
    },
  };

  const setup = () =>
    render(
      <TestBed>
        <PhaseBanner />
      </TestBed>,
    );

  beforeAll(async () => {
    testInitialiseInternationalisation(stubContent);
  });

  describe("@renders", () => {
    it("with beta element", () => {
      const { queryByText } = setup();

      const betaTextElement = queryByText(stubContent.components.phaseBannerContent.betaText);

      expect(betaTextElement).toBeInTheDocument();
    });

    it("with composed message", () => {
      const { queryByTestId } = setup();

      const bannerMessageElement = queryByTestId("banner-message");

      expect(bannerMessageElement).toBeInTheDocument();
      expect(bannerMessageElement).toMatchSnapshot();
    });
  });
});
