import * as React from "react";

export const Accordion: React.SFC = (props) => {
  return (
    <div className="acc-accordion" data-qa="accordion-container">
      {props.children}
    </div>
  );
};
