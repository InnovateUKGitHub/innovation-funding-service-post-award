import React from "react";
import { AsyncRoute } from "../../routing";

interface Props {
  route: AsyncRoute;
}

export const Backlink: React.SFC<Props> = (props) => <a href={props.route.path} className="govuk-back-link govuk-!-margin-bottom-9">{props.children}</a>;
