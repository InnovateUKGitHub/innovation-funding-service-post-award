import React from "react";
import { Link as RouterLink } from "react-router5";

interface Props {
  route: ILinkInfo;
  className?: string;
}

export const Link: React.SFC<Props> = (props) => <RouterLink routeName={props.route.routeName} routeParams={props.route.routeParams} className={`govuk-link ${props.className}`}>{props.children}</RouterLink>;

export const BackLink: React.SFC<Props> = (props) => <RouterLink routeName={props.route.routeName} routeParams={props.route.routeParams} className={`govuk-back-link ${props.className}`}>{props.children}</RouterLink>;
