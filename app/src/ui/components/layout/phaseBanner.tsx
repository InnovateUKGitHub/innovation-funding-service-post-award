import { useContent } from "@ui/hooks/content.hook";
import { Content } from "../content";
import { ExternalLink } from "../renderers/externalLink";

/**
 * PhaseBanner component with dashboard link
 */
export function PhaseBanner() {
  const { getContent } = useContent();

  const betaText = getContent(x => x.components.phaseBannerContent.betaText);

  const dashboardLink = (
    <ExternalLink
      className="govuk-link"
      key="beta"
      href="https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback"
      data-qa="phase-banner-link"
    >
      {" "}
    </ExternalLink>
  );

  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{betaText}</strong>

        <span className="govuk-phase-banner__text" data-qa="banner-message">
          <Content value={x => x.components.phaseBannerContent.newServiceMessage} components={[dashboardLink]} />
        </span>
      </p>
    </div>
  );
}
