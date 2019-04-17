import React from "react";

export const AriaLive: React.FunctionComponent = (props) => {
  return (
    <div aria-live="polite">
      {props.children}
    </div>
  );
};
