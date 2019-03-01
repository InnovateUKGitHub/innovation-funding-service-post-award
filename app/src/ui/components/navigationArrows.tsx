import React from "react";
import { Link } from "./";
import { ILinkInfo } from "../../types";
import {ArrowLeft} from "./svg/arrowLeft";
import {ArrowRight} from "./svg/arrowRight";

interface Props {
  previousLink: {label: string, route: ILinkInfo} | null;
  nextLink: {label: string, route: ILinkInfo} | null;
}

export class NavigationArrows extends React.Component<Props> {
  render() {
    return (
      <div className="govuk-navigation-arrows">
        {this.renderLeftHalf()}
        {this.renderRightHalf()}
      </div>
    );
  }

  private renderLeftHalf() {
    if (this.props.previousLink === null) return null;
    return (
      <Link route={this.props.previousLink.route} className="govuk-navigation-arrows__button--left">
        <div data-qa="arrow-left">
          <ArrowLeft />
          <span>Previous</span>
        </div>
        <span className="govuk-navigation-arrows__button__category">{this.props.previousLink.label}</span>
      </Link>
    );
  }

  private renderRightHalf() {
    if (this.props.nextLink === null) return null;
    return (
      <Link route={this.props.nextLink.route} className="govuk-navigation-arrows__button govuk-navigation-arrows__button--right">
        <div data-qa="arrow-right">
          <span>Next</span>
          <ArrowRight />
        </div>
        <span className="govuk-navigation-arrows__button__category">{this.props.nextLink.label}</span>
      </Link>
    );
  }

}
