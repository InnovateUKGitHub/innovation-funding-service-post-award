import { render } from "@testing-library/react";

import { PhaseBanner } from "@ui/components";
import { TestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<PhaseBanner />", () => {
  const stubContent = {
    components: {
      phaseBannerContent: {
        newServiceMessage: "stub-newServiceMessage",
        feedbackMessage: "stub-feedback",
        helpImprove: "stub-helpImprove",
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

    it("with feedback link", () => {
      const { getByRole } = setup();

      const feedbackLink = getByRole("link", {
        name: stubContent.components.phaseBannerContent.feedbackMessage,
      });

      expect(feedbackLink).toHaveAttribute("href", "https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback");
    });

    it("with composed message", () => {
      const { queryByTestId } = setup();

      const { newServiceMessage, feedbackMessage, helpImprove } = stubContent.components.phaseBannerContent;
      const expectedRenderedMessage = `${newServiceMessage} ${feedbackMessage} ${helpImprove}`;

      const bannerMessageElement = queryByTestId("banner-message");

      expect(bannerMessageElement).toHaveTextContent(new RegExp(expectedRenderedMessage));
    });
  });
});
