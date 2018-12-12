import React from "react";

interface Props {
    caption?: string;
    title: string;
}

export const Title: React.SFC<Props> = (props: Props) => {
  const renderCaption = () => props.caption ? <span className="govuk-caption-xl">{props.caption}</span> : null;

  return (
    <div data-qa="page-title">
      {renderCaption()}
      <h1 className="govuk-heading-xl clearFix">{props.title}</h1>
    </div>
  );
};
