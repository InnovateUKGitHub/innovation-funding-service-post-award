import * as React from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
}

export class AccordionContainer extends React.Component<Props> {

  render() {
    return (
      <div className="govuk-accordion">
        {this.props.children}
      </div>
    );
  }
}
