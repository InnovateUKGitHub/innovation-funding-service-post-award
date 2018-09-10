import React from "react";
import { Link as RouterLink } from "react-router5";
import { AsyncRoute } from "../routing/index";

interface Props {
  route: AsyncRoute;
  routeParams?: any;
  className?: string;
}

export const Link: React.SFC<Props> = (props) => <RouterLink routeName={props.route.name} routeParams={props.routeParams} className={`govuk-link ${props.className}`}>{props.children}</RouterLink>;

export const BackLink: React.SFC<Props> = (props) => <RouterLink routeName={props.route.name} className={`govuk-back-link ${props.className}`}>{props.children}</RouterLink>;
