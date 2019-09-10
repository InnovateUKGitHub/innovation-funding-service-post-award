import React from "react";
import { Link as RouterLink } from "react-router5";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { scrollToTheTopInstantly } from "@framework/util/windowHelpers";
import classNames from "classnames";

interface Props {
  id?: string;
  route: ILinkInfo;
  className?: string;
}

interface StyledLinkProps extends Props {
  styling?: "Link" | "SecondaryButton";
}

export class Link extends React.Component<StyledLinkProps> {
  render() {
    const { id, route, styling, children } = this.props;

    const baseClass = styling === "SecondaryButton" ? "govuk-button govuk-button--secondary" : "govuk-link";
    const className = classNames(baseClass, this.props.className);

    return (
      <RouterLink
        id={id}
        routeName={route.routeName}
        routeParams={route.routeParams}
        className={className}
        successCallback={scrollToTheTopInstantly}
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
