interface AriaLiveProps {
  children: React.ReactNode;
}

/**
 * AriaLive component (polite)
 */
export function AriaLive(props: AriaLiveProps) {
  return <div aria-live="polite" {...props} />;
}
