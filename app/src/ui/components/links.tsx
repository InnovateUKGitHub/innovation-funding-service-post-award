import React from "react";
import { Link as RouterLink } from "react-router5";

interface Props {
  id?: string;
  route: ILinkInfo;
  className?: string;
  selected?: boolean;
}

export const Link: React.SFC<Props> = (props) => (
  <RouterLink
    id={props.id}
    routeName={props.route.routeName}
    routeParams={props.route.routeParams}
    className={`govuk-link ${props.className}`}
    aria-selected={props.selected}
    successCallback={() => window.scrollTo(0, 0)}
  >{props.children}
  </RouterLink>
);

// TODO go back to same place in page (no scroll to top)
export const BackLink: React.SFC<Props> = (props) => <RouterLink routeName={props.route.routeName} routeParams={props.route.routeParams} className={`govuk-back-link ${props.className}`}>{props.children}</RouterLink>;
