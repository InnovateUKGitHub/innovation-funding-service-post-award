import * as React from "react";
import { useContent } from "@ui/hooks";
import { ExternalLink } from "../renderers";

export function PhaseBanner() {
  const { getContent } = useContent();
  const newServiceMessage = getContent(x => x.components.phaseBannerContent.newServiceMessage);
  const feedbackMessage = getContent(x => x.components.phaseBannerContent.feedbackMessage);
  const helpImproveMessage = getContent(x => x.components.phaseBannerContent.helpImprove);
  const betaText = getContent(x => x.components.phaseBannerContent.betaText);

  const dashboardLink = (
    <ExternalLink
      alt="go to Dashboard"
      className="govuk-link"
      href="https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback"
      data-qa="phase-banner-link"
    >
      {feedbackMessage}
    </ExternalLink>
  );
  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag" data-qa="phase-banner">
          {betaText}
        </strong>

        <span className="govuk-phase-banner__text" data-qa="phase-text">
          {newServiceMessage} {dashboardLink} {helpImproveMessage}
        </span>
      </p>
    </div>
  );
}
