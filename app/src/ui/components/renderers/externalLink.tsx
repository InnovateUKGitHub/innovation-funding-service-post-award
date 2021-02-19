import React from "react";

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<{}> {
  alt: string;
  href: string;
  children: string | React.ReactElement;
}

export function ExternalLink({ rel, children, ...props }: ExternalLinkProps) {
  const relValue = rel || "noopener noreferrer";

  return <a {...props} target="_blank" rel={relValue}>{children}</a>;
}
