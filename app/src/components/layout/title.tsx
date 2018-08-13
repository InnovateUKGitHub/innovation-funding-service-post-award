import React from "react";

interface Props {
    caption?: string;
    title: string;
}

export const Title: React.SFC<Props> = (props: Props) => (
    <div>
        <span className="govuk-caption-xl">{props.caption}</span>
        <h1 className="govuk-heading-xl clearFix">{props.title}</h1>
    </div>
);
