import * as React from "react";

interface Props {
  className?: string;
}

export const ArrowRight = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13" className={props.className}>
    <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z" />
  </svg>
);
