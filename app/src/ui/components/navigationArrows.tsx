import React from "react";
import { Link } from "./links";
import { ILinkInfo } from "@framework/types";
import {ArrowLeft} from "./svg/arrowLeft";
import {ArrowRight} from "./svg/arrowRight";

interface Props {
  previousLink?: {label: string, route: ILinkInfo} | null;
  nextLink?: {label: string, route: ILinkInfo} | null;
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
    if (!this.props.previousLink) return null;
    return (
      <Link route={this.props.previousLink.route} className="govuk-navigation-arrows__button">
        <ArrowLeft className="govuk-navigation-arrows__button__arrow" />
        <div data-qa="arrow-left" className="govuk-navigation-arrows__button__label">
          <span>Previous</span>
          <span className="govuk-navigation-arrows__button__label__category">{this.props.previousLink.label}</span>
        </div>
      </Link>
    );
  }

  private renderRightHalf() {
    if (!this.props.nextLink) return null;
    return (
      <Link route={this.props.nextLink.route} className="govuk-navigation-arrows__button">
        <ArrowRight className="govuk-navigation-arrows__button__arrow" />
        <div data-qa="arrow-right" className="govuk-navigation-arrows__button__label govuk-navigation-arrows__button__label">
          <span>Next</span>
          <span className="govuk-navigation-arrows__button__label__category">{this.props.nextLink.label}</span>
        </div>
      </Link>
    );
  }

}
