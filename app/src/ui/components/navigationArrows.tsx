import React from "react";
import { Link } from "./links";
import { ILinkInfo } from "@framework/types";
import {ArrowLeft} from "./svg/arrowLeft";
import {ArrowRight} from "./svg/arrowRight";

interface LinkProps {
  label: string;
  route: ILinkInfo;
}
interface Props {
  previousLink?: LinkProps | null;
  nextLink?: LinkProps | null;
}

export class NavigationArrows extends React.Component<Props> {
  render() {
    return (
      <div className="govuk-navigation-arrows">
        {this.renderLink(this.props.previousLink, "Previous", "arrow-right")}
        {this.renderLink(this.props.nextLink, "Next", "arrow-left")}
      </div>
    );
  }

  private renderLink(linkType: LinkProps | null | undefined, name: string, qa: string) {
    if (!linkType) return null;
    return (
      <Link route={linkType.route} replace={true} className="govuk-navigation-arrows__button">
        <ArrowLeft className="govuk-navigation-arrows__button__arrow" />
        <div data-qa={qa} className="govuk-navigation-arrows__button__label">
          <span>{name}</span>
          <span className="govuk-navigation-arrows__button__label__category">{linkType.label}</span>
        </div>
      </Link>
    );
  }
}
