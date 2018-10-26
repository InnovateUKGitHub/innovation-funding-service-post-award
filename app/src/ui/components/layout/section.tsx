import * as React from "react";

interface Props {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  qa?: string;
}

const renderTitleOnly = (title: React.ReactNode) => <h2 className="govuk-heading-m govuk-!-margin-bottom-9">{title}</h2>;

const renderTitleAndSubtitle = (title: React.ReactNode, subtitle: React.ReactNode) => {
  return (
    <React.Fragment>
      <h2 className="govuk-heading-m govuk-!-margin-bottom-2">{title}</h2>
      <p className="govuk-body govuk-!-margin-bottom-9">{subtitle}</p>
    </React.Fragment>
  );
};

const renderHeader = ({title, subtitle}: Props) => {
  if (title && subtitle) {
    return renderTitleAndSubtitle(title, subtitle);
  }
  if (title) {
    return renderTitleOnly(title);
  }
  return null;
};

export const Section: React.SFC<Props> = (props) => {
  return (
    <div className="govuk-!-margin-bottom-9" data-qa={props.qa}>
      {renderHeader(props)}
      {props.children}
    </div>
  );
};
