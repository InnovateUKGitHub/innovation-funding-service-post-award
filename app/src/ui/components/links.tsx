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
  styling?: "Link" | "PrimaryButton" | "SecondaryButton";
}

export class Link extends React.Component<StyledLinkProps> {
  render() {
    const { id, route, children } = this.props;
    const styling = this.props.styling || "Link";
    const className = classNames({
      "govuk-link": styling === "Link",
      "govuk-button": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-button--secondary": styling === "SecondaryButton",
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

// @TODO go back to same place in page (no scroll to top)
export const BackLink: React.SFC<Props> = (props) => (
  <RouterLink
    routeName={props.route.routeName}
    routeParams={props.route.routeParams}
    className={classNames("govuk-back-link", props.className)}
  >
    {props.children}
  </RouterLink>
);
