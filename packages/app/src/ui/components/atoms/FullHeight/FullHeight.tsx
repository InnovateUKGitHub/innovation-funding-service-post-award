interface LayoutProps {
  children: React.ReactNode;
  className?: never;
}

/**
 * full height container div
 */
function Container(props: LayoutProps) {
  return <div className="full-height-container" {...props} />;
}

/**
 * full height content div
 */
function Content(props: LayoutProps) {
  return <div className="full-height-content" {...props} />;
}

// Note: These are exported under a variable as they have to work in tandem, this approach makes it clearer during usage.
export const FullHeight = {
  Container,
  Content,
};
