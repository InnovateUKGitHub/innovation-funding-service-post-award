import React from "react";

type ExternalLinkProps = React.AnchorHTMLAttributes<{}>;

export function ExternalLink({ rel, ...props }: ExternalLinkProps) {
  const relValue = rel || "noopener noreferrer";

  return <a {...props} target="_blank" rel={relValue} />;
}
