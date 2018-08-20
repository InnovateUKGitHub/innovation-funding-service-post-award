import React from "react";
import { Link as RouterLink } from "react-router5";
import { AsyncRoute } from "../routing";

interface Props {
  route: AsyncRoute;
  className?: string;
}

export const Link: React.SFC<Props> = (props) => <RouterLink routeName={props.route.name} className={`govuk-link ${props.className}`}>{props.children}</RouterLink>;

export const BackLink: React.SFC<Props> = (props) => <RouterLink routeName={props.route.name} className={`govuk-back-link ${props.className}`}>{props.children}</RouterLink>;
