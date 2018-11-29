import * as React from "react";

export const AccordionContainer: React.SFC = (props) => {
  return (
    <div className="acc-accordion">
      {props.children}
    </div>
  );
}
