import React from "react";

interface Props {
    path: string;
    children: any;
}

export const Backlink: React.SFC<Props> = (props: Props) =>  <a href={props.path} className="govuk-back-link govuk-!-margin-bottom-9">{props.children}</a>;
