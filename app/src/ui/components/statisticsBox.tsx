import React from "react";
import classNames from "classnames";
import * as colour from "../styles/colours";

interface Props {
    number: number;
    label: string;
    qa?: string;
}

export const StatisticsBox: React.SFC<Props> = (props) => {
    return (
      <div className="govuk-!-padding-2" data-qa={`statistics-box-${props.qa}`}>
        <div className={classNames("govuk-heading-l")}>{props.number}</div>
        <div className="govuk-body govuk-!-margin-bottom-0">{props.label}</div>
      </div>
    );
};
