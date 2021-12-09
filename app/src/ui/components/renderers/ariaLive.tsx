interface AriaLiveProps {
  children: React.ReactNode;
}

export function AriaLive(props: AriaLiveProps) {
  return <div aria-live="polite" {...props} />;
}
