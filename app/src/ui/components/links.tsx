import React from "react";
import { Link as RouterLink } from "react-router5";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { scrollToTheTopInstantly } from "@framework/util/windowHelpers";
import classNames from "classnames";

interface Props {
  id?: string;
  route: ILinkInfo;
  className?: string;
  replace?: boolean;
}

interface StyledLinkProps extends Props {
  styling?: "Link" | "PrimaryButton" | "SecondaryButton" | "BackLink";
}

export class Link extends React.Component<StyledLinkProps> {
  render() {
    const { id, route, children } = this.props;
    const styling = this.props.styling || "Link";
    const className = classNames({
      "govuk-link": styling === "Link",
      "govuk-button": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-!-margin-right-1": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-button--secondary": styling === "SecondaryButton",
      "govuk-back-link": styling === "BackLink"
    }, this.props.className);

    const options = {
      replace: this.props.replace === true ? true : undefined
    };

    return (
      <RouterLink
        id={id}
        routeName={route.routeName}
        routeParams={route.routeParams}
        className={className}
        successCallback={scrollToTheTopInstantly}
        routeOptions={options}
      >
        {children}
      </RouterLink>
    );
  }
}

export const BackLink: React.SFC<Props> = (props) => (
  <Link styling="BackLink" {...props}>{props.children}</Link>
);
