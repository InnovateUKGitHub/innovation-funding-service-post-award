export interface ExternalLinkProps extends React.AnchorHTMLAttributes<{}> {
  href: string;
  children: string | React.ReactElement;
}

/**
 * External link component
 */
export function ExternalLink({ rel, children, ...props }: ExternalLinkProps) {
  const relValue = rel || "noopener noreferrer";

  return (
    <a {...props} target="_blank" rel={relValue}>
      {children}
    </a>
  );
}
