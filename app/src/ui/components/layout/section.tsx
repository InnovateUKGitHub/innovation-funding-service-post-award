import * as React from "react";
import classNames from "classnames";
import { SimpleString } from "../renderers";

interface Props {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  qa?: string;
  badge?: React.ReactNode;
}

export const Section: React.SFC<Props> = (props) => {
  const { title, subtitle, badge } = props;
  return (
    <div className="govuk-grid-row govuk-!-margin-bottom-9" data-qa={props.qa}>
      <div className={classNames({ "govuk-grid-column-full": !badge, "govuk-grid-column-three-quarters": !!badge }, "govuk-!-margin-bottom-9")}>
        {!!title ? <h2 className={classNames("govuk-heading-m", { "govuk-!-margin-bottom-2": !!subtitle })}>{title}</h2> : null}
        {!!subtitle ? <SimpleString>{subtitle}</SimpleString> : null}
      </div>
      {
        !!badge ? <div className={classNames("govuk-grid-column-one-quarter", "govuk-!-margin-bottom-9")}>{badge}</div> : null
      }
      <div className="govuk-grid-column-full">
        {props.children}
      </div>
    </div>
  );
};
