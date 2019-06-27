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

export class Link extends React.Component<Props> {
  render() {
    const { id, route, children, className } = this.props;

    return (
      <RouterLink
        id={id}
        routeName={route.routeName}
        routeParams={route.routeParams}
        className={`govuk-link ${className}`}
        successCallback={scrollToTheTopInstantly}
      >
        {children}
      </RouterLink>
    );
  }
}

// TODO go back to same place in page (no scroll to top)
export const BackLink: React.SFC<Props> = (props) => (
  <RouterLink
    routeName={props.route.routeName}
    routeParams={props.route.routeParams}
    className={classNames("govuk-back-link", props.className)}
  >
    {props.children}
  </RouterLink>
);
