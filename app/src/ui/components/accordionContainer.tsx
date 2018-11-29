import * as React from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
}

export class AccordionContainer extends React.Component<Props> {

  render() {
    return (
      <div className="acc-accordion">
        {this.props.children}
      </div>
    );
  }
}
