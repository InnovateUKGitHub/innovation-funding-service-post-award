import { render } from "@testing-library/react";

import { PhaseBanner } from "@ui/components";
import { TestBed, TestBedContent } from "@shared/TestBed";

describe("<PhaseBanner />", () => {
  const stubContent = {
    components: {
      phaseBannerContent: {
        newServiceMessage: { content: "stub-newServiceMessage" },
        feedbackMessage: { content: "stub-feedback" },
        helpImprove: { content: "stub-helpImprove" },
        betaText: { content: "stub-betaText" },
      },
    },
  };

  const setup = () =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <PhaseBanner />
      </TestBed>,
    );

  describe("@renders", () => {
    it("with beta element", () => {
      const { queryByText } = setup();

      const betaTextElement = queryByText(stubContent.components.phaseBannerContent.betaText.content);

      expect(betaTextElement).toBeInTheDocument();
    });

    it("with feedback link", () => {
      const { getByRole } = setup();

      const feedbackLink = getByRole("link", {
        name: stubContent.components.phaseBannerContent.feedbackMessage.content,
      });

      expect(feedbackLink).toHaveAttribute("href", "https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback");
    });

    it("with composed message", () => {
      const { queryByTestId } = setup();

      const { newServiceMessage, feedbackMessage, helpImprove } = stubContent.components.phaseBannerContent;
      const expectedRenderedMessage = `${newServiceMessage.content} ${feedbackMessage.content} ${helpImprove.content}`;

      const bannerMessageElement = queryByTestId("banner-message");

      expect(bannerMessageElement).toHaveTextContent(new RegExp(expectedRenderedMessage));
    });
  });
});
