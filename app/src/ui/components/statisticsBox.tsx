import React from "react";
import classNames from "classnames";
import * as colour from "../styles/colours";

interface Props {
    numberOfClaims: number;
    claimAction: string;
    qa?: string;
}

export const StatisticsBox: React.SFC<Props> = (props) => {
    return (
      <div className="govuk-!-padding-2" data-qa={`statistics-box-${props.qa}`}>
        <div className={classNames("govuk-heading-m")}>{props.numberOfClaims}</div>
        <div className="govuk-body govuk-!-margin-bottom-0" style={{color: colour.GOVUK_SECONDARY_TEXT_COLOUR}}>{props.claimAction}</div>
      </div>
    );
};
