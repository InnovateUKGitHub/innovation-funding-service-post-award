import React from "react";
import { ILinkInfo } from "@framework/types";
import { Link } from "./links";
import { ArrowLeft } from "./svg/arrowLeft";

interface LinkProps {
  label: string;
  route: ILinkInfo;
}

interface NavigationArrowsProps {
  previousLink?: LinkProps | null;
  nextLink?: LinkProps | null;
}

export function NavigationArrows({ previousLink, nextLink }: NavigationArrowsProps) {
  if (!previousLink && !nextLink) return null;

  return (
    <div className="govuk-navigation-arrows">
      {previousLink && <NavigationArrow {...previousLink} name="Previous" qa="arrow-right" />}

      {nextLink && <NavigationArrow {...nextLink} name="Next" qa="arrow-left" />}
    </div>
  );
}

type NavigationArrowProps = LinkProps & {
  name: string;
  qa?: string;
};

function NavigationArrow({ label, route, name, qa }: NavigationArrowProps) {
  return (
    <Link route={route} replace className="govuk-navigation-arrows__button">
      <ArrowLeft className="govuk-navigation-arrows__button__arrow" />

      <div data-qa={qa} className="govuk-navigation-arrows__button__label">
        <span>{name}</span>

        <span className="govuk-navigation-arrows__button__label__category">{label}</span>
      </div>
    </Link>
  );
}
