import * as React from "react";
import { ExternalLink } from "../renderers";

export const PhaseBanner = () => (
  <div className="govuk-phase-banner">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag " data-qa="phase-banner">beta</strong>
      <span className="govuk-phase-banner__text" data-qa="phase-text">
        This is a new service – your <ExternalLink className="govuk-link" href="https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback" data-qa="phase-banner-link">feedback</ExternalLink> will help us to improve it.
      </span>
    </p>
  </div>
);
