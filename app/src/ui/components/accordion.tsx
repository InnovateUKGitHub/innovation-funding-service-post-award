import * as React from "react";

export const Accordion: React.SFC = (props) => {
  return (
    <div className="acc-accordion">
      {props.children}
    </div>
  );
}
